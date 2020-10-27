import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { SetService } from "../../../core/services";
import { Set } from "../../../data";

@Component({
  selector: "app-set",
  template: `
    <app-images
      [set]="set"
      [noFilesTitle]="'Drop images here to add them to the set'"
    ></app-images>
  `,
})
export class SetComponent implements OnInit, OnDestroy {
  set: Set;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private setService: SetService
  ) {}

  ngOnInit() {
    // Get Set at the first call
    this.set = this.setService.getSet(this.route.snapshot.params["id"]);
    // Navigating inside Sets
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.set = this.setService.getSet(this.route.snapshot.params["id"]);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
