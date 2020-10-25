import { Injectable } from "@angular/core";
import { MenuItemConstructorOptions } from "electron";

// import * as base64 from "base64-img";
import { Base64 } from "js-base64";

import { ElectronService } from "./electron/electron.service";
import { DialogService } from "./dialog.service";
import { Set, AppFile } from "../../data";
import { setSvgCopiedFromApp } from "../../data/temp";
import { svgCssReady } from "../../shared/utilities";
import { SetService } from "./sets.service";

enum ContextMenuType {
  Normal = "normal",
  Separator = "separator",
  Submenu = "submenu",
  Checkbox = "checkbox",
  Radio = "radio",
}

enum ContextMenuLabels {
  SourceFile = "Source file:",
  OptimizedFile = "Optimized file:",
  OpenFile = "Open file",
  ShowInFinde = "Show in Finder",
  MoveToSet = "Move to set",
  CopyToSet = "Copy to set",
  GetSvgCode = "SVG code",
  GetCssUri = "CSS data URI",
  SvgToBase64 = "Base64 encoded string",
  ImageToBase64 = "Base64 encoded string",
  ResetFilesStatus = "Reset files status",
  AddFiles = "Add files",
  CreateSet = "Create a set",
  UnselectAll = "Unselect all",
  DeleteSet = "Delete set",
  RemoveAllFiles = "Remove all files",
  RemoveFile = "Remove file",
  RemoveFiles = "Remove files",
  CopyAs = "Copy as",
}

interface Type {
  type: "normal" | "separator" | "submenu" | "checkbox" | "radio";
}

@Injectable({
  providedIn: "root",
})
export class ContextMenuService {
  constructor(
    private dialogService: DialogService,
    private electronService: ElectronService,
    private setService: SetService
  ) {}

  private menuItems = {
    sourceFileLabel: {
      label: ContextMenuLabels.SourceFile,
      enabled: false,
    },
    optimizedFileLabel: {
      label: ContextMenuLabels.OptimizedFile,
      enabled: false,
    },
    openFile: (path: string): MenuItemConstructorOptions => {
      return {
        label: ContextMenuLabels.OpenFile,
        click: () => this.electronService.shell.openItem(path),
      };
    },
    openFileFolder: (path: string): MenuItemConstructorOptions => {
      return {
        label: ContextMenuLabels.ShowInFinde,
        click: () => this.electronService.shell.showItemInFolder(path),
      };
    },
    separator: { type: ContextMenuType.Separator } as Type,
    moveFiles: (files: AppFile[], set: Set): MenuItemConstructorOptions => {
      return {
        label: ContextMenuLabels.MoveToSet,
        click: () => this.dialogService.moveToSet(files, set, true),
      };
    },
    copyFiles: (files: AppFile[], set: Set): MenuItemConstructorOptions => {
      return {
        label: ContextMenuLabels.CopyToSet,
        click: () => this.dialogService.moveToSet(files, set, false),
      };
    },
    submenu: (label: string, items) => {
      return {
        label,
        submenu: items,
      };
    },
    copyAsSvg: (file: AppFile) => {
      return {
        label: ContextMenuLabels.GetSvgCode,
        click: () => this.svgToClipBoard(file),
      };
    },
    copySvgAsCssReady: (file: AppFile) => {
      return {
        label: ContextMenuLabels.GetCssUri,
        click: () => this.svgCSSToClipBoard(file),
      };
    },
    copySvgAsBase64: (file: AppFile) => {
      return {
        label: ContextMenuLabels.SvgToBase64,
        click: () => this.base64ToClipBoard(file),
      };
    },
    copyFileAsBase64: (file: AppFile) => {
      return {
        label: ContextMenuLabels.ImageToBase64,
        click: () => {},
        // base64.base64(file.shrinked.path, (err, base64code: string) => {
        //   this.electronService.clipboard.writeText(base64code);
        // }),
      };
    },
    removeFiles: (
      label: string,
      files: AppFile[],
      setId: string
    ): MenuItemConstructorOptions => {
      return {
        label,
        click: () => this.setService.removeFiles(setId, files),
      };
    },
    refresh: (setId: string): MenuItemConstructorOptions => {
      return {
        label: ContextMenuLabels.ResetFilesStatus,
        click: () => this.setService.resetFileStatus(setId),
      };
    },
    addFiles: {
      label: ContextMenuLabels.AddFiles,
      click: () => document.getElementById("inputFiles").click(),
    },
    newSet: {
      label: ContextMenuLabels.CreateSet,
      click: () => this.setService.createSetFromImport(),
    },
    unselectAll: (files: AppFile[]): MenuItemConstructorOptions => {
      return {
        label: ContextMenuLabels.UnselectAll,
        click: () => {
          files.forEach((file) => delete file.selected);
        },
      };
    },
    removeSet: (setId: string): MenuItemConstructorOptions => {
      return {
        label: ContextMenuLabels.DeleteSet,
        click: () => this.setService.deleteSet(setId),
      };
    },
  };

  private base64ToClipBoard(file: AppFile) {
    if (file.original.path) {
      this.electronService.fs.readFile(
        file.shrinked.path ? file.shrinked.path : file.original.path,
        "utf8",
        (err, data) => {
          this.electronService.clipboard.writeText(Base64.encode(data));
        }
      );
    } else {
      this.electronService.clipboard.writeText(
        Base64.encode(
          file.shrinked.data ? file.shrinked.data : file.original.data
        )
      );
    }
  }

  private svgToClipBoard(file: AppFile) {
    if (file.original.path) {
      this.electronService.fs.readFile(
        file.shrinked.path ? file.shrinked.path : file.original.path,
        "utf8",
        (err, data) => {
          setSvgCopiedFromApp(data);
          this.electronService.clipboard.writeText(data);
        }
      );
    } else {
      const data = file.shrinked.data ? file.shrinked.data : file.original.data;
      setSvgCopiedFromApp(data);
      this.electronService.clipboard.writeText(data);
    }
  }

  private svgCSSToClipBoard(file: AppFile) {
    if (file.original.path) {
      this.electronService.fs.readFile(
        file.shrinked.path ? file.shrinked.path : file.original.path,
        "utf8",
        (err, data) => {
          this.electronService.clipboard.writeText(svgCssReady(data));
        }
      );
    } else {
      const data = file.shrinked.data ? file.shrinked.data : file.original.data;
      this.electronService.clipboard.writeText(svgCssReady(data));
    }
  }

  public showOnFile(file: AppFile, currentSet?: Set): void {
    let items: MenuItemConstructorOptions[] = [];
    if (file.original.path) {
      items.push(
        this.menuItems.openFile(file.original.path),
        this.menuItems.openFileFolder(file.original.path),
        this.menuItems.separator
      );
    }
    if (file.hasSourceFile && file.shrinked.path) {
      items = [
        this.menuItems.sourceFileLabel,
        ...items,
        this.menuItems.optimizedFileLabel,
        this.menuItems.openFile(file.shrinked.path), //
        this.menuItems.openFileFolder(file.shrinked.path),
      ];
    }
    if (file.original.type.includes("svg")) {
      items.push(
        this.menuItems.submenu(ContextMenuLabels.CopyAs, [
          this.menuItems.copyAsSvg(file),
          this.menuItems.copySvgAsCssReady(file),
          this.menuItems.copySvgAsBase64(file),
        ]),
        this.menuItems.separator
      );
    } else {
      items.push(this.menuItems.separator);
    }
    if (
      file.original.type.includes("png") ||
      file.original.type.includes("jpg") ||
      file.original.type.includes("jpeg") ||
      file.original.type.includes("gif")
    ) {
      items.push(
        this.menuItems.copyFileAsBase64(file),
        this.menuItems.separator
      );
    }
    if (file.original.path && currentSet) {
      items.push(
        this.menuItems.moveFiles([file], currentSet),
        this.menuItems.copyFiles([file], currentSet)
      );
    }
    if (currentSet) {
      items.push(
        this.menuItems.separator,
        this.menuItems.removeFiles(
          ContextMenuLabels.RemoveFile,
          [file],
          currentSet.id
        )
      );
    }
    this.buildContextMenu(items);
  }

  public showOnSelectedFiles(files: AppFile[], currentSet: Set): void {
    this.buildContextMenu([
      this.menuItems.moveFiles(files, currentSet),
      this.menuItems.copyFiles(files, currentSet),
      this.menuItems.removeFiles(
        ContextMenuLabels.RemoveFiles,
        files,
        currentSet.id
      ),
      this.menuItems.separator,
      this.menuItems.unselectAll(files),
    ]);
  }

  public showOnBody(currentSet: Set): void {
    const items: MenuItemConstructorOptions[] = [
      this.menuItems.refresh(currentSet.id),
      this.menuItems.separator,
      this.menuItems.addFiles,
      this.menuItems.removeFiles(
        ContextMenuLabels.RemoveAllFiles,
        currentSet.files,
        currentSet.id
      ),
      this.menuItems.separator,
    ];
    if (this.setService.isItStaticSet(currentSet.name)) {
      items.push(
        this.menuItems.newSet,
        this.menuItems.moveFiles(currentSet.files, currentSet)
      );
    } else {
      items.push(this.menuItems.removeSet(currentSet.id));
    }
    this.buildContextMenu(items);
  }

  public showOnNavigationItem(currentSet: Set): void {
    const items: MenuItemConstructorOptions[] = [
      this.menuItems.refresh(currentSet.id),
      this.menuItems.separator,
      this.menuItems.addFiles,
      this.menuItems.removeFiles(
        ContextMenuLabels.RemoveAllFiles,
        currentSet.files,
        currentSet.id
      ),
      this.menuItems.separator,
    ];
    items.push(this.menuItems.removeSet(currentSet.id));
    this.buildContextMenu(items);
  }

  private buildContextMenu(items: MenuItemConstructorOptions[]): void {
    const Menu = this.electronService.remote.Menu;
    const MenuItem = this.electronService.remote.MenuItem;
    const menu = new Menu();
    for (const item of items) {
      menu.append(new MenuItem(item));
    }
    menu.popup({ window: this.electronService.remote.getCurrentWindow() });
  }
}
