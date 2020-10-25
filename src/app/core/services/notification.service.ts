import { Injectable } from "@angular/core";

import { NotificationConstructorOptions, remote } from "electron";
import * as settings from "electron-settings";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  settings: typeof settings;
  remote: typeof remote;

  constructor() {
    if (this.isElectron()) {
      this.settings = window
        .require("electron")
        .remote.require("electron-settings");
      this.remote = window.require("electron").remote;
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  showNotification = (message: NotificationConstructorOptions) => {
    if (this.settings.get("app.notification")) {
      const Notification = this.remote.Notification;
      const notification = new Notification(message);
      notification.show();
    }
  }
}
