import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AppFile } from "../../../data";

import { LoaderAnimation } from "../../animations";

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

  previewFile: AppFile;

  public getPreviewURI(path: string): string {
    return `"${encodeURI(path)
      .replace("(", "%28")
      .replace(")", "%29")}"`;
  }

  public getEncodedSvgCSSBackground(data: string): string {
    return `url("data:image/svg+xml,${data
      .replace(/"/g, "'")
      .replace(/>\s{1,}</g, "><")
      .replace(/\s{2,}/g, " ")
      .replace(/[\r\n%#()<>?\[\\\]^`{|}]/g, encodeURIComponent)}")`;
  }

  public addSelectedFile(file: AppFile): void {
    this.selectFile.emit(file);
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
