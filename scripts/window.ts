import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  dialog,
  ipcMain,
  OpenDialogOptions,
} from "electron";
import * as windowStateKeeper from "electron-window-state";
import * as settings from "electron-settings";
import * as url from "url";
import * as path from "path";
import * as isDev from "electron-is-dev";
import * as log from "electron-log";

export let win: BrowserWindow = null;

// tslint:disable
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
  }
}

export const createWindow = ({ position, windowSize }: IWinConfig) => {
  const config: BrowserWindowConstructorOptions = {
    width: windowSize.width,
    height: windowSize.height,
    minWidth: windowSize.minWidth,
    minHeight: windowSize.minHeight,
    titleBarStyle: "hiddenInset",
    frame: false,
    darkTheme: settings.getSync("appearance.theme") === "ultra-dark" ? true : false,
    vibrancy: settings.getSync("appearance.theme") === "ultra-dark" ? "ultra-dark" : "light",
    transparent: true,
    backgroundColor: "#80000000",
    type: "textured",
    resizable: true,
    icon: path.join(__dirname, "../build/app-icon.png"),
    webPreferences: {
      // enableRemoteModule: true,
      experimentalFeatures: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      // spellcheck: false
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

export const buildAppUI = () => {
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
    win.webContents.openDevTools({ mode: 'undocked' });
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
    // dialog.showOpenDialog(options).then((result) => {
    //   try {
    //     win.webContents.send("get-folder-path", result);
    //   } catch (e) {
    //     log.error(e);
    //   }
    // });
    dialog.showOpenDialog(options, (result) => {
      try {
        win.webContents.send("get-folder-path", result);
      } catch (e) {
        log.error(e);
      }
    });
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
  if (BrowserWindow.getAllWindows().length === 0) {
    buildAppUI();
  }
});
