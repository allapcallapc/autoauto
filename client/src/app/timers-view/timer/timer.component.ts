import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Options } from "ng5-slider";
import { Device } from "../../../../../common/communication/device";
import { Timer } from "../../../../../common/communication/timer";

const BASE_10: number = 10;
const BASE_100: number = 100;
const MINUTES_IN_HOUR: number = 60;
const BIGGEST_NUMBER_POSSIBLE: number = 1440;

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.css"],
})
export class TimerComponent implements OnInit {

  @Input() public timer: Timer;
  @Output() public timerDelete: EventEmitter<string>;
  public isDeleteThere: boolean;
  public readonly options: Options = {
    floor: 0,
    ceil: BIGGEST_NUMBER_POSSIBLE,
    enforceStep: true,
    step: 5,
    noSwitching: true,
    draggableRange: true,
    hideLimitLabels: true,
    hidePointerLabels: true,
  };

  public constructor() {
    this.isDeleteThere = false;
    this.timerDelete = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    this.timer.modified = false;
  }

  public get startDate(): string {
    return this.formatDate(this.timer.start);
  }

  public get endDate(): string {
    return this.formatDate(this.timer.end);
  }

  public formatDate(value: number): string {
    return value <= BIGGEST_NUMBER_POSSIBLE && value >= 0 ?
      `${this.formatNumberOnTwoDigits(Math.floor(value / MINUTES_IN_HOUR))}:${this.formatNumberOnTwoDigits(value % MINUTES_IN_HOUR)}`
      : "XX:XX";
  }

  public formatNumberOnTwoDigits(value: number): string {
    value = value % BASE_100;

    return value < BASE_10 ? `0${value}` : `${value}`;
  }

  public get imagePath(): string {
    switch (this.timer.device) {
      case Device.Bubble: return "assets/bubble.png";
      case Device.Filter: return "assets/filter.png";
      case Device.Light: return "assets/light.png";
      default: return "nothing";
    }
  }

  public onClick(): void {
    this.isDeleteThere = !this.isDeleteThere;
  }

  public deleteClick(): void {
    if (window.confirm("Are you sure you want to delete this timer ?")) {
      this.timerDelete.emit("delete");
    }
  }

  public getEnumType(): Array<string> {
    return Object.keys(Device);
  }

  public putModified(): void {
    this.timer.modified = true;
  }

}
