import {
  Component,
  ElementRef,
  Input,
  NgZone,
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
  ElectronService
  // WebWorkerService
} from "../../../core/services";
import { FilesSet, ViewMode, AppFile, IFile, saveSet } from "../../../data";
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
  @Input() set: FilesSet;
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
    private electronService: ElectronService,
    private zone: NgZone
  ) {
    this.dropdownService.setList(this.set);
  }

  ngOnInit() {
    this.optimizationService.loading.subscribe((loadingStatus) => {
      this.loading = loadingStatus;
    });
    this.set.setStatistics();
    this.electronService.ipcRenderer.once("set-files-from-system", (event, paths: string[]) => {
      console.log('Process files from system: ', paths, this.set.files)
      this.zone.run(() => {
        paths.forEach((path: string) => {
          if (!this.duplicateCheck(path)) {
            this.set.addFile(
              new AppFile(
                new IFile(path, "")
              )
            );
          }
        });
      })
      this.set.setStatistics();
      saveSet(this.set.id)
    });
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
  public dropped(files: NgxFileDropEntry[]) {
    console.time(`Processing ${files.length} files`);
    for (const droppedFile of files) {
      this.setFile(droppedFile);
    }
    saveSet(this.set.id);
    // this.setService.watchFiles(this.set, this.set.files)
    console.timeEnd(`Processing ${files.length} files`);
    // this.webWorkerService.startToTrackFilesChanges(this.set.id)
  }

  // Set file from system
  public getFilesFromSystem() {
    const files: File[] = this.inputFiles.nativeElement.files;
    this.setFilesFromSystem(files);
    this.set.setStatistics();
    saveSet(this.set.id)
    // this.webWorkerService.startToTrackFilesChanges(this.set.id)
    console.log(`%c${files.length} files added`, "font-weight: bold");
  }

  public setFilesFromSystem(files: File[]): void {
    for (const file of files) {
      if (!this.duplicateCheck(file.path)) {
        this.set.addFile(
          new AppFile(
            new IFile(
              file.path,
              file.type,
              file.name,
              file.size,
              undefined,
              file.lastModified
            )
          )
        );
      }
    }
  }

  private setFile(droppedFile: NgxFileDropEntry) {
    if (/\.(gif|jpg|jpeg|tiff|png|svg|sketch|webp)$/i.test(droppedFile.fileEntry.name)) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((converted: File) => {
        if (!this.duplicateCheck(converted.path)) {
          const appFile = new AppFile(
            new IFile(
              converted.path,
              converted.type ? converted.type : "sketch",
              converted.name,
              converted.size,
              undefined,
              converted.lastModified
            )
          );
          this.set.addFile(appFile)
        } else {
          console.warn("File duplicate found");
        }
      });
    } else {
      console.warn("File format is not supported");
    }
  }

  private duplicateCheck(path: string): AppFile | undefined {
    return this.set.files.find((source: AppFile) => source.original.path === path);
  }

  public removeSelectedFiles(): void {
    this.zone.run(() => {
      this.set.removeFiles(this.selectedFiles);
    })
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
    saveSet(this.set.id);
  }

  public getOptimizedFiles(): number {
    return this.set.files.length - this.set.statistics.notOptimized;
  }

  public switchViewMode(): void {
    this.set.viewMode =
      this.set.viewMode === ViewMode.grid ? ViewMode.list : ViewMode.grid;
    saveSet(this.set.id);
  }

  public isItTemporarySet(): boolean {
    return this.setService.isItStaticSet(this.set.id);
  }

  public setFolder(): void {
    this.setService.exportFolder(this.set.id);
  }
}
