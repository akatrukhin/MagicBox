import { Component } from "@angular/core";
import { Clipboard } from "../../data";
import { PreviewFileService } from "../../core/services";

@Component({
  selector: "app-clipboard",
  template: "",
})
export class ClipboardComponent {
  constructor(private previewFileService: PreviewFileService) {
    this.previewFileService.showPreviewFile(
      Clipboard.files[Clipboard.files.length - 1]
    );
    this.previewFileService.componentViewStatus(true);
  }
}
