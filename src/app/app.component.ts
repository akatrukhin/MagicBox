import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import {
  ElectronService,
  ThemeService,
  PreviewFileService,
  SetService,
} from "./core/services";
import {
  svgCopiedFromApp,
  Clipboard,
  Import,
  AppFile,
  FileStatus,
  IFile,
} from "./data";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public clipboardNotificationView = false;
  public previewView = false;
  private currentRoute: string;

  constructor(
    private electronService: ElectronService,
    private router: Router,
    private previewFileService: PreviewFileService,
    private themeService: ThemeService,
    private setService: SetService
  ) {
    this.themeService.initTheme();

    if (electronService.isElectron) {
      Object.keys(process.env).forEach((item) =>
        console.log(`${item}: ${process.env[item]}`)
      );
      console.log("\n");

      if (electronService.settings.get("other.path")) {
        this.router.navigate([electronService.settings.get("other.path")]);
      }

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          electronService.settings.set("other", { path: event.url });
          previewFileService.componentViewStatus(false);
          this.currentRoute = event.url;
        }
      });

      if (electronService.settings.get("app.clipboardWatcher")) {
        electronService.ipcRenderer.on(
          "get-svg-from-clipboard",
          (event, svg) => {
            if (svg.source !== svgCopiedFromApp) {
              electronService.showNotification({
                title: `SVG data copied`,
                body: `New svg file was added to your clipboard page`,
                silent: true,
              });
              const optimizedSVG = new AppFile(
                this.createSvgFile(svg.source),
                this.createSvgFile(svg.optimized)
              );
              optimizedSVG.hasSourceFile = true;
              optimizedSVG.status = FileStatus.optimized;
              Clipboard.files.push(optimizedSVG);
              this.clipboardNotificationView = true;
            }
          }
        );
      }

      electronService.ipcRenderer.on(
        "paste-svg-from-clipboard",
        (event, svg) => {
          const optimizedSVG = new AppFile(
            this.createSvgFile(svg.source),
            this.createSvgFile(svg.optimized)
          );
          optimizedSVG.hasSourceFile = true;
          optimizedSVG.status = FileStatus.optimized;

          console.log(
            `Route: ${this.currentRoute} recieved SVG from clipboard: \n`,
            optimizedSVG
          );

          switch (true) {
            case this.currentRoute.includes("/import"):
              Import.files.push(optimizedSVG);
              break;
            case this.currentRoute.includes("/settings"):
              Import.files.push(optimizedSVG);
              this.router.navigate(["/import"]);
              break;
            case this.currentRoute.includes("/clipboard"):
              Clipboard.files.push(optimizedSVG);
              break;
            case this.currentRoute.includes("/sets/"):
              const setId = this.currentRoute.slice(
                6,
                this.currentRoute.length
              );
              const set = this.setService.getSet(setId);
              if (set) {
                set.files.push(optimizedSVG);
                set.setStatistics();
                this.setService.saveSets();
              }
              break;
          }
        }
      );
    }
    previewFileService.viewStatus.subscribe((viewStatus: boolean) => {
      this.previewView = viewStatus;
    });
  }

  public showClipboard() {
    this.clipboardNotificationView = false;
    this.previewFileService.showPreviewFile(
      Clipboard.files[Clipboard.files.length - 1]
    );
    this.previewFileService.componentViewStatus(true);
  }

  public copyToClipboard() {
    this.electronService.clipboard.writeText(
      Clipboard.files[Clipboard.files.length - 1].shrinked.data
    );
  }

  private createSvgFile(data: string): IFile {
    return new IFile(
      undefined,
      "image/svg+xml",
      "Imported SVG image",
      new TextEncoder().encode(data).length,
      data,
      new Date().getTime()
    );
  }
}
