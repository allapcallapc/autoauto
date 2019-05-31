import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Router } from "@angular/router";
import { TestHelper } from "src/test.helper";
import { FishesComponent } from "../fishes/fishes.component";
import { RenderService } from "../fishes/render.service";
import { HomeViewComponent } from "./home-view.component";

describe("HomeViewComponent", () => {
  let component: HomeViewComponent;
  let fixture: ComponentFixture<HomeViewComponent>;
  // tslint:disable-next-line:no-any
  let renderServiceSpy: any;

  beforeEach(async(() => {

    renderServiceSpy = jasmine.createSpyObj("Router", ["initialize", "stop"]);
    TestBed.configureTestingModule({
      declarations: [ HomeViewComponent, FishesComponent ],
      providers: [ { provide: RenderService, useValue: renderServiceSpy },
                   { provide: Router, useValue: TestHelper.getRouterSpy() } ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
