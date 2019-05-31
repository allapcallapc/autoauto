import * as THREE from "three";
import { getPerpendicularVector } from "./vectorsOperation";

// tslint:disable:no-magic-numbers

describe("vectorsOperation", () => {
    describe("perdendicularVector", () => {
        it("should return (1, 0, 0)", () => {
            const EXPECTED: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
            const VEC_1: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
            const VEC_2: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
            expect(getPerpendicularVector(VEC_1, VEC_2).x).toEqual(EXPECTED.x);
            expect(getPerpendicularVector(VEC_1, VEC_2).y).toEqual(EXPECTED.y);
            expect(getPerpendicularVector(VEC_1, VEC_2).z).toEqual(EXPECTED.z);
        });

        it("should return (0, 0, 0)", () => {
            const EXPECTED: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
            const VEC_1: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
            const VEC_2: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
            expect(getPerpendicularVector(VEC_1, VEC_2).x).toEqual(EXPECTED.x);
            expect(getPerpendicularVector(VEC_1, VEC_2).y).toEqual(EXPECTED.y);
            expect(getPerpendicularVector(VEC_1, VEC_2).z).toEqual(EXPECTED.z);
        });

        it("should return (-50, 0, 50)", () => {
            const EXPECTED: THREE.Vector3 = new THREE.Vector3(-50, 0, 50);
            const VEC_1: THREE.Vector3 = new THREE.Vector3(50, 50, 50);
            const VEC_2: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
            expect(getPerpendicularVector(VEC_1, VEC_2).x).toEqual(EXPECTED.x);
            expect(getPerpendicularVector(VEC_1, VEC_2).y).toEqual(EXPECTED.y);
            expect(getPerpendicularVector(VEC_1, VEC_2).z).toEqual(EXPECTED.z);
        });

        it("should return (3252.71, -2563.2935, 4106.4264)", () => {
            const EXPECTED: THREE.Vector3 = new THREE.Vector3(3252.71, -2563.2935, 4106.4264);
            const VEC_1: THREE.Vector3 = new THREE.Vector3(46.3, 96.4, 23.5);
            const VEC_2: THREE.Vector3 = new THREE.Vector3(0.369, 89.46, 55.55);
            const RESULT: THREE.Vector3 = getPerpendicularVector(VEC_1, VEC_2);
            expect(Math.round(RESULT.x * 100) / 100).toEqual(Math.round(EXPECTED.x * 100) / 100);
            expect(Math.round(RESULT.y * 100) / 100).toEqual(Math.round(EXPECTED.y * 100) / 100);
            expect(Math.round(RESULT.z * 100) / 100).toEqual(Math.round(EXPECTED.z * 100) / 100);
        });
    });
});
