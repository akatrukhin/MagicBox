import { dialog, app } from "electron";
import * as fs from "fs";
import * as path from "path";

import * as glob from "glob";
import * as archiver from "archiver";

import * as settings from "electron-settings";
import * as log from "electron-log";
import * as makeDir from "make-dir";

// Image libraries
import * as child_process from "child_process";
import * as mozjpegJs from "mozjpeg-js";
import * as pngquant from "pngquant-bin";
import * as gif from "gifsicle";
import * as sharp from "sharp";

import { win } from "./window";
import { SVGPluginSettings, SketchPluginsRoot } from "./config";

const sendToRenderer = (err, id, _path) => {
  if (!err) {
    win.webContents.send(id, _path);
  } else {
    log.error(err);
    win.webContents.send(id, "error");
    dialog.showMessageBox({
      type: "error",
      message: `Something went wrong, sorry... 😞`,
    });
  }
};

// Create a new path
const setNewPath = (filePath: string, customPath?: string) => {
  const objPath = path.parse(filePath);
  if (customPath) {
    objPath.dir = customPath;
  }
  makeDir.sync(objPath.dir);
  // Check Settings
  const suffix = settings.get("app.suffix") ? ".min" : "";
  objPath.base = objPath.name + suffix + objPath.ext;
  return path.format(objPath);
};

const unpackSketchFile = (file) => {
  return new Promise((resolve) => {
    child_process
      .spawn("/usr/bin/unzip", [
        "-o",
        file.original.path,
        "-d",
        SketchPluginsRoot,
      ])
      .on("exit", () => {
        resolve(`💾  Sketch file unpacked`);
      });
  });
};

const deleteFolderRecursive = (folder: string) => {
  if (fs.existsSync(folder)) {
    fs.readdirSync(folder).forEach((file) => {
      const curPath = folder + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folder);
  }
};

const packSketchFile = (newPath, file) => {
  return new Promise((resolve) => {
    const output = fs.createWriteStream(newPath);
    const sketch = archiver("zip", {
      zlib: { level: 9 },
    });
    output.on("close", () => {
      log.info(sketch.pointer() + " total bytes");
      deleteFolderRecursive(SketchPluginsRoot);
      sendToRenderer(null, file.id, newPath);
      resolve();
    });
    sketch.pipe(output);
    sketch.directory(SketchPluginsRoot, false).finalize();
  });
};

const optimizeJSONValues = (json) => {
  for (const item in json) {
    if (json.hasOwnProperty(item)) {
      if (
        `${item}` === "curveFrom" ||
        `${item}` === "curveTo" ||
        `${item}` === "point"
      ) {
        const regexX = /\{(.*?)\,/;
        const resultX = regexX.exec(json[item]);
        const regexY = /\s(.*?)\}/;
        const resultY = regexY.exec(json[item]);
        const x = Number.isInteger(Number(resultX[1]))
          ? resultX[1]
          : Number(resultX[1]).toFixed(2);
        const y = Number.isInteger(Number(resultY[1]))
          ? resultY[1]
          : Number(resultY[1]).toFixed(2);
        json[item] = `{${x}, ${y}}`;
      }
      if (typeof json[item] === "object") {
        optimizeJSONValues(json[item]);
      }
    }
  }
};

const optmizeJSON = (filePath: string) =>
  new Promise((resolve) => {
    fs.readFile(filePath, "utf8", (err, contents) => {
      const json = JSON.parse(contents);
      optimizeJSONValues(json);
      fs.writeFile(filePath, JSON.stringify(json), () => {
        resolve();
      });
    });
  });

const optimizeSketchSourceImages = (sources, newPath, file) => {
  const promises = [];
  sources.map((data) => {
    promises.push(
      new Promise((resolve) => {
        switch (path.extname(data).toLowerCase()) {
          case ".png": {
            child_process.execFile(
              pngquant,
              ["-fo --strip", data, data],
              () => {
                resolve(`${data} optimized`);
              }
            );
            break;
          }
          case ".jpg":
          case ".jpeg": {
            child_process.execFile(
              "jpegtran",
              ["-copy", "none", "-optimize", "-outfile", data, data],
              () => {
                const input = fs.readFileSync(data);
                const out = mozjpegJs.encode(input, {
                  quality: settings.get("jpeg.quality"),
                });
                fs.writeFile(data, out.data, (_error) => {
                  resolve(`${data} optimized`);
                });
              }
            );
            break;
          }
          case ".gif": {
            child_process.execFile(gif, ["-o", data, data], () =>
              resolve(`${data} optimized`)
            );
            break;
          }
          case ".webp": {
            sharp(data)
              .webp({
                lossless: true,
                quality: settings.get("webp.quality"),
                alphaQuality: settings.get("webp.alpha"),
                nearLossless: true,
              })
              .toFile(data, () => resolve(`${data} optimized`));
            break;
          }
          case ".tiff": {
            sharp(data)
              .tiff({
                compression: "lzw",
                quality: settings.get("tiff.quality"),
                squash: true,
              })
              .toFile(data, () => resolve(`${data} optimized`));
            break;
          }
          case ".json": {
            optmizeJSON(data).then(() => {
              resolve(`${data} optimized`);
            });
            break;
          }
        }
      })
    );
  });
  Promise.all(promises).then((values) => {
    log.info(values);
    packSketchFile(newPath, file);
  });
};

const optimizeSketchFile = (file, newPath) => {
  unpackSketchFile(file).then((resolve) => {
    log.info(resolve);
    glob(
      SketchPluginsRoot + "/**/*.{jpg,jpeg,png,gif,json,tiff,webp}",
      (error, sources) => {
        optimizeSketchSourceImages(sources, newPath, file);
      }
    );
  });
};

export const ProcessFile = (file, customPath?: string) => {
  fs.readFile(file.original.path, "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    // Add to recent documents list in OS
    app.addRecentDocument(file.original.path);
    // Depends on settings generate a new file
    const newPath = setNewPath(file.original.path, customPath);
    switch (path.extname(file.original.name).toLowerCase()) {
      case ".svg": {
        const evenodd = `fill-rule="evenodd"`;
        const nonzero = `fill-rule="nonzero"`;
        SVGPluginSettings()
          .optimize(data)
          .then((result) => {
            if (
              result.data.includes(evenodd) &&
              result.data.includes(nonzero)
            ) {
              result.data.replace(evenodd, "");
              result.data.replace(nonzero, "");
            }
            fs.writeFile(newPath, result.data, (error) => {
              sendToRenderer(error, file.id, newPath);
            });
          });
        break;
      }
      case ".jpg":
      case ".jpeg": {
        child_process.execFile(
          "jpegtran",
          [
            "-copy",
            "none",
            "-optimize",
            "-outfile",
            newPath,
            file.original.path,
          ],
          () => {
            const input = fs.readFileSync(file.original.path);
            const out = mozjpegJs.encode(input, {
              quality: settings.get("jpeg.quality"),
            });
            fs.writeFile(newPath, out.data, (_error) => {
              sendToRenderer(_error, file.id, newPath);
            });
          }
        );
        break;
      }
      case ".png": {
        child_process.execFile(
          pngquant,
          ["-fo", newPath, file.original.path],
          (error) => sendToRenderer(error, file.id, newPath)
        );
        break;
      }
      case ".gif": {
        child_process.execFile(
          gif,
          ["-o", newPath, file.original.path],
          (error) => sendToRenderer(error, file.id, newPath)
        );
        break;
      }
      case ".webp": {
        sharp(file.original.path)
          .webp({
            lossless: true,
            quality: settings.get("webp.quality"),
            alphaQuality: settings.get("webp.alpha"),
            nearLossless: true,
          })
          .toFile(newPath, (error) => sendToRenderer(error, file.id, newPath));
        break;
      }
      case ".tiff": {
        sharp(file.original.path)
          .tiff({
            compression: "lzw",
            quality: settings.get("tiff.quality"),
            squash: true,
          })
          .toFile(newPath, (error) => sendToRenderer(error, file.id, newPath));
        break;
      }
      case ".sketch": {
        optimizeSketchFile(file, newPath);
        break;
      }
      default:
        win.webContents.send("error");
        dialog.showMessageBox({
          type: "error",
          message:
            file.original.name +
            " Only SVG, JPG, GIF and PNG allowed, extention " +
            path.extname(file.original.name),
        });
    }
  });
};

export const optimizeClipboardSVG = (event: string, SVGxml: string) => {
  const evenodd = `fill-rule="evenodd"`;
  const nonzero = `fill-rule="nonzero"`;
  SVGPluginSettings()
    .optimize(SVGxml)
    .then((result) => {
      if (result.data.includes(evenodd) && result.data.includes(nonzero)) {
        result.data.replace(evenodd, "");
        result.data.replace(nonzero, "");
      }
      win.webContents.send(event, {
        source: SVGxml,
        optimized: result.data,
      });
    });
};
