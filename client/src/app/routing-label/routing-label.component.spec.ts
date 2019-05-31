import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Router } from "@angular/router";
import { TestHelper } from "src/test.helper";
import { RoutingLabelComponent } from "./routing-label.component";

describe("RoutingLabelComponent", () => {
  let component: RoutingLabelComponent;
  let fixture: ComponentFixture<RoutingLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingLabelComponent ],
      providers: [ { provide: Router, useValue: TestHelper.getRouterSpy() } ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
