import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Timer } from "../../../../common/communication/timer";
import { TimerSaveAnswer } from "./timerSaveAnswer";
import { RASP_SERVER_URL } from "../environment";

const BASE_SERVER_URL: string = `${RASP_SERVER_URL}api/timer`;

@Injectable({
    providedIn: "root",
})
export class TimersUpdateService {

    public constructor(private http: HttpClient) { }

    public getAllTimers(): Promise<Timer[]> {
        return this.http.get<Timer[]>(`${BASE_SERVER_URL}/all`).toPromise();
    }

    public deleteTimer(id: number): Promise<boolean> {
        return this.http.delete<boolean>(`${BASE_SERVER_URL}/${id}`).toPromise();
    }

    public saveChanges(timers: Timer[]): Promise<TimerSaveAnswer> {
        const answer: TimerSaveAnswer = new TimerSaveAnswer(timers);
        const timersCreated: Timer[] = this.filterCreated(timers);

        return new Promise<TimerSaveAnswer>((resolve) => {
            this.http.post<Timer[]>(`${BASE_SERVER_URL}/createTimers`, {timers: timersCreated})
                .toPromise().then((resultCreated: Timer[]) => {
                    answer.setAnswerCreated(resultCreated, timersCreated);
                    this.http.put<Timer[]>(`${BASE_SERVER_URL}/changeTimers`, {timers: this.filterModifiedAndNotCreated(timers)})
                    .toPromise().then((resultChanged: Timer[]) => {
                        answer.setAnswerUpdated(resultChanged);
                        resolve(answer);
                    }).catch(() => resolve(answer));
                }).catch(() => resolve(answer));
        });
    }

    public filterCreated(timers: Timer[]): Timer[] {
        return timers.filter((timer: Timer) => timer.id === undefined && this.isTimerValid(timer));
    }

    public isTimerValid(timer: Timer): boolean {
        return (timer.device !== undefined && timer.start !== timer.end && this.isDayValid(timer));
    }

    public isDayValid(timer: Timer): boolean {
        return timer.days.friday || timer.days.monday || timer.days.saturday
               || timer.days.sunday || timer.days.thursday || timer.days.tuesday || timer.days.wednesday;
    }

    public filterModifiedAndNotCreated(timers: Timer[]): Timer[] {
        return timers.filter((timer: Timer) => timer.id !== undefined && timer.modified === true);
    }
}
