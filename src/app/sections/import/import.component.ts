import { Component } from "@angular/core";
import { FilesSet, Import } from "../../data";

@Component({
  selector: "app-import",
  template: ` <app-images [set]="import"></app-images> `,
  styleUrls: ["../home/home.component.scss"],
})
export class ImportComponent {
  import: FilesSet = Import;
}
