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
  appMenuInit,
  autoUpdaterInit,
  ProcessFile,
  settingsInitialization,
  buildAppUI,
  optimizeClipboardSVG,
} from "./scripts";

log.info("App starting...");

app.allowRendererProcessReuse = true;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  settingsInitialization();
  appMenuInit();
  buildAppUI();

  if (settings.getSync("app.updateCheck") === true) {
    autoUpdater.checkForUpdates();
  }
  // Handler for when text data is copied into the clipboard
  clipboardWatcher({
    onTextChange: (SVGxml: string) => {
      // XML Validator
      if (settings.getSync("app.clipboardWatcher")) {
        if (parser.validate(SVGxml) && SVGxml.includes("<svg")) {
          optimizeClipboardSVG("get-svg-from-clipboard", SVGxml);
        }
      }
    },
  });

  if (settings.getSync("app.updateCheck")) {
    autoUpdaterInit();
  }
});

ipcMain.on("set-auto-updater", () => autoUpdaterInit());
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
