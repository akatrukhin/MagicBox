import { Component, Input } from "@angular/core";

@Component({
  selector: "app-toggle",
  template: `
    <div
      class="switch"
      [ngClass]="{ checked: checked, disable: disable }"
      (click)="switching()"
    >
      <div class="slider"></div>
    </div>
  `,
  styleUrls: ["./toggle.component.scss"],
})
export class ToggleComponent {
  @Input() checked = false;
  @Input() disable = false;
  switching() {
    this.checked = !this.checked;
  }
}
