import { Pipe, PipeTransform } from "@angular/core";
import { ElectronService } from "../../core/services";

@Pipe({ name: "fileSize" })
export class SizePipe implements PipeTransform {
  electron = new ElectronService();

  public transform(bytes: number): string {
    const sizeType = this.getSizeStandard();
    switch (true) {
      case bytes >= Math.pow(sizeType, 3):
        return (bytes / Math.pow(sizeType, 3)).toFixed(2) + this.getLabel("GB");
      case bytes >= Math.pow(sizeType, 2):
        return (bytes / Math.pow(sizeType, 2)).toFixed(2) + this.getLabel("MB");
      case bytes >= sizeType:
        return (bytes / sizeType).toFixed(2) + this.getLabel("KB");
      case bytes > 1:
        return bytes + this.getLabel("bytes");
      case bytes === 1:
        return bytes + this.getLabel("byte");
      default:
        return "0" + this.getLabel("bytes");
    }
  }

  private getSizeStandard(): number {
    switch (this.electron.os.platform()) {
      case "darwin":
        return 1000;
      default:
        return 1024;
    }
  }

  private getLabel(label: string): string {
    return `&nbsp;<span class="size-value">${label}</span>`;
  }
}
