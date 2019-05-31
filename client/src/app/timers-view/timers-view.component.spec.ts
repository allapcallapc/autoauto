import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Ng5SliderModule } from "ng5-slider";
import { Observable } from "rxjs";
import { Timer } from "../../../../common/communication/timer";
import { TimerComponent } from "./timer/timer.component";
import { SortTypeDays, TimersViewComponent } from "./timers-view.component";

// tslint:disable:no-magic-numbers

describe("TimersViewComponent", () => {
  let component: TimersViewComponent;
  let fixture: ComponentFixture<TimersViewComponent>;
  // tslint:disable-next-line:no-any
  const httpSpy: any = jasmine.createSpyObj("HttpClient", ["get", "post"]);
  httpSpy.get.and.returnValue(new Observable<Timer[]>());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimersViewComponent, TimerComponent ],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
      imports: [ Ng5SliderModule,
                 FormsModule,
                 HttpClientModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("function getDayOfWeek", () => {

    it("should return wednesday for a wednesday", () => {
      const OLD_DATE: number = new Date("2013-07-31").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek()).toEqual(SortTypeDays.Wednesday);
    });

    it("should return friday for a friday", () => {
      const OLD_DATE: number = new Date("2019-05-03T05:00:00").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek()).toEqual(SortTypeDays.Friday);
    });

    it("should return sunday for a sunday", () => {
      const OLD_DATE: number = new Date("2019-04-14").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek()).toEqual(SortTypeDays.Sunday);
    });

    it("should return tuesday for a wednesday with an offset of -1", () => {
      const OLD_DATE: number = new Date("2013-07-31").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek(-1)).toEqual(SortTypeDays.Tuesday);
    });

    it("should return thursday for a wednesday with an offset of 1", () => {
      const OLD_DATE: number = new Date("2013-07-31").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek(1)).toEqual(SortTypeDays.Thursday);
    });

    it("should return saturday for a sunday with an offset of -1", () => {
      const OLD_DATE: number = new Date("2019-05-05").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek(-1)).toEqual(SortTypeDays.Saturday);
    });

    it("should return monday for a sunday with an offset of 1", () => {
      const OLD_DATE: number = new Date("2019-05-05").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek(1)).toEqual(SortTypeDays.Monday);
    });

    it("should return friday for a saturday with an offset of -1", () => {
      const OLD_DATE: number = new Date("2019-05-04").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek(-1)).toEqual(SortTypeDays.Friday);
    });

    it("should return sunday for a saturday with an offset of 1", () => {
      const OLD_DATE: number = new Date("2019-05-04").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek(1)).toEqual(SortTypeDays.Sunday);
    });

    it("should return saturday for a saturday with an offset of 7", () => {
      const OLD_DATE: number = new Date("2019-05-04").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek(7)).toEqual(SortTypeDays.Saturday);
    });

    it("should return saturday for a saturday with an offset of -7", () => {
      const OLD_DATE: number = new Date("2019-05-04").getUTCDay();
      spyOn(Date.prototype, "getUTCDay").and.callFake(() => OLD_DATE);
      expect(component.getDayOfWeek(-7)).toEqual(SortTypeDays.Saturday);
    });
  });
});
