import { statSync } from "fs";
import * as _path from "path";

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
    if (this.path) {
      if (!this.name) {
        this.name = _path.basename(this.path);
      }
      if (!this.size && this.path) {
        this.size = statSync(this.path).size;
      }
      if (!this.lastModified) {
        this.lastModified = statSync(this.path).mtimeMs;
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
  id: string = Math.random().toString(36).substr(2, 9);
  status: FileStatus = FileStatus.new;
  hasSourceFile = false;
  loading = false;
  selected = false;

  constructor(public original: IFile, public shrinked?: IFile) { }
}
