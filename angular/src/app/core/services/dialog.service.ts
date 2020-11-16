import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { getSet, FilesSet } from "../../data/set";
import { AppFile } from "../../data/file";
import { DialogComponent } from "../../shared/components/dialog/dialog.component";

@Injectable({
  providedIn: "root",
})
export class DialogService {
  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) { }

  public moveToSet(files: AppFile[], setFrom: FilesSet, removeFiles: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "350px",
      data: { currentSet: setFrom },
    });
    dialogRef.afterClosed().subscribe((setId) => {
      if (setId.length) {
        const setTo: FilesSet = getSet(setId);
        files.forEach((file) => (file.selected = false));
        setTo.files.push(...files);
        if (removeFiles) {
          files.forEach((file) => {
            setFrom.files = setFrom.files.filter((source: AppFile) => {
              return source.id !== file.id;
            });
          });
        }
        this.router.navigate(["/sets/" + setTo.id]);
      }
    });
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }
}
