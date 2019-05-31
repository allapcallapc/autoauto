import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ControlsViewComponent } from "./controls-view/controls-view.component";
import { HomeViewComponent } from "./home-view/home-view.component";
import { TimersViewComponent } from "./timers-view/timers-view.component";

const routes: Routes = [
    {path: "Home", component: HomeViewComponent},
    {path: "Controls", component: ControlsViewComponent},
    {path: "Timers", component: TimersViewComponent},
    {path: "**", redirectTo: "Home"},
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
