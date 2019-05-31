// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Ng5SliderModule } from "ng5-slider";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ControlsViewComponent } from "./controls-view/controls-view.component";
import { FishesComponent } from "./fishes/fishes.component";
import { RenderService } from "./fishes/render.service";
import { HomeViewComponent } from "./home-view/home-view.component";
import { RoutingLabelComponent } from "./routing-label/routing-label.component";
import { TimerComponent } from "./timers-view/timer/timer.component";
import { TimersViewComponent } from "./timers-view/timers-view.component";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeViewComponent,
        FishesComponent,
        ControlsViewComponent,
        TimersViewComponent,
        RoutingLabelComponent,
        TimerComponent,
      ],
      imports: [
        HttpClientModule,
        AppRoutingModule,
        Ng5SliderModule,
        FormsModule,
      ],
      providers: [ RenderService ],
    }).compileComponents();
  }));
  it("should create the app", async(() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
