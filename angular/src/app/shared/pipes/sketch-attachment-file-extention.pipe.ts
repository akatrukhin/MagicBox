import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "fileExtention",
})
export class SketchAttachmentFileExtentionPipe implements PipeTransform {
  transform(value: string): string {
    return value.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[1];
  }
}
