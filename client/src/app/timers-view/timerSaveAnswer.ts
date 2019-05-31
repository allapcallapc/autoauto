import { Timer } from "../../../../common/communication/timer";

export class TimerSaveAnswer {
    private timers: Timer[];
    private newCreated: Timer[];
    private oldCreated: Timer[];
    private nCreated: number;
    private nUpdated: number;

    public constructor(timers: Timer[]) {
        // To do a deep copy
        this.timers = timers;
    }

    public getTimers(): Timer[] {
        this.timers = this.updateWithcreated(this.timers, this.newCreated, this.oldCreated);

        return this.putAllToNonModified(this.timers);
    }

    public setAnswerCreated(newCreated: Timer[], oldCreated: Timer[]): void {
        this.newCreated = newCreated;
        this.oldCreated = oldCreated;
        this.nCreated = newCreated.length;
    }

    public setAnswerUpdated(timersUpdated: Timer[]): void {
        this.nUpdated = timersUpdated.length;
    }

    public updateWithcreated(all: Timer[], newToAdd: Timer[], oldtoRemove: Timer[]): Timer[] {
        // tslint:disable-next-line:prefer-for-of
        for (let i: number = 0; i < oldtoRemove.length; i++) {
            for (let j: number = 0; j < all.length; j++) {
                if (this.isSameTimerWithoutId(oldtoRemove[i], all[j])) {
                    all.splice(j, 1);
                }
            }
        }
        newToAdd.forEach((timer: Timer) => {
            all.unshift(timer);
        });

        return all;
    }

    public isSameTimerWithoutId(timer1: Timer, timer2: Timer): boolean {
        return timer1.device === timer2.device &&
                timer1.start === timer2.start &&
                timer1.end === timer2.end &&
                timer1.days.monday === timer2.days.monday &&
                timer1.days.tuesday === timer2.days.tuesday &&
                timer1.days.wednesday === timer2.days.wednesday &&
                timer1.days.thursday === timer2.days.thursday &&
                timer1.days.friday === timer2.days.friday &&
                timer1.days.saturday === timer2.days.friday &&
                timer1.days.sunday === timer2.days.sunday;
    }

    public getMessage(): string {
        return `Created ${this.nCreated} timers | Updated ${this.nUpdated} timers`;
    }

    public putAllToNonModified(timers: Timer[]): Timer[] {
        timers.forEach((timer: Timer) => {
            timer.modified = false;
        });

        return timers;
    }
}
