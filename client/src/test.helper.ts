import { defer, from, Observable } from "rxjs";
import { Device } from "../../common/communication/device";
import { Timer } from "../../common/communication/timer";

/** Create async observable that emits-once and completes
 *  after a JS engine turn */
export class TestHelper {

    public static asyncData<T>(data: T): Observable<T> {
        return defer(() => from(Promise.resolve(data)));
    }

    // tslint:disable-next-line:no-any
    public static getRouterSpy(): any {
        return jasmine.createSpyObj("Router", ["navigate"]);
    }

    public static getTimer(): Timer {
        return { device: Device.Filter,
                 end: 120,
                 start: 0,
                 days: { monday: true, friday: true, saturday: true, sunday: true,
                         thursday: true, tuesday:  true, wednesday: true },
                 id: 0,
         };
    }
}
