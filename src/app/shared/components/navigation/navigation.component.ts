import { Component } from "@angular/core";
import { Router } from "@angular/router";
import {
  ElectronService,
  ContextMenuService,
  SetService,
} from "../../../core/services";
import { Set, Import } from "../../../data";
import { navigationNewItem } from "../../animations";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
  animations: [navigationNewItem],
})
export class NavigationComponent {
  public sets = this.setService.Sets;
  public import = Import;

  constructor(
    public router: Router,
    public electronService: ElectronService,
    private contextMenuService: ContextMenuService,
    private setService: SetService
  ) { }

  public getNotOptimizied(set: Set): number {
    return set.statistics.notOptimized;
  }

  public setClipboardLink(): boolean {
    return Boolean(this.electronService.settings.getSync("app.clipboardWatcher"));
  }

  public isThereNotOptimizedFiles(): boolean {
    return !!this.setService.Sets.find(
      (set) => set.statistics.notOptimized > 0
    );
  }

  public addSet(): void {
    const set = new Set({ name: `New files set` });
    this.setService.Sets.push(set);
    setTimeout(() => {
      this.router.navigate(["/sets/" + set.id]);
    });
  }

  public openFeedbackPage(): void {
    this.electronService.shell.openExternal(`mailto:a.katrukhin@gmail.com`);
  }

  public navigationStatus(): boolean {
    return Boolean(this.electronService.settings.getSync("appearance.smallNav"));
  }

  public onRightClick(set: Set): void {
    this.contextMenuService.showOnNavigationItem(set);
  }
}
