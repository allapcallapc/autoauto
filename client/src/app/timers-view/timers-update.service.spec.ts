import { TestBed } from "@angular/core/testing";

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Observable } from "rxjs";
import { TestHelper } from "src/test.helper";
import { Device } from "../../../../common/communication/device";
import { Timer } from "../../../../common/communication/timer";
import { TimersUpdateService } from "./timers-update.service";

// tslint:disable:no-magic-numbers

describe("TimersUpdateService", () => {

  let service: TimersUpdateService;
  // tslint:disable-next-line:no-any
  const httpSpy: any = jasmine.createSpyObj("HttpClient", ["get", "post"]);
  httpSpy.get.and.returnValue(new Observable<Timer[]>());

  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: HttpClient, useValue: httpSpy }],
    imports: [ HttpClientModule ],
  }));

  it("should be created", () => {
    service = TestBed.get(TimersUpdateService);
    expect(service).toBeTruthy();
  });

  describe("isTimerValid", () => {
    it("should detect a timer without device", () => {
      const timer: Timer = TestHelper.getTimer();
      timer.device = undefined as unknown as Device;
      expect(service.isTimerValid(timer)).toEqual(false);
    });
    it("should detect a timer without time", () => {
      const timer: Timer = TestHelper.getTimer();
      timer.start = timer.end;
      expect(service.isTimerValid(timer)).toEqual(false);
    });
    it("should not detect a valid timer", () => {
      const timer: Timer = TestHelper.getTimer();
      expect(service.isTimerValid(timer)).toEqual(true);
    });
  });
});
