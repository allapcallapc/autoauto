import { AquariumLife, FishGroup } from "./aquariumLife";
import { Fish } from "./fish";

// tslint:disable:no-magic-numbers

const BOX_SIZE: number = 1000;

describe("AquariumLife", () => {
    describe("function getRandomFishGroup", () => {
        const fish0: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
        const fish1: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
        const fish2: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
        const fish3: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
        const fish4: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
        const fish5: Fish = new Fish(BOX_SIZE, BOX_SIZE, BOX_SIZE);
        const groups: FishGroup[] = [
            { fishes: [fish0], nFish: 1 },
            { fishes: [fish1], nFish: 1 },
            { fishes: [fish2], nFish: 1 },
            { fishes: [fish3], nFish: 1 },
            { fishes: [fish4], nFish: 1 },
            { fishes: [fish5], nFish: 1 },
        ];

        it("should give a defined fishgroup", () => {
            expect(AquariumLife.getRandomFishGroup(groups)).toBeDefined();
        });

        it("should return all fish group almost the same number of times", () => {
            const APPEARANCES: number[] = [0, 0, 0, 0, 0, 0];
            const N_TIMES: number = 400;
            for (let i: number = 0; i < N_TIMES; i++) {
                switch (AquariumLife.getRandomFishGroup(groups)[0]) {
                    case fish0: APPEARANCES[0]++; break;
                    case fish1: APPEARANCES[1]++; break;
                    case fish2: APPEARANCES[2]++; break;
                    case fish3: APPEARANCES[3]++; break;
                    case fish4: APPEARANCES[4]++; break;
                    case fish5: APPEARANCES[5]++; break;
                    default:    break;
                }
            }
            const EXPECTED: number = N_TIMES / 6;
            const ERROR: number = N_TIMES / 20;
            for (let i: number = 0; i < 6; i++) {
                expect(APPEARANCES[i]).toBeGreaterThanOrEqual(EXPECTED - ERROR, `The ${i}e was called too few times`);
                expect(APPEARANCES[i]).toBeLessThanOrEqual(EXPECTED + ERROR, `The ${i}e was called too many times`);
            }
        });
    });
});
