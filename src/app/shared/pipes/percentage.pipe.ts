import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "percentage",
})
export class PercentagePipe implements PipeTransform {
  transform(value: any): string {
    const percent = Math.floor(value) > -1 ? Math.floor(value) : 0;
    return `${percent} <span class="size-value">%</span>`;
  }
}
