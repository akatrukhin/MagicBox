import { Injectable } from "@angular/core";

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {
  ipcRenderer,
  remote,
  shell,
  dialog,
  clipboard,
  NotificationConstructorOptions,
  BrowserWindow,
} from "electron";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as settings from "electron-settings";

@Injectable({
  providedIn: "root",
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  remote: typeof remote;
  dialog: typeof dialog;
  clipboard: typeof clipboard;
  fs: typeof fs;
  path: typeof path;
  settings: typeof settings;
  shell: typeof shell;
  os: typeof os;
  mainWindow: BrowserWindow;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require("electron").ipcRenderer;
      this.remote = window.require("electron").remote;
      this.shell = window.require("electron").shell;
      this.dialog = window.require("electron").dialog;
      this.clipboard = window.require("electron").clipboard;
      this.mainWindow = this.remote.BrowserWindow.getAllWindows()[0];

      this.settings = window
        .require("electron")
        .remote.require("electron-settings");

      this.fs = window.require("fs");
      this.path = window.require("path");
      this.os = window.require("os");
    }
  }

  public showNotification(message: NotificationConstructorOptions) {
    if (this.settings.getSync("app.notification") && !this.mainWindow.isFocused()) {
      const Notification = this.remote.Notification;
      const notification = new Notification(message);
      notification.show();
    }
  }
}
