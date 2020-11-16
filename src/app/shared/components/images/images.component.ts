import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { UploadEvent, FileSystemFileEntry, UploadFile } from "ngx-file-drop";
import {
  ILoading,
  OptimizationService,
  ContextMenuService,
  DialogService,
  SetService,
} from "../../../core/services";
import { Set, ViewMode, AppFile, IFile } from "../../../data";
import { DropdownService } from "../dropdown/dropdown.service";

import {
  ImportAnimation,
  FooterAnimation,
  LoadingBar,
  ViewTransition,
} from "./images.animations";

@Component({
  selector: "app-images",
  templateUrl: "./images.component.html",
  styleUrls: ["./images.component.scss"],
  animations: [ImportAnimation, FooterAnimation, LoadingBar, ViewTransition],
})
export class ImagesComponent implements OnChanges, OnInit {
  @Input() set: Set;
  @Input() noFilesTitle = "Drop images here to add them to the list";
  @ViewChild("inputFiles") inputFiles: ElementRef;

  // UI
  // Loading process
  public loading: ILoading;
  // Dropdown
  public dropdownIsClosed = false;

  // Copied SVG Code
  copiedSVGCode: string;

  // Selected Files
  selectedFiles: AppFile[] = [];

  constructor(
    public router: Router,
    private optimizationService: OptimizationService,
    // private webWorkerService: WebWorkerService,
    private contextMenuService: ContextMenuService,
    private dialogService: DialogService,
    private dropdownService: DropdownService,
    private setService: SetService
  ) {
    this.dropdownService.setList(this.set);
  }

  ngOnInit() {
    this.optimizationService.loading.subscribe((loadingStatus) => {
      this.loading = loadingStatus;
    });
    this.set.setStatistics();
  }

  ngOnChanges() {
    if (this.set.files.length) {
      this.set.files.forEach((file) => {
        if (file.selected) {
          file.selected = false;
        }
        this.dialogService.closeDialog();
      });
    }
    this.dropdownService.setList(this.set);
    this.set.setStatistics();
    this.setService.saveSets();
  }

  public async optimizeFiles() {
    if (this.set.statistics.notOptimized) {
      await this.optimizationService.setOptimization(this.set);
      this.set.setStatistics();
    }
  }

  public stopProcess(): void {
    this.optimizationService.stopProcess();
  }

  // Drag and Drop
  // Tray extends EventEmitter 'drop-files'
  public async dropped(event: UploadEvent) {
    console.log(
      `%cProcessing ${event.files.length} files`,
      "font-weight: bold"
    );
    for (const file of event.files) {
      await this.convertingFile(file);
    }
    this.set.setStatistics();
    this.setService.saveSets();
    // this.webWorkerService.run(watchFiles, this.set.files);
    console.log(`%cProcessing process completed`, "font-weight: bold");
  }

  // Set file from system
  public getFilesFromSystem() {
    const files: File[] = this.inputFiles.nativeElement.files;
    console.log(`%cProcessing ${files.length} files`, "font-weight: bold");
    this.setFilesFromSystem(files);
    this.set.setStatistics();
    this.setService.saveSets();
    console.log(`%cProcessing process completed`, "font-weight: bold");
    // this.webWorkerService.run(watchFiles, this.set.files);
  }

  public setFilesFromSystem(files: File[]): void {
    for (const file of files) {
      const _file = new AppFile(new IFile(file.path, file.type));
      if (!this.isFileDulicate(_file)) {
        this.addFileToList(_file);
      }
    }
  }

  private async convertingFile(file: UploadFile) {
    console.time(`${file.fileEntry.name}`);

    await this.setFile(file);
    console.timeEnd(`${file.fileEntry.name}`);
  }

  private setFile(file: UploadFile) {
    return new Promise((resolve, reject) => {
      try {
        const fileEntry = file.fileEntry as FileSystemFileEntry;
        console.log(
          `%c${fileEntry.name}`,
          "font-weight: bold",
          `processing ...`
        );
        fileEntry.file((converted: File) => {
          if (
            /\.(gif|jpg|jpeg|tiff|png|svg|sketch|webp)$/i.test(converted.name)
          ) {
            const appFile = new AppFile(
              new IFile(
                converted.path,
                converted.type ? converted.type : "sketch"
              )
            );
            if (!this.isFileDulicate(appFile)) {
              this.addFileToList(appFile);
            }
          } else {
            console.warn("File format is not supported");
          }
          resolve();
        });
      } catch (error) {
        throw new Error(`Unnable to process file: ${file.fileEntry.name}`);
      }
    });
  }

  private isFileDulicate(file: AppFile): boolean {
    let isDublicate = false;
    this.set.files = this.set.files.filter((source: AppFile) => {
      if (JSON.stringify(source.original) === JSON.stringify(file.original)) {
        isDublicate = true;
      }
      return true;
    });
    return isDublicate;
  }

  private addFileToList(file: AppFile): void {
    this.set.files.push(file);
  }

  public removeSelectedFiles(): void {
    this.setService.removeFiles(this.set.id, this.selectedFiles);
  }

  public selectFile(file: AppFile): void {
    if (file.selected) {
      delete file.selected;
      this.selectedFiles = this.selectedFiles.filter(
        (_file) => _file.id !== file.id
      );
    } else {
      file.selected = true;
      this.selectedFiles.push(file);
    }
    this.dropdownService.setList(this.set);
  }

  public onRightClick(file: AppFile): void {
    if (this.selectedFiles.length > 1) {
      this.contextMenuService.showOnSelectedFiles(this.selectedFiles, this.set);
    } else {
      this.contextMenuService.showOnFile(file, this.set);
    }
  }

  public onRightClickBody(): void {
    this.contextMenuService.showOnBody(this.set);
  }

  public setTitle(): void {
    this.setService.saveSets();
  }

  public getOptimizedFiles(): number {
    return this.set.files.length - this.set.statistics.notOptimized;
  }

  public switchViewMode(): void {
    this.set.viewMode =
      this.set.viewMode === ViewMode.grid ? ViewMode.list : ViewMode.grid;
    this.setService.saveSets();
  }

  public isItTemporarySet(): boolean {
    return this.setService.isItStaticSet(this.set.id);
  }

  public setFolder(): void {
    this.setService.exportFolder(this.set.id);
  }
}
