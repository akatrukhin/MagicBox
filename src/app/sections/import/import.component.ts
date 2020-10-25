import { Component } from "@angular/core";
import { Set, Import } from "../../data";

@Component({
  selector: "app-import",
  template: ` <app-images [set]="import"></app-images> `,
})
export class ImportComponent {
  import: Set = Import;
}
