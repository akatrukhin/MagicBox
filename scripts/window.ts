import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import * as windowStateKeeper from "electron-window-state";
import * as url from "url";
import * as path from "path";
import * as isDev from "electron-is-dev";

const iconPath = path.join(__dirname, "../dist/app-icon.icns");
const uiPath = path.join(__dirname, "../dist/index.html");

export let win;

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

export const createWindow = ({ position, windowSize }: IWinConfig) => {
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
    icon: iconPath,
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
};

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
    win.webContents.openDevTools();
  }

  win.loadURL(
    url.format({
      pathname: uiPath,
      protocol: "file:",
      slashes: true,
    })
  );

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
};
