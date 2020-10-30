import "reflect-metadata";
import "../polyfills";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HttpClientModule } from "@angular/common/http";

// Third party libraries
import { FileDropModule } from "ngx-file-drop";
import { ClickOutsideModule } from "ng-click-outside";
import { CodemirrorModule } from "@ctrl/ngx-codemirror";
import { TabsModule } from "ngx-tabs";
// import { VirtualScrollerModule } from "ngx-virtual-scroller";

import {
  MatTableModule,
  MatSortModule,
  MatDialogModule,
} from "@angular/material";

// Components
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ClipboardComponent } from "./sections/clipboard/clipboard.component";
import { HomeComponent } from "./sections/home/home.component";
import { ImportComponent } from "./sections/import/import.component";
import { SetComponent } from "./sections/sets/set/set.component";
import { SetsRoutingComponent } from "./sections/sets/sets-routing.component";
import { SetsComponent } from "./sections/sets/sets.component";
import { SettingsComponent } from "./sections/settings/settings.component";
import {
  NavigationComponent,
  DropdownComponent,
  TableComponent,
  LoaderComponent,
  GridViewComponent,
  ImagesComponent,
  ToggleComponent,
  DialogComponent,
  PreviewComponent,
} from "./shared/components";
import {
  DatePipe,
  SizePipe,
  FileNamePipe,
  FileTypePipe,
  PercentagePipe,
  SketchAttachmentFileExtentionPipe,
} from "./shared/pipes";
import {
  ElectronService,
  OptimizationService,
  ContextMenuService,
  DialogService,
  ThemeService,
  SetService,
} from "./core/services";
import { DropdownService } from "./shared/components/dropdown/dropdown.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    SetComponent,
    SetsComponent,
    SetsRoutingComponent,
    ImportComponent,
    DropdownComponent,
    TableComponent,
    LoaderComponent,
    GridViewComponent,
    ImagesComponent,
    SettingsComponent,
    ToggleComponent,
    DatePipe,
    SizePipe,
    FileNamePipe,
    FileTypePipe,
    PercentagePipe,
    DialogComponent,
    PreviewComponent,
    ClipboardComponent,
    SketchAttachmentFileExtentionPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FileDropModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    // VirtualScrollerModule,
    CodemirrorModule,
    TabsModule,

    CodemirrorModule,
    TabsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [
    ElectronService,
    OptimizationService,
    ContextMenuService,
    DialogService,
    DropdownService,
    ThemeService,
    SetService,
  ],
  entryComponents: [DialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
