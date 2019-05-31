import { Component, OnInit } from "@angular/core";
import { Device } from "../../../../common/communication/device";
import { Timer } from "../../../../common/communication/timer";
import { SnackbarComponent } from "../snackbar/snackbar.component";
import { TimerSortService } from "./timer-sort.service";
import { TimerSaveAnswer } from "./timerSaveAnswer";
import { TimersUpdateService } from "./timers-update.service";

export enum SortType1 {
    All = "All",
    Device = "Device",
    Day = "Day",
}

export enum SortTypeDays {
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
}

@Component({
    selector: "app-timers-view",
    templateUrl: "./timers-view.component.html",
    styleUrls: ["./timers-view.component.css"],
})
export class TimersViewComponent implements OnInit {

    public timers: Timer[];
    public timersToDisplay: Timer[];
    public sortType1: string;
    public sortType2: string;
    public readonly sortType1Enum: typeof SortType1 = SortType1;

    public constructor(private timersUpdateService: TimersUpdateService, private sortService: TimerSortService) {
        this.timers = [];
        this.timersToDisplay = [];
        this.sortType1 = SortType1.All;
        this.sortType2 = "";
    }

    public ngOnInit(): void {
        this.timersUpdateService.getAllTimers().then((timers: Timer[]) => {
            this.timers = timers;
            this.timersToDisplay = this.timers;
        });
    }

    public getEnumType1(): Array<string> {
        return Object.keys(SortType1);
    }

    public getEnumType2(): Array<string> {
        switch (this.sortType1) {
            case SortType1.Day: return Object.keys(SortTypeDays);
            case SortType1.Device: return Object.keys(Device);
            default: return new Array<string>();
        }
    }

    public sortType1Changed(): void {
        switch (this.sortType1) {
            case SortType1.Day: this.sortType2 = this.getDayOfWeek(); break;
            case SortType1.Device: this.sortType2 = Device.Filter; break;
            default: this.sortType2 = ""; break;
        }

        this.sortType2Changed();
    }

    public sortType2Changed(): void {
        switch (this.sortType1) {
            case SortType1.Day:
                this.timersToDisplay = this.sortService.filterWithDay(this.timers, this.sortType2 as SortTypeDays);
                break;
            case SortType1.Device:
                this.timersToDisplay = this.sortService.filterWithDevice(this.timers, this.sortType2 as Device);
                break;
            default:
                this.timersToDisplay = this.timers;
                break;
        }
    }

    public getDayOfWeek(offset: number = 0): SortTypeDays {
        const N_DAYS: number = 7;
        let TODAYS_WEEK: number = new Date().getUTCDay();
        if (Math.sign(offset) === -1) {
            offset = N_DAYS - (Math.abs(offset) % N_DAYS);
        }
        TODAYS_WEEK = (TODAYS_WEEK + offset) % N_DAYS;

        return isNaN(TODAYS_WEEK) ?
            SortTypeDays.Sunday
            : [ SortTypeDays.Sunday,
                SortTypeDays.Monday,
                SortTypeDays.Tuesday,
                SortTypeDays.Wednesday,
                SortTypeDays.Thursday,
                SortTypeDays.Friday,
                SortTypeDays.Saturday][TODAYS_WEEK];
    }

    public dateClicked(offset: number = 0): void {
        this.sortType1 = SortType1.Day;
        this.sortType2 = this.getDayOfWeek(offset);
        this.sortType2Changed();
    }

    public addTimer(): void {
        const NEW_TIMER: Timer = {
                device: this.sortType1 === SortType1.Device ? this.sortType2 as Device : undefined as unknown as Device,
                end: 0,
                start: 0,
                days: { monday: this.sortType2 === SortTypeDays.Monday,         friday: this.sortType2 === SortTypeDays.Friday,
                        saturday:  this.sortType2 === SortTypeDays.Saturday,    sunday:  this.sortType2 === SortTypeDays.Sunday,
                        thursday:  this.sortType2 === SortTypeDays.Thursday,    tuesday: this.sortType2 === SortTypeDays.Tuesday,
                        wednesday:  this.sortType2 === SortTypeDays.Wednesday },
                id: undefined,
         };
        this.timers.unshift(NEW_TIMER);
        this.sortType2Changed();
    }

    public deleteTimer(timer: Timer): void {
        if (timer.id === undefined) {
            this.removeItemFromList(this.timers, timer);
            this.removeItemFromList(this.timersToDisplay, timer);
        } else {
            this.timersUpdateService.deleteTimer(timer.id).then((result: boolean) => {
                this.removeItemFromList(this.timers, timer);
                this.removeItemFromList(this.timersToDisplay, timer);
            }).catch();
        }
    }

    // tslint:disable-next-line:no-any
    private removeItemFromList(list: any[], item: any): void {
        const index: number = list.indexOf(item);
        if (index >= 0) {
            list.splice(index, 1);
        }
    }

    public saveChanges(): void {
        this.timersUpdateService.saveChanges(this.timers).then((answer: TimerSaveAnswer) => {
            this.timers = answer.getTimers();
            this.sortType2Changed();
            SnackbarComponent.instance.show(answer.getMessage());
        });
    }

}
