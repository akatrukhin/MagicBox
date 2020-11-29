import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { ipcRenderer, remote } from "electron";
import * as fs from "fs";
import * as settings from "electron-settings";
import { FilesSet, AppFile, FileStatus, Import, Clipboard, Sets, getSet, saveSet } from "../../data";

@Injectable({
  providedIn: "root",
})
export class SetService {
  ipcRenderer: typeof ipcRenderer;
  settings: typeof settings;
  remote: typeof remote;
  fs: typeof fs;

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

  constructor(private router: Router, private zone: NgZone) {
    if (this.isElectron) {
      this.settings = window
        .require("electron")
        .remote.require("electron-settings");
      this.remote = window.require("electron").remote;
      this.fs = window.require("fs");
      this.ipcRenderer = window.require("electron").ipcRenderer;

      // if (this.settings.getSync("app.fileWatcher")) {
      //   // this.startWatchAllFiles();
      // }

      if (this.settings.has("sets")) {
        const sets = [...this.settings.getSync("sets") as Array<any>];
        sets.forEach((item: object) => {
          const set = new FilesSet({ ...item });
          set.setStatistics();
          Sets.push(set);
        });
      }
    }
  }

  public saveSets = async () => {
    if (this.isElectron) {
      await this.settings.set("sets", Sets as any[]);
    }
  };

  private unsubscribeFile = (file: AppFile): void => {
    if (this.isElectron && file.original.path) {
      this.fs.unwatchFile(file.original.path);
    }
  };

  public resetFileStatus = (setId: string): void => {
    const set = getSet(setId);
    set.files.forEach((file) => {
      if (this.fs.existsSync(file.original.path) || !file.shrinked) {
        file.status = FileStatus.needsUpdate;
      }
    });
    getSet(setId).setStatistics();
    saveSet(setId);
  };

  public async exportFolder(setId: string) {
    this.ipcRenderer.send("set-project-folder");
    const set = getSet(setId);
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
    saveSet(setId);
  }

  public deleteSet = (setId: string): void => {
    this.zone.run(() => {
      this.router.navigate(["import"], { skipLocationChange: true }).then((e) => {
        Sets.filter((set, index) => {
          if (set.id === setId) {
            Sets.splice(index, 1);
          }
        });
        this.saveSets();
      });
    });
  };

  public updateStatistics = () => {
    Sets.forEach((set) => {
      set.setStatistics();
    });
  };

  // private watchFile = (file: AppFile, set: Set): void => {
  //   if (this.settings.getSync("app.fileWatcher")) {
  //     console.log(
  //       `File check: ${file.original.name}`
  //     );
  //     if (this.fs.existsSync(file.original.path)) {
  //       this.fs.watchFile(file.original.path, (curr, prev) => {
  //         if (curr.size) {
  //           if (curr.size !== file.shrinked.size) {
  //             file.status = FileStatus.needsUpdate;
  //           }
  //         } else {
  //           file.status = FileStatus.removed;
  //         }
  //         set.setStatistics();
  //       });
  //       if (file.hasSourceFile) {
  //         if (file.shrinked.path) {
  //           this.fs.watchFile(file.shrinked.path, (curr, prev) => {
  //             if (!curr.size) {
  //               file.status = FileStatus.needsUpdate;
  //               set.setStatistics();
  //             }
  //           });
  //         } else {
  //           file.status = FileStatus.needsUpdate;
  //         }
  //       }
  //     } else {
  //       file.status = FileStatus.removed;
  //     }
  //     set.setStatistics();
  //     this.saveSets();
  //   }
  // };


  // private startWatchAllFiles = (): void => {
  //   if (this.settings.getSync("app.fileWatcher")) {
  //     Sets.forEach((set) => {
  //       set.files.forEach((file) => {
  //         this.watchFile(file, set);
  //       });
  //     });
  //   }
  // };

  // public watchFiles = (set: Set): void => {
  //   console.log(`Start to watch ${set.name} files`);
  //   if (this.settings.getSync("app.fileWatcher")) {
  //     set.files.forEach((file) => {
  //       this.watchFile(file, set);
  //     });
  //   } else {
  //     console.log("Files tracking is disbaled");
  //   }
  // };

  public addSet = (name: string, files: AppFile[]) => {
    const newSet = new FilesSet({ name, files });
    Sets.push(newSet);
    this.saveSets();
  };

  public createSetFromImport = () => {
    this.addSet("From import", [...Import.files]);
    Import.files.length = 0;
    setTimeout(() => {
      this.router.navigate(["/sets/" + Sets[Sets.length - 1].id]);
    });
  };

  public isItStaticSet(setId: string): boolean {
    return setId === Import.id || setId === Clipboard.id;
  }
}
