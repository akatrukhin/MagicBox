import { AppFile, FileStatus } from "./file";

export enum ViewMode {
  grid = "grid",
  list = "list",
}

export enum StaticSets {
  Import = "Import",
  Clipboard = "Clipboard",
}

export interface ISetStat {
  totalSavedSpace: number;
  percentageOfSaved: number;
  totalFilesSize: number;
  notOptimized: number;
}

class Entity {
  constructor(fields?: any) {
    Object.assign(this, fields);
  }
}

export class Set extends Entity {
  id: string;
  name: string;
  path?: string;
  viewMode: ViewMode;
  files: AppFile[];
  statistics: ISetStat;

  constructor(fields: Partial<Set>) {
    super(fields);
    const { id, name, viewMode, files, statistics } = fields;
    if (!id) {
      this.id = Math.random().toString(36).substr(2, 9);
    }
    if (!name) {
      this.name = "Unnamed";
    }
    if (!viewMode) {
      this.viewMode = ViewMode.grid;
    }
    if (!files) {
      this.files = [];
    }
    if (!statistics) {
      this.statistics = {
        totalSavedSpace: 0,
        percentageOfSaved: 0,
        totalFilesSize: 0,
        notOptimized: 0,
      };
    }
    this.setStatistics();
  }

  public getNotOptimizedFiles = (): AppFile[] => {
    return this.files.filter(
      (file) =>
        file.status === FileStatus.new || file.status === FileStatus.needsUpdate
    );
  };

  public addFile = (file: AppFile): void => {
    this.files.push(file);
    this.setStatistics();
  }

  public removeFile = (file: AppFile): void => {
    // Stop watching
    // if (this.isElectron && this.getFromSettings("app.fileWatcher")) {
    //   this.unsubscribeFile(file);
    // }
    this.files = this.files.filter((source: AppFile) => {
      return source.id !== file.id;
    });
    this.setStatistics();
  }

  public removeFiles = (files: AppFile[]): void => {
    files.forEach((file) => {
      this.removeFile(file)
    });
    this.setStatistics();
  };

  public clean() {
    this.files.length = 0;
    this.setStatistics();
  }

  public setStatistics = (): void => {
    const totalFilesSize = this.files.reduce(
      (a, b) => a + (b.original.size || 0),
      0
    );
    const totalSavedSpace =
      totalFilesSize -
      this.files.reduce(
        (a, b) => a + (b.shrinked ? b.shrinked.size || 0 : 0),
        0
      );
    const percentageOfSaved =
      ((totalSavedSpace ? totalSavedSpace : 0) / totalFilesSize) * 100;
    this.statistics = {
      notOptimized: this.getNotOptimizedFiles().length,
      totalSavedSpace,
      percentageOfSaved,
      totalFilesSize,
    };
  };
}

export const Import = new Set({ id: "import", name: StaticSets.Import });
export const Clipboard = new Set({
  id: "clipboard",
  name: StaticSets.Clipboard,
});
export const Sets: Set[] = []