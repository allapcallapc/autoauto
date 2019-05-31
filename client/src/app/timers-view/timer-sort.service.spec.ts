import { TestBed } from "@angular/core/testing";

import { TestHelper } from "src/test.helper";
import { Device } from "../../../../common/communication/device";
import { Timer } from "../../../../common/communication/timer";
import { TimerSortService } from "./timer-sort.service";
import { SortTypeDays } from "./timers-view.component";

describe("TimerSortService", () => {

  let service: TimerSortService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => service = TestBed.get(TimerSortService));

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("function filterWithDevice", () => {
    const TIMER_FILTER_1: Timer = TestHelper.getTimer(); TIMER_FILTER_1.device = Device.Filter;
    const TIMER_FILTER_2: Timer = TestHelper.getTimer(); TIMER_FILTER_2.device = Device.Filter;
    const TIMER_BUBBLE_1: Timer = TestHelper.getTimer(); TIMER_BUBBLE_1.device = Device.Bubble;
    const TIMER_BUBBLE_2: Timer = TestHelper.getTimer(); TIMER_BUBBLE_2.device = Device.Bubble;
    const TIMER_LIGHT_1: Timer = TestHelper.getTimer(); TIMER_LIGHT_1.device = Device.Light;
    const TIMER_LIGHT_2: Timer = TestHelper.getTimer(); TIMER_LIGHT_2.device = Device.Light;
    const LIST: Timer[] = [TIMER_FILTER_1, TIMER_FILTER_2, TIMER_BUBBLE_1, TIMER_BUBBLE_2, TIMER_LIGHT_1, TIMER_LIGHT_2];

    it("should return a list with only the filter", () => {
      expect(service.filterWithDevice(LIST, Device.Filter)).toEqual([TIMER_FILTER_1, TIMER_FILTER_2]);
    });

    it("should return a list with only the light", () => {
      expect(service.filterWithDevice(LIST, Device.Light)).toEqual([TIMER_LIGHT_1, TIMER_LIGHT_1]);
    });

    it("should return a list with only the bubble", () => {
      expect(service.filterWithDevice(LIST, Device.Bubble)).toEqual([TIMER_BUBBLE_1, TIMER_BUBBLE_2]);
    });
  });

  describe("function filterWithDay", () => {
    const WEDNESDAY: Timer = TestHelper.getTimer();
    WEDNESDAY.days = {monday: false, tuesday: false, wednesday: true, thursday: false, friday: false, saturday: false, sunday: false};
    const MONDAY: Timer = TestHelper.getTimer();
    MONDAY.days = {monday: true, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false};
    const SUNDAY: Timer = TestHelper.getTimer();
    SUNDAY.days = {monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: true};
    const TUESDAY: Timer = TestHelper.getTimer();
    TUESDAY.days = {monday: false, tuesday: true, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false};
    const LIST: Timer[] = [WEDNESDAY, MONDAY, SUNDAY, TUESDAY];

    it("should return a list with only the monday", () => {
      expect(service.filterWithDay(LIST, SortTypeDays.Monday)).toEqual([MONDAY]);
    });

    it("should return a list with only the sunday", () => {
      expect(service.filterWithDay(LIST, SortTypeDays.Sunday)).toEqual([SUNDAY]);
    });

    it("should return a list with only the wednesday", () => {
      expect(service.filterWithDay(LIST, SortTypeDays.Wednesday)).toEqual([WEDNESDAY]);
    });
  });
});
