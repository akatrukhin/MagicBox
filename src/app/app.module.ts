import "reflect-metadata";
import "../polyfills";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HttpClientModule } from "@angular/common/http";

// Third party libraries
import { NgxFileDropModule } from "ngx-file-drop";
import { ClickOutsideModule } from "ng-click-outside";
import { CodemirrorModule } from "@ctrl/ngx-codemirror";
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import {
  MatTableModule,
} from "@angular/material/table";
import {
  MatDialogModule
} from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";
import { ScrollingModule } from '@angular/cdk/scrolling';

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

// Pipes
import {
  DatePipe,
  SizePipe,
  FileNamePipe,
  FileTypePipe,
  PercentagePipe,
  SketchAttachmentFileExtentionPipe,
} from "./shared/pipes";

// Services
import {
  ElectronService,
  OptimizationService,
  ContextMenuService,
  DialogService,
  ThemeService,
  SetService,
  WebWorkerService
} from "./core/services";
import { DropdownService } from "./shared/components/dropdown/dropdown.service";
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppConfig } from "../environments/environment";

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
    NgxFileDropModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    ScrollingModule,
    CodemirrorModule,
    VirtualScrollerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: AppConfig.production }),
  ],
  providers: [
    ElectronService,
    OptimizationService,
    ContextMenuService,
    DialogService,
    DropdownService,
    ThemeService,
    SetService,
    WebWorkerService
  ],
  entryComponents: [DialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
