import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { Ng5SliderModule } from "ng5-slider";
import { TestHelper } from "src/test.helper";
import { TimerComponent } from "./timer.component";

// tslint:disable:no-magic-numbers

describe("TimerComponent", () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerComponent ],
      imports: [ Ng5SliderModule,
                 FormsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    component.timer = TestHelper.getTimer();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("function formatNumberOnTwoDigits", () => {
    it("should return 00 for 0", () => {
      expect(component.formatNumberOnTwoDigits(0)).toEqual("00");
    });
    it("should return 01 for 1", () => {
      expect(component.formatNumberOnTwoDigits(1)).toEqual("01");
    });
    it("should return 09 for 9", () => {
      expect(component.formatNumberOnTwoDigits(9)).toEqual("09");
    });
    it("should return 10 for 1", () => {
      expect(component.formatNumberOnTwoDigits(10)).toEqual("10");
    });
    it("should return 11 for 11", () => {
      expect(component.formatNumberOnTwoDigits(11)).toEqual("11");
    });
    it("should return 99 for 99", () => {
      expect(component.formatNumberOnTwoDigits(99)).toEqual("99");
    });
    it("should return 00 for 100", () => {
      expect(component.formatNumberOnTwoDigits(100)).toEqual("00");
    });
  });

  describe("function formatDate", () => {
    it("should return 00:00 for 0", () => {
      expect(component.formatDate(0)).toEqual("00:00");
    });
    it("should return 00:01 for 1", () => {
      expect(component.formatDate(1)).toEqual("00:01");
    });
    it("should return 00:10 for 10", () => {
      expect(component.formatDate(10)).toEqual("00:10");
    });
    it("should return 00:59 for 59", () => {
      expect(component.formatDate(59)).toEqual("00:59");
    });
    it("should return 01:00 for 60", () => {
      expect(component.formatDate(60)).toEqual("01:00");
    });
    it("should return 01:01 for 61", () => {
      expect(component.formatDate(61)).toEqual("01:01");
    });
    it("should return 12:59 for 779", () => {
      expect(component.formatDate(779)).toEqual("12:59");
    });
    it("should return 13:00 for 780", () => {
      expect(component.formatDate(780)).toEqual("13:00");
    });
    it("should return 23:59 for 1439", () => {
      expect(component.formatDate(1439)).toEqual("23:59");
    });
    it("should return XX:XX for a number too big", () => {
      expect(component.formatDate(10000)).toEqual("XX:XX");
    });
    it("should return XX:XX for a number too low", () => {
      expect(component.formatDate(-1)).toEqual("XX:XX");
    });
  });
});
