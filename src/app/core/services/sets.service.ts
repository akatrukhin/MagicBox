import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ipcRenderer, remote } from "electron";
import * as fs from "fs";
import * as settings from "electron-settings";
import { Set, AppFile, FileStatus, Import, Clipboard } from "../../data";

@Injectable({
  providedIn: "root",
})
export class SetService {
  ipcRenderer: typeof ipcRenderer;
  settings: typeof settings;
  remote: typeof remote;
  fs: typeof fs;
  Sets = [];

  public getFromSettings(params: string) {
    if (this.isElectron) {
      return this.settings.getSync(params);
    }
  }

  public hasInSettings(params: string) {
    if (this.isElectron) {
      return this.settings.has(params);
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor(private router: Router) {
    if (this.isElectron) {
      this.settings = window
        .require("electron")
        .remote.require("electron-settings");
      this.remote = window.require("electron").remote;
      this.fs = window.require("fs");
      this.ipcRenderer = window.require("electron").ipcRenderer;

      if (this.settings.getSync("app.fileWatcher")) {
        this.startWatchAllFiles();
      }

      if (this.settings.has("sets")) {
        const sets = [...this.settings.getSync("sets") as Array<any>];
        sets.forEach((item: object) => {
          const set = new Set({ ...item });
          set.setStatistics();
          this.Sets.push(set);
        });
      }
    }
  }

  public removeFiles = (setID: string, files: AppFile[]): void => {
    let set;
    switch (true) {
      case setID === "import":
        set = Import;
        break;
      case setID === "clipboard":
        set = Clipboard;
        break;
      default:
        set = this.getSet(setID);
        break;
    }
    files.forEach((file) => {
      // Stop watching
      if (this.isElectron && this.getFromSettings("app.fileWatcher")) {
        this.unsubscribeFile(file);
      }
      // Remove from the list
      set.files = set.files.filter((source: AppFile) => {
        return source.id !== file.id;
      });
    });
    set.setStatistics();
    this.saveSets();
  };

  public getSet = (id: string): Set => {
    return this.Sets.find((set) => set.id === id);
  };

  public saveSet = (id: string): void => {
    // TODO:
    this.getSet(id);
    console.log(this.settings.getSync("sets"));
  };

  public saveSets = (): void => {
    if (this.isElectron) {
      this.settings.setSync("sets", this.Sets);
    }
  };

  private unsubscribeFile = (file: AppFile): void => {
    if (this.isElectron && file.original.path) {
      this.fs.unwatchFile(file.original.path);
    }
  };

  public resetFileStatus = (setId: string): void => {
    const set = this.getSet(setId);
    set.files.forEach((file) => {
      if (this.fs.existsSync(file.original.path) || !file.shrinked) {
        file.status = FileStatus.needsUpdate;
      }
    });
    this.getSet(setId).setStatistics();
    this.saveSets();
  };

  public removeAllFilesInSet = (setId: string): void => {
    const set = this.getSet(setId);
    set.files.length = 0;
    set.setStatistics();
    this.saveSets();
  };

  public async exportFolder(setId: string) {
    this.ipcRenderer.send("set-project-folder");
    const set = this.getSet(setId);
    await new Promise((resolve) => {
      ipcRenderer.once("get-folder-path", (event, path) => {
        set.path = path[0];
        resolve();
      });
    });
    // Move files to assigned folder
    set.files.forEach((file) => {
      if (file.shrinked) {
        this.fs.rename(
          file.shrinked.path,
          set.path + "/" + file.shrinked.name,
          () => { }
        );
        file.shrinked.path = set.path + "/" + file.shrinked.name;
      }
    });
    if (this.settings.getSync("app.notification")) {
      const Notification = this.remote.Notification;
      new Notification({
        title: `Files are moved`,
        body: `${set.files.length} shrinked files moved to the new export folder: ${set.path}`,
        silent: true,
      }).show();
    }
    this.saveSets();
  }

  public deleteSet = (setId: string): void => {
    const set = this.getSet(setId);
    this.Sets.filter((_set, index) => {
      if (set.id === set.id) {
        this.Sets.splice(index, 1);
      }
    });
    this.saveSets();
    setTimeout(() => {
      if (this.Sets.length) {
        this.router.navigate(["/sets/" + this.Sets[this.Sets.length - 1].id]);
      } else {
        this.router.navigate(["/import"]);
      }
    });
  };

  public updateStatistics = () => {
    this.Sets.forEach((set) => {
      set.setStatistics();
    });
  };

  private watchFile = (file: AppFile, set: Set): void => {
    if (this.settings.getSync("app.fileWatcher")) {
      console.log(
        `File check:`,
        `c%${file.original.name}`,
        "font-weight: bold"
      );
      if (this.fs.existsSync(file.original.path)) {
        this.fs.watchFile(file.original.path, (curr, prev) => {
          if (curr.size) {
            if (curr.size !== file.shrinked.size) {
              file.status = FileStatus.needsUpdate;
            }
          } else {
            file.status = FileStatus.removed;
          }
          set.setStatistics();
        });
        if (file.hasSourceFile) {
          if (file.shrinked.path) {
            this.fs.watchFile(file.shrinked.path, (curr, prev) => {
              if (!curr.size) {
                file.status = FileStatus.needsUpdate;
                set.setStatistics();
              }
            });
          } else {
            file.status = FileStatus.needsUpdate;
          }
        }
      } else {
        file.status = FileStatus.removed;
      }
      set.setStatistics();
      this.saveSets();
    }
  };

  private startWatchAllFiles = (): void => {
    if (this.settings.getSync("app.fileWatcher")) {
      this.Sets.forEach((set) => {
        set.files.forEach((file) => {
          this.watchFile(file, set);
        });
      });
    }
  };

  public watchFiles = (set: Set): void => {
    console.log(this.settings.getSync("app.fileWatcher"), "app.fileWatcher");
    if (this.settings.getSync("app.fileWatcher")) {
      console.log(
        `Traking files changes in ${set.name} for ${set.files.length}`
      );
      set.files.forEach((file) => {
        this.watchFile(file, set);
      });
    } else {
      console.log("Files tracking is disbaled");
    }
  };

  public addSet = (name: string, files: AppFile[]) => {
    const newSet = new Set({ name, files });
    this.Sets.push(newSet);
    this.saveSets();
  };

  public createSetFromImport = () => {
    this.addSet("From import", [...Import.files]);
    Import.files.length = 0;
    setTimeout(() => {
      this.router.navigate(["/sets/" + this.Sets[this.Sets.length - 1].id]);
    });
  };

  public isItStaticSet(setId: string): boolean {
    return setId === Import.id || setId === Clipboard.id;
  }
}
