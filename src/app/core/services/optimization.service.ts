import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { ElectronService } from "./electron/electron.service";
import { Set } from "../../data/set";
import { AppFile, IFile, FileStatus } from "../../data/file";
import { convertSize } from "../../shared/utilities";
import { SetService } from "./sets.service";

export interface ILoading {
  status: boolean;
  percentage: number;
}

@Injectable({
  providedIn: "root",
})
export class OptimizationService {
  private defaultLoadingValue: ILoading = {
    status: false,
    percentage: 0,
  };
  private loadingProcess: BehaviorSubject<ILoading> = new BehaviorSubject(
    this.defaultLoadingValue
  );

  public loading = this.loadingProcess.asObservable();

  constructor(
    private electronService: ElectronService,
    private setService: SetService
  ) {}

  public stopProcess() {
    console.warn("Optimization thread was stoped");
    this.loadingProcess.next({ status: false, percentage: 100 });
  }

  private setLoadingInterval(interval: number) {
    const finish = interval * 0.9 + this.loadingProcess.value.percentage;
    const i = setInterval(() => {
      if (this.loadingProcess.value.percentage >= finish) {
        clearInterval(i);
      } else {
        ++this.loadingProcess.value.percentage;
      }
    }, 100);
  }

  private completeLoadingInterval(interval: number) {
    const finish = interval * 0.1 + this.loadingProcess.value.percentage;
    const i = setInterval(() => {
      if (this.loadingProcess.value.percentage >= finish) {
        clearInterval(i);
      } else {
        ++this.loadingProcess.value.percentage;
      }
    }, 500);
  }

  public async setOptimization(set: Set) {
    console.log(`%cProcessing files optimization`, "font-weight: bold");
    console.time(`Files optimization`);
    this.loadingProcess.next({ status: true, percentage: 0 });
    for (const file of set.getNotOptimizedFiles()) {
      console.time(`${file.original.name}`);
      try {
        if (!this.loadingProcess.value.status) {
          throw console.log("Process stoped");
        }
        const loadingStart = this.loadingProcess.value.percentage;
        const loadingInterval =
          (file.original.size * 100) / set.statistics.totalFilesSize;

        await this.setFileOptimization(file, set.path && set.path); // Custom path for export
        this.setLoadingInterval(loadingInterval);

        await this.getOptimizedFile(file);
        await this.completeLoadingInterval(loadingInterval);
        this.loadingProcess.value.percentage = loadingInterval + loadingStart;
      } catch (error) {
        this.loadingProcess.next(this.defaultLoadingValue);
      }
      console.timeEnd(`${file.original.name}`);
    }
    set.setStatistics();
    this.setService.saveSets();
    if (this.electronService.settings.get("app.notification")) {
      this.electronService.showNotification({
        title: `Completed`,
        body: `${convertSize(
          set.statistics.totalFilesSize
        )} shrinked to ${convertSize(
          set.statistics.totalFilesSize - set.statistics.totalSavedSpace
        )}`,
        silent: true,
      });
    }
    this.loadingProcess.next(this.defaultLoadingValue);
    console.timeEnd(`Files optimization`);
  }

  public async fileOptimization(file: AppFile) {
    this.loadingProcess.next({ status: true, percentage: 0 });
    try {
      if (!this.loadingProcess.value.status) {
        throw console.log("Process stoped");
      }
      await this.setFileOptimization(file); // Custom path for export
      this.setLoadingInterval(100);
      await this.getOptimizedFile(file);
      await this.completeLoadingInterval(100);
      this.loadingProcess.value.percentage = 100;
    } catch (error) {
      this.loadingProcess.next(this.defaultLoadingValue);
    }
    this.setService.updateStatistics();
    this.setService.saveSets();
    this.loadingProcess.next(this.defaultLoadingValue);
  }

  public setFileOptimization(
    file: AppFile,
    customPath?: string
  ): Promise<PromiseConstructor> {
    return new Promise((resolve) => {
      try {
        file.loading = true;
        this.electronService.ipcRenderer.send(
          "file-optimization",
          file,
          customPath ? customPath : null
        );
        resolve();
      } catch (error) {
        file.loading = false;
        this.fileError(file);
        throw console.log("Stoped Start");
      }
    });
  }

  public getOptimizedFile(file: AppFile): Promise<PromiseConstructor> {
    return new Promise((resolve) => {
      try {
        this.electronService.ipcRenderer.once(
          file.id,
          (event, path: string) => {
            if (path === "error") {
              throw new Error();
            }
            file.shrinked = new IFile(path, file.original.type);
            file.hasSourceFile =
              file.shrinked.path !== file.original.path ? true : false;
            file.status = FileStatus.optimized;
            file.loading = false;
            resolve();
          }
        );
      } catch (error) {
        this.fileError(file);
        throw console.log("Stoped End");
      }
    });
  }

  private fileError(file: AppFile): void {
    file.loading = false;
    this.loadingProcess.next({ status: false, percentage: 100 });
    this.electronService.showNotification({
      title: `Houston we have a problem`,
      body: `${file.original.name} can not be optimized`,
      silent: true,
    });
  }
}
