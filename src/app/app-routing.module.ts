import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./sections/home/home.component";
import { ImportComponent } from "./sections/import/import.component";
import { SetsRoutingComponent } from "./sections/sets/sets-routing.component";
import { SetsComponent } from "./sections/sets/sets.component";
import { SetComponent } from "./sections/sets/set/set.component";
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
        path: "sets",
        component: SetsRoutingComponent,
        children: [
          {
            path: "",
            component: SetsComponent,
          },
          {
            path: ":id",
            component: SetComponent,
          },
        ],
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
export class AppRoutingModule {}
