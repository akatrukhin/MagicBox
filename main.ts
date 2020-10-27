import {
  app,
  ipcMain,
  Notification,
  NotificationConstructorOptions,
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
  optimizeClipboardSVG,
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
    // clipboardWatcher({
    //   onTextChange: (SVGxml: string) => {
    //     // XML Validator
    //     if (settings.get("app.clipboardWatcher")) {
    //       if (parser.validate(SVGxml) && SVGxml.includes("<svg")) {
    //         optimizeClipboardSVG("get-svg-from-clipboard", SVGxml);
    //       }
    //     }
    //   },
    // });

    if (settings.get("app.updateCheck")) {
      AutoUpdaterInit();
    }
  });

  ipcMain.on("set-auto-updater", () => AutoUpdaterInit());
  ipcMain.on("check-for-updates", () => autoUpdater.checkForUpdates());
  ipcMain.on("file-optimization", (event, file, customPath?: string) =>
    ProcessFile(file, customPath)
  );
  ipcMain.on(
    "show-notification",
    (e, message: NotificationConstructorOptions) => {
      const notification = new Notification(message);
      notification.show();
    }
  );
  ipcMain.on("quitAndInstall", (event, arg) => {
    log.info(event);
    log.info(arg);
    autoUpdater.quitAndInstall();
  });
} catch (e) {
  // Catch Error
  throw e;
}
