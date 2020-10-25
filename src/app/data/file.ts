import { ElectronService } from "../core/services/electron/electron.service";
import { generateID } from "../shared/utilities";

export enum FileOptions {
  Original = "original",
  Shrinked = "shrinked",
}

export class IFile {
  [propName: string]: any;

  constructor(
    public path?: string,
    public type?: string,
    public name?: string,
    public size?: number,
    public data?: string,
    public lastModified?: number
  ) {
    const electron = new ElectronService();
    if (this.path) {
      const fs = electron.fs.statSync(this.path);

      if (!this.name) {
        this.name = electron.path.basename(this.path);
      }
      if (!this.size) {
        this.size = fs.size;
      }
      if (!this.lastModified) {
        this.lastModified = fs.mtimeMs;
      }
    }
  }
}

export enum FileStatus {
  error = "error",
  removed = "removed",
  optimized = "optimized",
  needsUpdate = "needs-update",
  new = "new",
}

export class AppFile {
  id: string = generateID();
  status: FileStatus = FileStatus.new;
  hasSourceFile = false;
  loading = false;
  selected = false;

  constructor(public original: IFile, public shrinked?: IFile) {}
}
