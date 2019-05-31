import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { Ng5SliderModule } from "ng5-slider";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ControlsViewComponent } from "./controls-view/controls-view.component";
import { FishesComponent } from "./fishes/fishes.component";
import { RenderService } from "./fishes/render.service";
import { HomeViewComponent } from "./home-view/home-view.component";
import { LoginScreenComponent } from "./login-screen/login-screen.component";
import { RoutingLabelComponent } from "./routing-label/routing-label.component";
import { SnackbarComponent } from "./snackbar/snackbar.component";
import { TimerComponent } from "./timers-view/timer/timer.component";
import { TimersViewComponent } from "./timers-view/timers-view.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    FishesComponent,
    ControlsViewComponent,
    RoutingLabelComponent,
    TimersViewComponent,
    TimerComponent,
    SnackbarComponent,
    LoginScreenComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    Ng5SliderModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [RenderService],
  bootstrap: [AppComponent],
})
export class AppModule { }
