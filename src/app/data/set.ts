import { generateID } from "../shared/utilities";
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
      this.id = generateID();
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
