import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./sections/home/home.component";
import { ImportComponent } from "./sections/import/import.component";
import { SetComponent } from "./sections/set/set.component";
import { SettingsComponent } from "./sections/settings/settings.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "",
        redirectTo: "import",
        pathMatch: "full",
      },
      {
        path: "import",
        component: ImportComponent,
      },
      {
        path: "sets/:id",
        component: SetComponent,
      },
      {
        path: "settings",
        component: SettingsComponent,
      },
    ],
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  { path: "**", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
