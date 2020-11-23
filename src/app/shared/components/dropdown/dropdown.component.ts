import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  Input,
  ElementRef,
} from "@angular/core";
import { DropdownService } from "./dropdown.service";
import { DropDownItemsAnimation } from "./dropdown.animations";
import { Set, AppFile } from "../../../data";

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
  animations: [DropDownItemsAnimation],
})
export class DropdownComponent {
  @Input() object: Set | AppFile;
  @Output() status = new EventEmitter<boolean>();
  @Output() selectedFiles = new EventEmitter<File[]>();
  @ViewChild("invisibleInput", { static: false }) fakeInput: ElementRef;

  dropdownState = false;
  outsideClickEnable = false;
  choosenItem: string;
  dropdownList: string[];

  constructor(private dropdownService: DropdownService) { }

  public open(): void {
    this.dropdownList = [...this.dropdownService.list];
    if (!this.dropdownState) {
      this.dropdownState = true;
      setTimeout(() => {
        this.outsideClickEnable = true;
      }, 10);
    } else {
      this.close();
    }
    this.status.emit(this.dropdownState);
  }

  public close(): void {
    this.outsideClickEnable = false;
    this.dropdownState = false;
    this.status.emit(this.dropdownState);
  }

  public selected(item: string): void {
    this.dropdownService.selected(item, this.object);
    this.close();
  }

  public getFilesFromSystem(): void {
    this.selectedFiles.emit(this.fakeInput.nativeElement.files);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
