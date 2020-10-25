import { Notification } from "electron";
import { autoUpdater } from "electron-updater";
import * as log from "electron-log";
import * as isDev from "electron-is-dev";
import * as path from "path";
import * as os from "os";

import { win } from "./window";

autoUpdater.logger = log;

export function AutoUpdaterInit() {
  autoUpdater.setFeedURL({
    provider: "github",
    owner: "akatrukhin",
    repo: "MagicBox",
  });
  if (isDev) {
    autoUpdater.updateConfigPath = path.join(
      __dirname,
      "../dev-app-update.yml"
    );
  }
  autoUpdater.on("checking-for-update", () => {
    win.webContents.send("update-status", "Checking for update...");
  });
  autoUpdater.on("update-available", (info) => {
    win.webContents.send("update-status", "Update available");
    const notif = new Notification({
      title: "Update available",
      body: "A newer version of MagicBox is available",
    });
    notif.show();
  });
  autoUpdater.on("update-not-available", (info) => {
    win.webContents.send("update-status", "Update not available.");
  });
  autoUpdater.on("error", (err) => {
    win.webContents.send("update-status", "App updete error: " + err);
  });
  autoUpdater.on("download-progress", (progressObj) => {
    let log_message =
      "Update downloaded " + Math.round(progressObj.percent) + "%";
    log_message =
      log_message +
      " (" +
      fileSize(progressObj.transferred) +
      "/" +
      fileSize(progressObj.total) +
      ")";
    win.webContents.send("update-status", log_message);
  });
  autoUpdater.on("update-downloaded", (info) => {
    autoUpdater.quitAndInstall();
  });
}

function fileSize(bytes: number): string {
  const blockSize = os.platform() === "darwin" ? 1000 : 1024;
  switch (true) {
    case bytes >= Math.pow(blockSize, 3):
      return (bytes / Math.pow(blockSize, 3)).toFixed(2) + "GB";
    case bytes >= Math.pow(blockSize, 2):
      return (bytes / Math.pow(blockSize, 2)).toFixed(2) + "MB";
    case bytes >= blockSize:
      return (bytes / blockSize).toFixed(2) + "KB";
    case bytes > 1:
      return bytes + "bytes";
    case bytes === 1:
      return bytes + "byte";
    default:
      return "0" + "bytes";
  }
}
