import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { Set } from "../../data/set";
import { AppFile } from "../../data/file";
import { DialogComponent } from "../../shared/components/dialog/dialog.component";
import { SetService } from "./sets.service";

@Injectable({
  providedIn: "root",
})
export class DialogService {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private setService: SetService
  ) { }

  public moveToSet(files: AppFile[], setFrom: Set, removeFiles: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "350px",
      data: { currentSet: setFrom },
    });
    dialogRef.afterClosed().subscribe((setId) => {
      if (setId.length) {
        const setTo: Set = this.setService.getSet(setId);
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
