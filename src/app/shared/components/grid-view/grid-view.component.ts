import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AppFile } from "../../../data";
import { PreviewFileService } from "../../../core/services";

import { LoaderAnimation } from "../../../shared/animations";
import { getEncodedSvgCSSBackground } from "../../../shared/utilities";

@Component({
  selector: "app-grid-view",
  templateUrl: "./grid-view.component.html",
  styleUrls: ["./grid-view.component.scss"],
  animations: [LoaderAnimation],
})
export class GridViewComponent {
  @Input() files: AppFile[] = [];
  @Output() fileRightClick = new EventEmitter();
  @Output() fileRightClickBody = new EventEmitter();
  @Output() selectFile = new EventEmitter();

  private isSingleClick = true;

  constructor(private previewFileService: PreviewFileService) {}

  public getEncodedSvgCSSBackground(data: string): string {
    return getEncodedSvgCSSBackground(data);
  }

  public addSelectedFile(file: AppFile): void {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.selectFile.emit(file);
      }
    }, 250);
  }

  public onRightClick(file: AppFile): void {
    this.fileRightClick.emit(file);
  }

  public previewFile(file: AppFile) {
    this.isSingleClick = false;
    console.log('p', file);
    this.previewFileService.showPreviewFile(file);
  }

  public onRightClickBody(): void {
    this.fileRightClickBody.emit();
  }

  public trackByFn(index: number, file: AppFile): string {
    return file.id;
  }
}
