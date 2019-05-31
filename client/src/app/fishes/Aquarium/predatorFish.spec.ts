import * as THREE from "three";
import { Fish } from "./fish";
import { PredatorFish } from "./predatorFish";

const BOX_SIZE: number = 1000;

// tslint:disable:no-magic-numbers

describe("PredatorFish", () => {

    let predator: PredatorFish;

    beforeEach(() => {
        predator = new PredatorFish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
    });

    describe("function getAveragePosition", () => {

        let fishes: Fish[];

        beforeEach(() => {
            fishes = [];
        });

        describe("for a group of one fish", () => {
            it("should return the exact position of the fish (0, 0, 0)", () => {
                const fish: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish.position.set(0, 0, 0);
                fishes = [fish];
                expect(predator.getAveragePosition(fishes)).toEqual(new THREE.Vector3(0, 0, 0));
            });

            it("should return the exact position of the fish not (0, 0, 0)", () => {
                const fish: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish.position.set(45, 79, 78);
                fishes = [fish];
                expect(predator.getAveragePosition(fishes)).toEqual(new THREE.Vector3(45, 79, 78));
            });
        });

        describe("for a group of two fish", () => {
            it("should return (0, 0, 0)", () => {
                const fish: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish.position.set(0, 0, 0);
                const fish1: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish1.position.set(0, 0, 0);
                fishes = [fish, fish1];
                expect(predator.getAveragePosition(fishes)).toEqual(new THREE.Vector3(0, 0, 0));
            });

            it("should return not (0, 0, 0)", () => {
                const fish: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish.position.set(1, 56, 0);
                const fish1: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish1.position.set(6, 50, -56);
                fishes = [fish, fish1];
                expect(predator.getAveragePosition(fishes)).toEqual(new THREE.Vector3(3.5, 53, -28));
            });
        });

        describe("for a group of three fish", () => {
            it("should return (0, 0, 0)", () => {
                const fish: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish.position.set(0, 0, 0);
                const fish1: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish1.position.set(0, 0, 0);
                const fish2: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish2.position.set(0, 0, 0);
                fishes = [fish, fish1, fish2];
                expect(predator.getAveragePosition(fishes)).toEqual(new THREE.Vector3(0, 0, 0));
            });

            it("should return not (0, 0, 0)", () => {
                const fish: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish.position.set(1, 56, 0);
                const fish1: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish1.position.set(6, 50, -56);
                const fish2: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish2.position.set(56, -4, 56);
                fishes = [fish, fish1, fish2];
                expect(predator.getAveragePosition(fishes)).toEqual(new THREE.Vector3(21, 34, 0));
            });
        });

        describe("for a group of more fish", () => {

            const ACCEPTABLE_ERROR: number = 50;

            it("should return (0, 0, 0)", () => {
                const fish: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish.position.set(0, 0, 0);
                const fish1: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish1.position.set(0, 0, 0);
                const fish2: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish2.position.set(0, 0, 0);
                const fish3: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish2.position.set(0, 0, 0);
                const fish4: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish2.position.set(0, 0, 0);
                const fish5: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish2.position.set(0, 0, 0);
                const fish6: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish2.position.set(0, 0, 0);
                const fish7: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish2.position.set(0, 0, 0);
                const fish8: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish2.position.set(0, 0, 0);
                const fish9: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
                fish2.position.set(0, 0, 0);
                fishes = [fish, fish1, fish2, fish3, fish4, fish5, fish6, fish7, fish8, fish9];
                expect(predator.getAveragePosition(fishes)).toEqual(new THREE.Vector3(0, 0, 0));
            });

            it("should return not (0, 0, 0) for 10 fish", () => {
                const fish0: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE); fish0.position.set(45, 0, 54);
                const fish1: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE); fish1.position.set(96, 0, -150);
                const fish2: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE); fish2.position.set(48, 0, 90);
                const fish3: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE); fish2.position.set(123, 0, -56);
                const fish4: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE); fish2.position.set(-36, 0, -3);
                const fish5: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE); fish2.position.set(78, 0, 150);
                const fish6: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE); fish2.position.set(36, 0, 56);
                const fish7: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE); fish2.position.set(89, 0, -89);
                const fish8: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE); fish2.position.set(1, 0, -96);
                const fish9: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE); fish2.position.set(0, 56, -36);

                fishes = [fish0, fish1, fish2, fish3, fish4, fish5, fish6, fish7, fish8, fish9];
                const realAverage: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
                fishes.forEach((fishInArray: Fish) => {
                    realAverage.add(fishInArray.position);
                });
                realAverage.divideScalar(10);
                const RESULT: THREE.Vector3 = predator.getAveragePosition(fishes);
                expect(RESULT.x).toBeGreaterThan(realAverage.x - ACCEPTABLE_ERROR, "x");
                expect(RESULT.x).toBeLessThan(realAverage.x + ACCEPTABLE_ERROR, "x");
                expect(RESULT.y).toBeGreaterThan(realAverage.y - ACCEPTABLE_ERROR, "y");
                expect(RESULT.y).toBeLessThan(realAverage.y + ACCEPTABLE_ERROR, "y");
                expect(RESULT.z).toBeGreaterThan(realAverage.z - ACCEPTABLE_ERROR, "z");
                expect(RESULT.z).toBeLessThan(realAverage.z + ACCEPTABLE_ERROR, "z");
            });
        });
    });
});
