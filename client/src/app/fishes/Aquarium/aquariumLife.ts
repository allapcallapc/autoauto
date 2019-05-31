import * as THREE from "three";
import { CHANCE_TO_ATTACK, N_FISHES, N_PREDATORS, SCALE_FISH, SCALE_PREDATOR } from "./aquariumParameters";
import { Fish } from "./fish";
import { PredatorFish } from "./predatorFish";

export interface FishGroup {
    fishes: Fish[];
    nFish: number;
}

export class AquariumLife {

    private sizeOfAquarium: THREE.Vector3;
    private fishGroup: FishGroup[];
    private predators: PredatorFish[];

    public static getRandomFishGroup(fishGroups: FishGroup[]): Fish[] {
        return fishGroups[Math.floor(Math.random() * (fishGroups.length))].fishes;
    }

    public static getRandomFish(fishes: Fish[]): Fish {
        return fishes[Math.floor(Math.random() * (fishes.length))];
    }

    public attackOnKey(): void {
        (AquariumLife.getRandomFish(this.predators) as PredatorFish).attack(AquariumLife.getRandomFishGroup(this.fishGroup));
    }

    public constructor() {
        this.fishGroup = [];
        this.predators = [];
        this.sizeOfAquarium = new THREE.Vector3();
    }

    public fill(scene: THREE.Scene, aquariumDimension: THREE.Vector3): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                N_FISHES.forEach((nFish: number) => {
                        this.fishGroup.push({ fishes: [], nFish: nFish});
                });
                this.sizeOfAquarium = aquariumDimension;
                this.createFishes(scene);
                this.createPredators(scene);
                resolve();
            }, 1);
        });
    }

    private async createFishes(scene: THREE.Scene): Promise<void> {
        this.fishGroup.forEach((fishGroup: FishGroup) => {
            for ( let i: number = 0; i < fishGroup.nFish; i++) {
                const fish: Fish = new Fish(this.sizeOfAquarium.x, this.sizeOfAquarium.y, this.sizeOfAquarium.z);
                fish.scale.x *= SCALE_FISH;
                fish.scale.y *= SCALE_FISH;
                fish.scale.z *= SCALE_FISH;

                fishGroup.fishes[i] = fish;
                scene.add(fishGroup.fishes[i]);
            }
        });
    }

    private async createPredators(scene: THREE.Scene): Promise<void> {
        for ( let i: number = 0; i < N_PREDATORS; i++) {
            const predator: PredatorFish = new PredatorFish(this.sizeOfAquarium.x, this.sizeOfAquarium.y, this.sizeOfAquarium.z);
            predator.scale.x *= SCALE_PREDATOR;
            predator.scale.y *= SCALE_PREDATOR;
            predator.scale.z *= SCALE_PREDATOR;

            this.predators[i] = predator;
            scene.add(this.predators[i]);
        }
    }

    public animate(): void {
        this.fishGroup.forEach((fishGroup: FishGroup) => {
            fishGroup.fishes.forEach((fish: Fish) => {
                fish.move();
                this.predators.forEach((predator: PredatorFish) => {
                    fish.avoidPredator(predator);
                });
                fish.school(fishGroup.fishes);
            });
        });
        this.predators.forEach((predator: PredatorFish) => {
            predator.move();
            if ( Math.random() < CHANCE_TO_ATTACK) {
                predator.attack(AquariumLife.getRandomFishGroup(this.fishGroup));
            }
        });
    }

    public resize(newDimension: THREE.Vector3): void {
        this.sizeOfAquarium = newDimension;
        this.fishGroup.forEach((fishGroup: FishGroup) => {
            fishGroup.fishes.forEach((fish: Fish) => {
                fish.changeWidth(this.sizeOfAquarium.x, this.sizeOfAquarium.y, this.sizeOfAquarium.z);
            });
        });
    }
}
