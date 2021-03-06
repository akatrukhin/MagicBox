import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppFile, FilesSet } from "../../../data";
import { DialogService, SetService } from "../../../core/services";

export enum Dropdown {
  addFiles = "Add Images",
  moveToSet = "Move files",
  copyToSet = "Copy files",
  newSet = "Save as New Set",
  deleteSet = "Delete Set",
  assignFolder = "Set Export Folder",
  removeFiles = "Remove All Files",
  export = "Export",
  splitter = "",
}

@Injectable()
export class DropdownService {
  public list = [];

  constructor(
    public router: Router,
    private dialogService: DialogService,
    private setService: SetService
  ) { }

  public setList(object: FilesSet | AppFile): void {
    this.list.length = 0;
    if (object instanceof FilesSet) {
      this.list.push(Dropdown.addFiles);
      if (object.files.length) {
        this.list.push(Dropdown.removeFiles);
      }
      this.list.push(Dropdown.splitter);
      if (this.setService.isItStaticSet(object.id)) {
        this.list.push(Dropdown.newSet);
        if (object.files.length) {
          this.list.push(Dropdown.moveToSet);
          this.list.push(Dropdown.copyToSet);
        }
      } else {
        this.list = [...this.list, Dropdown.deleteSet, Dropdown.assignFolder];
      }
    }
    if (object instanceof AppFile) {
      // TODO: File managment
      this.list.length = 0;
      // TODO: Instanceof AppFile not passing properly
    }
  }

  public selected(event: string, object: FilesSet | AppFile): void {
    console.log(event)
    const set: FilesSet = object instanceof FilesSet ? object : undefined;
    switch (event) {
      case Dropdown.moveToSet:
        this.dialogService.moveToSet(this.getSelectedFiles(set), set, true);
        break;
      case Dropdown.copyToSet:
        this.dialogService.moveToSet(this.getSelectedFiles(set), set, false);
        break;
      case Dropdown.newSet:
        this.setService.createSetFromImport();
        break;
      case Dropdown.removeFiles:
        set.clean();
        this.setService.saveSets();
        break;
      case Dropdown.deleteSet:
        this.setService.deleteSet(set.id);
        break;
      case Dropdown.export:
        break;
      case Dropdown.assignFolder:
        this.setService.exportFolder(set.id);
        break;
      case Dropdown.addFiles:
        document.getElementById("inputFiles").click();
        break;
    }
  }

  private getSelectedFiles(set: FilesSet): AppFile[] {
    return set.files.filter((file) => file.selected);
  }
}
