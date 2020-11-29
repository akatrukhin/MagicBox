import { Component } from "@angular/core";
import { Router } from "@angular/router";
import {
  ElectronService,
  ContextMenuService,
  SetService,
} from "../../../core/services";
import { Sets, FilesSet, Import } from "../../../data";
import { navigationNewItem } from "../../animations";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
  animations: [navigationNewItem],
})
export class NavigationComponent {
  public sets = Sets;
  public import = Import;

  constructor(
    public router: Router,
    public electronService: ElectronService,
    private contextMenuService: ContextMenuService,
    private setService: SetService
  ) { }

  public getNotOptimizied(set: FilesSet): number {
    return set.statistics.notOptimized;
  }

  public setClipboardLink(): boolean {
    return Boolean(this.electronService.settings.getSync("app.clipboardWatcher"));
  }

  public isThereNotOptimizedFiles(): boolean {
    return !!Sets.find(
      (set) => set.statistics.notOptimized > 0
    );
  }

  public addSet(): void {
    const set = new FilesSet({ name: `New files set` });
    Sets.push(set);
    setTimeout(() => {
      this.router.navigate(["/sets/" + set.id]);
    });
    this.setService.saveSets();
  }

  public openFeedbackPage(): void {
    this.electronService.shell.openExternal(`mailto:a.katrukhin@gmail.com`);
  }

  public navigationStatus(): boolean {
    return Boolean(this.electronService.settings.getSync("appearance.smallNav"));
  }

  public onRightClick(set: FilesSet): void {
    this.contextMenuService.showOnNavigationItem(set);
  }
}
