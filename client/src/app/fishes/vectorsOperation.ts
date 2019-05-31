import * as THREE from "three";

// tslint:disable:max-line-length

export const addTwoVector: (vec1: THREE.Vector3, vec2: THREE.Vector3) => THREE.Vector3 = (vec1: THREE.Vector3, vec2: THREE.Vector3) => {
    return new THREE.Vector3(vec1.x + vec2.x, vec1.y + vec2.y, vec1.z + vec2.z);
};

export const getPerpendicularVector: (vec1: THREE.Vector3, vec2: THREE.Vector3) => THREE.Vector3 = (vec1: THREE.Vector3, vec2: THREE.Vector3) => {
    const VECTOR: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    VECTOR.crossVectors(vec1, vec2);

    return VECTOR;
};
