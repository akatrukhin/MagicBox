import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { getSet, FilesSet } from "../../data";

@Component({
  selector: "app-set",
  template: `
    <app-images
      [set]="set"
      [noFilesTitle]="'Drop images here to add them to the set'"
    ></app-images>
  `,
  styleUrls: ["../home/home.component.scss"],
})
export class SetComponent implements OnInit, OnDestroy {
  set: FilesSet;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    // Get Set at the first call
    this.set = getSet(this.route.snapshot.params["id"]);
    // Navigating inside Sets
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log("Set router ", this.route.snapshot.params["id"])
        this.set = getSet(this.route.snapshot.params["id"]);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
