import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FishesComponent } from "./fishes.component";
import { RenderService } from "./render.service";

describe("FishesComponent", () => {
  let component: FishesComponent;
  let fixture: ComponentFixture<FishesComponent>;
  // tslint:disable-next-line:no-any
  let renderServiceSpy: any;

  beforeEach(async(() => {

    renderServiceSpy = jasmine.createSpyObj("Router", ["initialize", "stop"]);

    TestBed.configureTestingModule({
      declarations: [ FishesComponent ],
      providers: [ { provide: RenderService, useValue: renderServiceSpy } ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
