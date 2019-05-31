import { Injectable } from "@angular/core";
import { DEFAULT_TIME_CONTROLLING,
         MAX_TIME_CONTROLLING, MINUTE, SEC, STEP_CONTROLLING } from "../../../../common/communication/controllingConstants";

@Injectable({
    providedIn: "root",
})
export class TimerControlling {
    private timeout: NodeJS.Timeout;
    public time: number;

    private static getFormattedTime(min: number, sec: number): string {
      return `${this.formatTo2Digit(min)}:${this.formatTo2Digit(sec)}`;
    }

    private static formatTo2Digit(numberToTest: number): string {
      const MIN_DOUBLE_DIGIT_NUMBER: number = 10;

      return (Math.abs(numberToTest) < MIN_DOUBLE_DIGIT_NUMBER) ? `0${numberToTest}` : `${numberToTest}`;
    }

    public resetTime(time: number = DEFAULT_TIME_CONTROLLING): void {
        clearTimeout(this.timeout);
        this.time = time;
        this.countDown();
    }

    private countDown(): void {
        this.timeout = setTimeout(() => {
            this.time -= SEC;
            if (this.time !== 0) {
                this.countDown();
            }
        },                        SEC);
    }

    public addTime(timeToAdd: number = STEP_CONTROLLING): void {
        this.removeTime(-timeToAdd);
        if (this.time > MAX_TIME_CONTROLLING) {
            this.time = MAX_TIME_CONTROLLING;
        }
    }

    public removeTime(timeToRemove: number = STEP_CONTROLLING): void {
        this.time -= timeToRemove;
        if (this.time < 0) {
            this.time = 0;
            clearTimeout(this.timeout);
        } else if (this.timeout === undefined) {
            this.countDown();
        }
    }

    public get formattedTime(): string {
        const min: number = Math.floor(this.time / MINUTE);
        const sec: number = Math.floor(this.time % MINUTE ) / SEC;

        return TimerControlling.getFormattedTime(min, sec);
    }
}
