import {
  app,
  ipcMain,
  dialog,
  OpenDialogOptions,
  Notification,
} from "electron";
import { autoUpdater } from "electron-updater";

import * as settings from "electron-settings";
import * as log from "electron-log";
import * as clipboardWatcher from "electron-clipboard-watcher";
import * as parser from "fast-xml-parser";

import {
  win,
  AppMenuInit,
  AutoUpdaterInit,
  ProcessFile,
  ProcessSVGfromClipboard,
  SettingsInitialization,
  buildAppUI,
} from "./scripts";

log.info("App starting...");

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", () => {
    buildAppUI();
    SettingsInitialization();
    AppMenuInit();

    if (settings.get("app.updateCheck", {}) === true) {
      autoUpdater.checkForUpdates();
    }
    // Handler for when text data is copied into the clipboard
    clipboardWatcher({
      onTextChange: (SVGxml: string) => {
        // XML Validator
        if (settings.get("app.clipboardWatcher")) {
          if (parser.validate(SVGxml) && SVGxml.includes("<svg")) {
            ProcessSVGfromClipboard(SVGxml);
          }
        }
      },
    });

    if (settings.get("app.updateCheck")) {
      AutoUpdaterInit();
    }
  });
  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (!win) {
      buildAppUI();
    }
  });

  ipcMain.on("setAutoUpdater", () => AutoUpdaterInit());
  ipcMain.on("checkForUpdates", () => autoUpdater.checkForUpdates());
  ipcMain.on("optimizeImage", (event, file, customPath?: string) =>
    ProcessFile(file, customPath)
  );
  ipcMain.on("setFolder", () => {
    const options: OpenDialogOptions = {
      properties: [
        "openDirectory",
        "createDirectory",
        "noResolveAliases",
        "treatPackageAsDirectory",
      ],
      message:
        "All optimized images will be automaticly exported to selected folder",
    };
    dialog.showOpenDialog(null, options, (filePaths) => {
      win.webContents.send("setFolder", filePaths);
    });
  });
  ipcMain.on("quitAndInstall", (event, arg) => {
    log.info(event);
    log.info(arg);
    autoUpdater.quitAndInstall();
  });
} catch (e) {
  // Catch Error
  throw e;
}
