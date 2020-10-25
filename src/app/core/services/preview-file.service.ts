import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AppFile } from "../../data/file";

@Injectable({
  providedIn: "root",
})
export class PreviewFileService {
  private previewFile: BehaviorSubject<AppFile> = new BehaviorSubject(
    new AppFile({})
  );
  public file = this.previewFile.asObservable();
  private view: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public viewStatus = this.view.asObservable();

  public componentViewStatus(status: boolean) {
    this.view.next(status);
  }

  public showPreviewFile(file: AppFile) {
    this.previewFile.next(file);
    this.componentViewStatus(true);
  }
}
