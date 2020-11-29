import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fileType",
})
export class FileTypePipe implements PipeTransform {
  transform(value: string): string {
    let fileName = value.replace("image/", "");
    if (fileName === "svg+xml") {
      fileName = "svg";
    }
    if (!fileName) {
      fileName = "sketch";
    }
    return fileName;
  }
}
