import { Fish } from "./fish";
import { PredatorFish } from "./predatorFish";

// tslint:disable:no-magic-numbers

describe("Fish", () => {

    let fish: Fish;

    beforeEach(() => {
        fish = new Fish(100, 100, 100);
    });

    describe("function getRandomBoundedPosition", () => {
        it("should always return a value within +- 100 (1)", () => {
            const valueReturned: number = fish.getRandomBoundedPosition(0, 100);
            expect(valueReturned).toBeGreaterThanOrEqual(-100);
            expect(valueReturned).toBeLessThanOrEqual(100);
        });

        it("should always return a value within +- 100 (2)", () => {
            const valueReturned: number = fish.getRandomBoundedPosition(0, 100);
            expect(valueReturned).toBeGreaterThanOrEqual(-100);
            expect(valueReturned).toBeLessThanOrEqual(100);
        });

        it("should always return a value within +- 100 (3)", () => {
            const valueReturned: number = fish.getRandomBoundedPosition(0, 100);
            expect(valueReturned).toBeGreaterThanOrEqual(-100);
            expect(valueReturned).toBeLessThanOrEqual(100);
        });

        it("should always return a value within +- 100 (4)", () => {
            const valueReturned: number = fish.getRandomBoundedPosition(0, 100);
            expect(valueReturned).toBeGreaterThanOrEqual(-100);
            expect(valueReturned).toBeLessThanOrEqual(100);
        });

        it("should always return a |value| bigger than 25 (1)", () => {
            const valueReturned: number = Math.abs(fish.getRandomBoundedPosition(25, 100));
            expect(valueReturned).toBeGreaterThanOrEqual(25);
            expect(valueReturned).toBeLessThanOrEqual(100);
        });

        it("should always return a |value| bigger than 25 (2)", () => {
            const valueReturned: number = Math.abs(fish.getRandomBoundedPosition(25, 100));
            expect(valueReturned).toBeGreaterThanOrEqual(25);
            expect(valueReturned).toBeLessThanOrEqual(100);
        });

        it("should always return a |value| bigger than 25 (3)", () => {
            const valueReturned: number = Math.abs(fish.getRandomBoundedPosition(25, 100));
            expect(valueReturned).toBeGreaterThanOrEqual(25);
            expect(valueReturned).toBeLessThanOrEqual(100);
        });

        it("should always return a |value| bigger than 25 (4)", () => {
            const valueReturned: number = Math.abs(fish.getRandomBoundedPosition(25, 100));
            expect(valueReturned).toBeGreaterThanOrEqual(25);
            expect(valueReturned).toBeLessThanOrEqual(100);
        });
    });

    describe("function avoidPredator", () => {
        let predator: PredatorFish;

        beforeEach(() => {
            predator = new PredatorFish(100, 100, 100);
            predator.position.set(0, 0, 0);
            fish.position.set(0, 0, 0);
            spyOn(fish, "changeSpeed").and.callThrough();
            jasmine.clock().install();
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });

        it("should call to change the speed back to normal only once after XXX time", () => {
            spyOn(predator, "isAttacking").and.callFake(() => true);
            fish.avoidPredator(predator);
            fish.avoidPredator(predator);
            fish.avoidPredator(predator);
            jasmine.clock().tick(20000);
            expect(fish.changeSpeed).toHaveBeenCalledTimes(4);
            expect(fish.changeSpeed).toHaveBeenCalledWith(3);
        });

        it("should call not change the speed if the predator is not attacking", () => {
            spyOn(predator, "isAttacking").and.callFake(() => false);
            fish.avoidPredator(predator);
            fish.avoidPredator(predator);
            fish.avoidPredator(predator);
            jasmine.clock().tick(20000);
            expect(fish.changeSpeed).toHaveBeenCalledTimes(0);
        });
    });
});
