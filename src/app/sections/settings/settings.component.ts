import { Component, OnInit, OnDestroy } from "@angular/core";
import { ElectronService, ThemeService, Themes } from "../../core/services";
import { ViewTransition } from "../../shared/animations";

interface ISetting {
  id: string;
  name: string;
  status?: boolean;
}

interface IImages {
  jpeg: {
    quality: string;
  };
  webp: {
    quality: string;
    alpha: string;
  };
  tiff: {
    quality: string;
  };
  svg: {
    precision: string;
  };
}

enum ESettings {
  notification = "Enable notifications",
  suffix = "Add .min suffix to shrinked file",
  updateCheck = "Auto-updates",
  defaultGridView = "Files preview as Grid",
  clipboardWatcher = "Clipboard SVG watcher",
  fileWatcher = "Track files updates",
}

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  animations: [ViewTransition],
})
export class SettingsComponent implements OnInit, OnDestroy {
  settings: ISetting[];
  // Images quality
  images: IImages;
  // Appearance
  appearance: {
    theme: Themes;
    smallNav: boolean;
  };
  themes = Themes;
  // Update
  updateStatus: string;
  appVersion: string;

  constructor(
    private electronService: ElectronService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.settings = [];
    const appSettings = this.electronService.settings.get("app");
    Object.keys(ESettings).forEach((item) => {
      this.settings.push({
        id: item,
        name: ESettings[item],
        status: appSettings[item],
      });
    });
    this.images = this.electronService.settings.get("images");
    this.appearance = this.electronService.settings.get("appearance");
    this.appVersion = this.electronService.remote.app.getVersion();

    this.electronService.ipcRenderer.on("update-status", (e, message) => {
      this.updateStatus = message;
      console.log(`Auto Updater Status: \n ${message}`);
    });
  }

  ngOnDestroy() {
    this.electronService.settings.set("images", this.images);
  }

  public checkOwnProperty(setting: ISetting): boolean {
    return setting.hasOwnProperty("status");
  }

  private saveSettings(): void {
    const _settings = {};
    this.settings.forEach((item) => {
      _settings[item.id] = item.status;
    });
    this.electronService.settings.set("app", _settings);
  }

  public onThemeChange(e: "Dark" | "Light"): void {
    const theme = e === "Dark" ? Themes.Dark : Themes.Light;
    this.appearance.theme = theme;
    this.themeService.switchTheme(theme);
    this.electronService.settings.set("appearance.theme", theme);
  }

  public setNavigationBarStyle(): void {
    this.appearance.smallNav = !this.appearance.smallNav;
    this.electronService.settings.set("appearance", this.appearance);
  }

  public setUserSettings(setting: ISetting): void {
    if (setting.hasOwnProperty("status")) {
      setting.status = !setting.status;
      this.saveSettings();
      if (setting.name === ESettings.updateCheck && setting.status) {
        this.electronService.ipcRenderer.send("setAutoUpdater");
      }
    }
  }
}
