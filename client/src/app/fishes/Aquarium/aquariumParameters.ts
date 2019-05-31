// tslint:disable:no-magic-numbers

// Aquarium Life
export const N_FISHES: number[] = [10, 10, 3, 20, 6, 20, 8, 50];
export const N_PREDATORS: number = 3;
export const SCALE_FISH: number = 0.05;
export const SCALE_PREDATOR: number = 0.15;
export const CHANCE_TO_ATTACK: number = 1 / 1000;

// Fish
export const MAX_VELOCITY_Y: number = 0.6;
export const NEIGHBORHOOD_RADIUS: number = 200;
export const MAX_STEER_FORCE: number = 0.09;
export const VELOCITY_NORMAL: number = 3;
export const VELOCITY_AVOIDING: number = 8;
export const MOUVEMENTSIDE_NORMAL: { factor: number, timeDone: number, maxTimeDone: number }
    = { factor: Math.PI * 0.06, timeDone: 0, maxTimeDone: 60 };
export const DISTANCE_AVOID_PREDATOR_NORMAL: number = 400;
export const DISTANCE_AVOID_PREDATOR_ATTACKING: number = 120;
export const TIME_TO_REACH_SAFE_ZONE_AFTER_ATTACK: number = 200;
export const CHANCE_OF_COHESION: number = 0.6;
export const MAX_INITAL_VELOCITY: number = 5;

// Predator
export const PREDATOR_VELOCITY_LENGTH: number = 1.5;
export const PREDATOR_VELOCITY_LENGTH_ATTACKING: number = 7;
export const PREDATOR_MOUVEMENTSIDE: { factor: number, timeDone: number, maxTimeDone: number }
    = { factor: Math.PI * 0.001, timeDone: 0, maxTimeDone: 200 };
export const SIGNIFICANCE_ATTACK: number = 6;
export const DISTANCE_TO_STOP_ATTACK: number = 75;
export const PREDATOR_ACCELERATION: number = 0.1;
export const PREDATOR_MAX_STEER_FORCE: number = 0.75;
export const PREDATOR_MAX_TIMED: number = 40;
export const PREDATOR_MAX_TIMED_ATTACKING: number = 8;

// Colors
export const COLOR_FISH: number[] = [
    0xCC0000, 0x000FCC, 0x007E04, 0xECD000, 0xEC00B1, // RED - BLUE - GREEN - YELLOW - PINK
];
export const COLOR_PREDATOR: number[] = [
    0x82815B, 0xA5A5A5, 0x4F2222, 0x172B6D, // DARK YELLOW - GRAY - RED - BLUE
];
