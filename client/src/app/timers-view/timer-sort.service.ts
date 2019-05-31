import { Injectable } from "@angular/core";
import { Device } from "../../../../common/communication/device";
import { Timer } from "../../../../common/communication/timer";
import { SortTypeDays } from "./timers-view.component";

@Injectable({
  providedIn: "root",
})
export class TimerSortService {

  constructor() { }

  public filterWithDevice(list: Timer[], device: Device): Timer[] {

    return list.filter((timer: Timer) => timer.device === device);
  }

  public filterWithDay(list: Timer[], day: SortTypeDays): Timer[] {
    let checker: (timer: Timer) => boolean;
    switch (day) {
      case SortTypeDays.Sunday: checker = (timer: Timer) => timer.days.sunday; break;
      case SortTypeDays.Monday: checker = (timer: Timer) => timer.days.monday; break;
      case SortTypeDays.Tuesday: checker = (timer: Timer) => timer.days.tuesday; break;
      case SortTypeDays.Wednesday: checker = (timer: Timer) => timer.days.wednesday; break;
      case SortTypeDays.Thursday: checker = (timer: Timer) => timer.days.thursday; break;
      case SortTypeDays.Friday: checker = (timer: Timer) => timer.days.friday; break;
      case SortTypeDays.Saturday: checker = (timer: Timer) => timer.days.saturday; break;
      default: checker = (timer: Timer) => true; break;
    }

    return list.filter(checker);
  }
}
