import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

moment.updateLocale("en", {
  calendar: {
    lastDay: "[Yesterday] LT",
    sameDay: "[Today] LT",
    lastWeek: "dddd LT",
  },
});

@Pipe({
  name: "date",
})
export class DatePipe implements PipeTransform {
  transform(value: string): string {
    if (moment().diff(value, "days") > 5) {
      return (value =
        moment(value).format("MMM D") +
        "<span class=\"data-year\">, " +
        moment(value).format("YYYY") +
        "</span>");
    }
    return (value = moment(value).calendar());
  }
}
