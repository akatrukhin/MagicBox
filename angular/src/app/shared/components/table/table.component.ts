import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { PreviewFileService } from "../../../core/services";
import { AppFile } from "../../../data";

import { LoaderAnimation } from "../../animations";
import { NewFileAnimation } from "./table.animation";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
  animations: [LoaderAnimation, NewFileAnimation],
})
export class TableComponent implements OnChanges {
  @Input() rows: AppFile[] = [];
  @Output() fileRightClick = new EventEmitter();
  @Output() selectFile = new EventEmitter();

  columns: string[] = ["type", "name", "lastModified", "original", "optimized"];
  dataSource = new MatTableDataSource(this.rows);
  isSingleClick = true;

  constructor(private previewFileService: PreviewFileService) { }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.rows);
  }

  public addSelectedFile(file: AppFile): void {
    this.selectFile.emit(file);
  }

  public onRightClick(file: AppFile): void {
    this.fileRightClick.emit(file);
  }

  public previewFile(file: AppFile) {
    this.isSingleClick = false;
    this.previewFileService.showPreviewFile(file);
  }

  public trackByFn(index: number, file: AppFile): string {
    return file.id;
  }
}
