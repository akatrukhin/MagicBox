import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgxFileDropEntry, FileSystemFileEntry } from "ngx-file-drop";
import {
  ILoading,
  OptimizationService,
  ContextMenuService,
  DialogService,
  SetService,
  WebWorkerService
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
  @ViewChild("inputFiles", { static: false }) inputFiles: ElementRef;

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
    private contextMenuService: ContextMenuService,
    private dialogService: DialogService,
    private dropdownService: DropdownService,
    private setService: SetService,
    // private electronService: ElectronService,
    private webWorkerService: WebWorkerService,
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
  public async dropped(files: NgxFileDropEntry[]) {
    console.time(`Processing ${files.length} files`);
    for (const droppedFile of files) {
      await this.convertingFile(droppedFile);
    }
    await this.setService.saveSets();
    // this.setService.watchFiles(this.set, this.set.files)
    console.timeEnd(`Processing ${files.length} files`);
    await this.webWorkerService.startToTrackFilesChanges(this.set)
  }

  // Set file from system
  public getFilesFromSystem() {
    const files: File[] = this.inputFiles.nativeElement.files;
    console.log(`%cProcessing ${files.length} files`, "font-weight: bold");
    this.setFilesFromSystem(files);
    this.set.setStatistics();
    this.setService.saveSets();
    this.setService.watchFiles(this.set)
    console.log(`%cProcessing process completed`, "font-weight: bold");
  }

  public setFilesFromSystem(files: File[]): void {
    for (const file of files) {
      const _file = new AppFile(new IFile(file.path, file.type));
      if (!this.isFileDulicate(_file)) {
        this.set.addFile(_file);
      }
    }
  }

  private async convertingFile(droppedFile: NgxFileDropEntry) {
    console.time(`${droppedFile.fileEntry.name}`);
    await this.setFile(droppedFile);
    console.timeEnd(`${droppedFile.fileEntry.name}`);
  }

  private setFile(droppedFile: NgxFileDropEntry) {
    return new Promise((resolve, reject) => {
      try {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
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
              this.set.addFile(appFile);
            }
          } else {
            console.warn("File format is not supported");
          }
          resolve();
        });
      } catch (error) {
        throw new Error(
          `Unnable to process file: ${droppedFile.fileEntry.name}`
        );
        reject();
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

  public removeSelectedFiles(): void {
    this.set.removeFiles(this.selectedFiles);
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
