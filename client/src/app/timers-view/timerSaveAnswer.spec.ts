import { TestHelper } from "src/test.helper";
import { Timer } from "../../../../common/communication/timer";
import { TimerSaveAnswer } from "./timerSaveAnswer";

// tslint:disable:no-magic-numbers

describe("TimerSaveAnswer", () => {

    let timerSaveAnser: TimerSaveAnswer;

    beforeEach(() => {
        timerSaveAnser = new TimerSaveAnswer([]);
    });

    describe("function updateWithCreated", () => {

    const TIMER_TO_KEEP: Timer = TestHelper.getTimer(); TIMER_TO_KEEP.id = 0;
    const TIMER_OLD_1: Timer = TestHelper.getTimer(); TIMER_OLD_1.id = 1;
    const TIMER_OLD_2: Timer = TestHelper.getTimer(); TIMER_OLD_2.id = 2;
    const TIMER_NEW_1: Timer = TestHelper.getTimer(); TIMER_NEW_1.id = 3;
    const TIMER_NEW_2: Timer = TestHelper.getTimer(); TIMER_NEW_2.id = 4;

    it("should have removed the old one", () => {
      const ALL: Timer[] = [ TIMER_TO_KEEP, TIMER_OLD_1, TIMER_OLD_2 ];
      const OLD: Timer[] = [ TIMER_OLD_1, TIMER_OLD_2 ];
      const NEW: Timer[] = [ TIMER_NEW_1, TIMER_NEW_2 ];
      const RESULT: Timer[] = timerSaveAnser.updateWithcreated(ALL, NEW, OLD);
      expect(RESULT).not.toContain(TIMER_OLD_1);
      expect(RESULT).not.toContain(TIMER_OLD_2);
      expect(RESULT).toContain(TIMER_NEW_1);
      expect(RESULT).toContain(TIMER_NEW_2);
      expect(RESULT).toContain(TIMER_TO_KEEP);
    });
  });
});
