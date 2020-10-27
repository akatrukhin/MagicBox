import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  dialog,
  ipcMain,
  OpenDialogOptions,
} from "electron";
import * as windowStateKeeper from "electron-window-state";
import * as url from "url";
import * as path from "path";
import * as isDev from "electron-is-dev";
import * as log from "electron-log";

export let win: BrowserWindow;

export interface IWinConfig {
  position?: {
    x: number;
    y: number;
  };
  windowSize: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
  };
}

export function createWindow({ position, windowSize }: IWinConfig) {
  const config: BrowserWindowConstructorOptions = {
    width: windowSize.width,
    height: windowSize.height,
    minWidth: windowSize.minWidth,
    minHeight: windowSize.minHeight,
    backgroundColor: "#80000000",
    transparent: true,
    vibrancy: "ultra-dark",
    frame: true,
    resizable: true,
    titleBarStyle: "hiddenInset",
    icon: path.join(__dirname, "../dist/app-icon.icns"),
    webPreferences: {
      experimentalFeatures: true,
    },
  };
  if (position) {
    config.x = position.x;
    config.y = position.y;
  } else {
    config.center = true;
  }
  return new BrowserWindow(config);
}

export function buildAppUI() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 996,
    defaultHeight: 608,
  });
  win = createWindow({
    position: {
      x: mainWindowState.x,
      y: mainWindowState.y,
    },
    windowSize: {
      width: mainWindowState.width,
      height: mainWindowState.height,
      minWidth: 760,
      minHeight: 480,
    },
  });

  mainWindowState.manage(win);

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "../dist/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  ipcMain.once("set-project-folder", () => {
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
      try {
        win.webContents.send("get-folder-path", filePaths);
      } catch (e) {
        log.error(e);
      }
    });
  });

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = undefined;
  });
}

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
  if (win === undefined) {
    buildAppUI();
  }
});
