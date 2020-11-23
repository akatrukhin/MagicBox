import { Injectable } from "@angular/core";
import { remote } from "electron";
import * as settings from "electron-settings";

export enum Themes {
  Dark = "ultra-dark",
  Light = "light",
}

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  remote: typeof remote;
  settings: typeof settings;
  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.remote = window.require("electron").remote;
      this.settings = window
        .require("electron")
        .remote.require("electron-settings");
    }
  }

  public switchTheme(theme: Themes): void {
    document.documentElement.setAttribute("data-theme", theme);
    const window = this.remote.getCurrentWindow();
    window.setVibrancy(theme);
    if (process.platform === "darwin") {
      this.remote.systemPreferences.appLevelAppearance =
        theme === Themes.Light ? "light" : "dark";
    }
  }

  public initTheme(): void {
    if (this.isElectron()) {
      const theme = this.settings.getSync("appearance.theme");
      this.switchTheme(theme as Themes);
    }
  }

  private isElectron() {
    return window && window.process && window.process.type;
  }
}
