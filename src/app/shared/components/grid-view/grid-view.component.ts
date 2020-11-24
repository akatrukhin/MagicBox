import { Component, Input, Output, EventEmitter } from "@angular/core";
import { PreviewFileService } from "../../../core/services";
import { AppFile } from "../../../data";

import { LoaderAnimation } from "../../animations";
import { getEncodedSvgCSSBackground } from "../../utilities";

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

  constructor(private previewFileService: PreviewFileService) { }

  public getPreviewURI(path: string): string {
    return `"${encodeURI(path)
      .replace("(", "%28")
      .replace(")", "%29")}"`;
  }

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

  public previewFile(file: AppFile) {
    this.isSingleClick = false;
    this.previewFileService.showPreviewFile(file);
  }

  public onRightClick(file: AppFile): void {
    this.fileRightClick.emit(file);
    console.log(file);
  }

  public onRightClickBody(): void {
    this.fileRightClickBody.emit();
  }

  public trackByFn(index: number, file: AppFile): string {
    return file.id;
  }

}
