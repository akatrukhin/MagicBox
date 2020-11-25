import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SetService } from "../../../core/services/sets.service";
import { Sets, Set } from "../../../data";
export interface DialogData {
  currentSet: Set | undefined;
}

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent {
  sets: Set[] = Sets;
  fileId: string;
  setId: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    private setService: SetService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.setId = this.data.currentSet ? this.data.currentSet.id : "";
  }

  public selectSet(set: Set): void {
    this.fileId = set.id;
  }

  public addImagesToSet(): void {
    this.dialogRef.close(this.fileId);
  }

  public addSet(): void {
    const set = new Set({ name: `New set ${this.sets.length}` });
    Sets.push(set);
    this.setService.saveSets();
  }

  public trackByFn(index: string, set: Set): string {
    return set.id;
  }
}
