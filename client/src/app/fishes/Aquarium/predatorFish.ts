import * as THREE from "three";
import { getPerpendicularVector } from "../vectorsOperation";
import { COLOR_PREDATOR, DISTANCE_TO_STOP_ATTACK, PREDATOR_ACCELERATION, PREDATOR_MAX_STEER_FORCE,
         PREDATOR_MAX_TIMED, PREDATOR_MAX_TIMED_ATTACKING, PREDATOR_MOUVEMENTSIDE,
         PREDATOR_VELOCITY_LENGTH,  PREDATOR_VELOCITY_LENGTH_ATTACKING, SIGNIFICANCE_ATTACK} from "./aquariumParameters";
import { Fish } from "./fish";

interface ThingToMove {
    mesh: THREE.Mesh;
    translation: THREE.Vector3;
    rotation: THREE.Vector3;
    currentTranslation: THREE.Vector3;
    currentRotation: THREE.Vector3;
    isTranslationO1: {x: boolean, y: boolean, z: boolean};
    isRotationO1: {x: boolean, y: boolean, z: boolean};
}

export class PredatorFish extends Fish {

    private fishesToAttack: Fish[];
    private thingsToMove: ThingToMove[];
    private timedMoved: number;
    private movingSide: number;
    private maxTimeMoved: number;

    public constructor(width: number, height: number, depth: number) {
        super(width, height, depth);
        this.mouvementSide = PREDATOR_MOUVEMENTSIDE;
        this.velocityLength = PREDATOR_VELOCITY_LENGTH;
        this.fishesToAttack = [];
        this.timedMoved = 0;
        this.maxTimeMoved = this.getNewMaxTimedMoved();
        this.movingSide = 1;
    }

    private getNewMaxTimedMoved(): number {
        return this.velocityLength > PREDATOR_VELOCITY_LENGTH ? PREDATOR_MAX_TIMED_ATTACKING : PREDATOR_MAX_TIMED;
    }

    // tslint:disable-next-line:max-func-body-length
    public updateMouvementSide(): void {
        super.updateMouvementSide();
        // [-60, 0] -> LEFT | [0, 60] -> RIGHT
        const SIDE: number = this.timedMoved / this.maxTimeMoved;
        this.timedMoved += this.movingSide;
        if (this.movingSide !== 0) {
            this.thingsToMove.forEach((object: ThingToMove) => {
                object.mesh.translateX(-object.currentTranslation.x);
                object.mesh.translateY(-object.currentTranslation.y);
                object.mesh.translateZ(-object.currentTranslation.z);
                object.mesh.rotateX(-object.currentRotation.x);
                object.mesh.rotateY(-object.currentRotation.y);
                object.mesh.rotateZ(-object.currentRotation.z);
                const ROTATION: THREE.Vector3
                    = new THREE.Vector3(object.isRotationO1.x ? Math.abs(object.rotation.x * SIDE) : object.rotation.x * SIDE,
                                        object.isRotationO1.y ? Math.abs(object.rotation.y * SIDE) : object.rotation.y * SIDE,
                                        object.isRotationO1.z ? Math.abs(object.rotation.z * SIDE) : object.rotation.z * SIDE);
                const TRANSLAT: THREE.Vector3
                = new THREE.Vector3(object.isTranslationO1.x ? Math.abs(object.translation.x * SIDE) : object.translation.x * SIDE,
                                    object.isTranslationO1.y ? Math.abs(object.translation.y * SIDE) : object.translation.y * SIDE,
                                    object.isTranslationO1.z ? Math.abs(object.translation.z * SIDE) : object.translation.z * SIDE);
                object.mesh.rotateX(ROTATION.x);
                object.mesh.rotateY(ROTATION.y);
                object.mesh.rotateZ(ROTATION.z);
                object.mesh.translateX(TRANSLAT.x);
                object.mesh.translateY(TRANSLAT.y);
                object.mesh.translateZ(TRANSLAT.z);

                object.currentRotation.set(ROTATION.x, ROTATION.y, ROTATION.z);
                object.currentTranslation.set(TRANSLAT.x, TRANSLAT.y, TRANSLAT.z);
            });
        }
        if (Math.abs(this.timedMoved) >= this.maxTimeMoved) {
            this.movingSide *= -1;
        }
        if (this.timedMoved === 0) {
            this.maxTimeMoved = this.getNewMaxTimedMoved();
        }
    }

    public move(): void {
        if (this.fishesToAttack.length !== 0) {
            this.reach();
            if ( this.velocityLength < PREDATOR_VELOCITY_LENGTH_ATTACKING) {
                this.velocityLength += PREDATOR_ACCELERATION;
            }
        }
        this.updateMouvementSide();
        super.move();
    }

    public attack(fishes: Fish[]): void {
        if ( this.fishesToAttack.length === 0) {
            this.fishesToAttack = fishes;
            this.reach();
        }
    }

    private reach(): void {
        const positionToAttack: THREE.Vector3 = this.getAveragePosition(this.fishesToAttack);
        const steer: THREE.Vector3 = new THREE.Vector3();

        steer.subVectors( positionToAttack, this.position );
        steer.multiplyScalar(SIGNIFICANCE_ATTACK);
        if (this.velocity.dot(steer) < 0) {
            steer.projectOnVector(getPerpendicularVector(this.velocity, this.mouvementVector));
        }
        const STEER_LENGTH: number = steer.length();
        if ( STEER_LENGTH > PREDATOR_MAX_STEER_FORCE) {
            steer.set(
                steer.x / STEER_LENGTH * PREDATOR_MAX_STEER_FORCE,
                steer.y / STEER_LENGTH * PREDATOR_MAX_STEER_FORCE,
                steer.z / STEER_LENGTH * PREDATOR_MAX_STEER_FORCE,
            );
        }
        this.acceleration.add(steer);

        if (this.position.distanceTo(positionToAttack) < DISTANCE_TO_STOP_ATTACK) {
            this.fishesToAttack = [];
            this.velocityLength = PREDATOR_VELOCITY_LENGTH - PREDATOR_ACCELERATION;
        }
    }

    // tslint:disable:no-magic-numbers

    public getAveragePosition(fishes: Fish[]): THREE.Vector3 {
        const nFish: number = fishes.length;
        const average: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        switch (nFish) {
            case 0:
                average.copy(this.position); break;
            case 1:
                average.copy(fishes[0].position); break;
            case 2:
                average.add(fishes[0].position);
                average.add(fishes[1].position);
                average.divideScalar(2);
                break;
            default:
                average.add(fishes[0].position);
                average.add(fishes[1].position);
                average.add(fishes[2].position);
                average.divideScalar(3);
                break;
        }

        return average;
    }

    protected assemble(): void {
        this.thingsToMove = [];
        super.assemble();
        this.add(this.getDorsalFin());
    }

    protected getRandomColor(): number {
        return COLOR_PREDATOR[Math.floor(Math.random() * COLOR_PREDATOR.length)];
    }

    public isAttacking(): boolean {
        return this.fishesToAttack.length !== 0;
    }

    // tslint:disable:no-magic-numbers
    // tslint:disable-next-line:max-func-body-length
    protected getTail(): THREE.Mesh {
        const fragmentation: number = 15;
        const sphere: THREE.SphereGeometry = new THREE.SphereGeometry( 60, fragmentation, fragmentation );
        sphere.scale(0.6, 0.3, 0.1);
        sphere.rotateY(Math.PI / 2);
        sphere.rotateX(Math.PI / 4.5);
        sphere.translate(0, 15, 65);
        const sphere2: THREE.SphereGeometry = new THREE.SphereGeometry( 60, fragmentation, fragmentation );
        sphere2.scale(0.6, 0.3, 0.1);
        sphere2.rotateY(Math.PI / 2);
        sphere2.rotateX(Math.PI / -4.5);
        sphere2.translate(0, -15, 65);
        const sphere3: THREE.SphereGeometry = new THREE.SphereGeometry( 60, fragmentation, fragmentation );
        sphere3.scale(0.2, 0.5, 0.1);
        sphere3.rotateY(Math.PI / 2);
        sphere3.rotateX(Math.PI / 5.5);
        sphere3.translate(0, -10, 58);
        const sphere4: THREE.SphereGeometry = new THREE.SphereGeometry( 60, fragmentation, fragmentation );
        sphere4.scale(0.2, 0.5, 0.1);
        sphere4.rotateY(Math.PI / 2);
        sphere4.rotateX(Math.PI / -5.5);
        sphere4.translate(0, 10, 58);
        const sphere5: THREE.SphereGeometry = new THREE.SphereGeometry( 60, fragmentation, fragmentation );
        sphere5.scale(0.2, 0.2, 0.1);
        sphere5.rotateY(Math.PI / 2);
        sphere5.translate(0, 0, 60);

        THREE.GeometryUtils.merge(sphere, sphere2);
        THREE.GeometryUtils.merge(sphere, sphere3);
        THREE.GeometryUtils.merge(sphere, sphere4);
        THREE.GeometryUtils.merge(sphere, sphere5);
        const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( {color: this.drakenColor, wireframe: false} );
        sphere.translate(0, 0, -240);

        const mesh: THREE.Mesh = new THREE.Mesh(sphere, material);
        this.thingsToMove.push({
            mesh: mesh,
            rotation: new THREE.Vector3(0, Math.PI / -4.3, 0), currentRotation: new THREE.Vector3(0, 0, 0),
            translation: new THREE.Vector3(-75, 0, 35), currentTranslation: new THREE.Vector3(0, 0, 0),
            isRotationO1: {x: false, y: false, z: false}, isTranslationO1: {x: false, y: false, z: true}});

        return mesh;
    }

    protected get drakenColor(): number {
        // tslint:disable-next-line:no-bitwise
        return (this.color & 0xFEFEFE) >> 1;
    }

    // tslint:disable-next-line:max-func-body-length
    protected getBody(): THREE.Mesh | THREE.Group {
        const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( {color: this.color, wireframe: false} );
        const fragmentation: number = 15;
        const sphere: THREE.SphereGeometry = new THREE.SphereGeometry( 60, fragmentation, fragmentation );
        sphere.scale(1.4, 1, 0.8);
        sphere.translate(-20, 0, 0);
        sphere.rotateY(Math.PI / 2);
        const sphere2: THREE.SphereGeometry = new THREE.SphereGeometry( 60, fragmentation, fragmentation );
        sphere2.scale(1.2, 0.8, 0.6);
        sphere2.translate(35, 0, 0);
        sphere2.rotateY(Math.PI / 2);
        const sphere3: THREE.SphereGeometry = new THREE.SphereGeometry( 60, fragmentation, fragmentation );
        sphere3.scale(1.2, 0.6, 0.4);
        sphere3.translate(85, 0, 0);
        sphere3.rotateY(Math.PI / 2);
        const sphere4: THREE.SphereGeometry = new THREE.SphereGeometry( 60, fragmentation, fragmentation );
        sphere4.scale(1.1, 0.4, 0.2);
        sphere4.translate(115, 0, 0);
        sphere4.rotateY(Math.PI / 2);

        const group: THREE.Group = new THREE.Group();
        const mesh1: THREE.Mesh = new THREE.Mesh(sphere, material); group.add(mesh1);
        this.thingsToMove.push({
            mesh: mesh1,
            rotation: new THREE.Vector3(0, Math.PI / 20, 0), currentRotation: new THREE.Vector3(0, 0, 0),
            translation: new THREE.Vector3(0, 0, 0), currentTranslation: new THREE.Vector3(0, 0, 0),
            isRotationO1: {x: false, y: false, z: false}, isTranslationO1: {x: false, y: false, z: false}});
        const mesh2: THREE.Mesh = new THREE.Mesh(sphere2, material); group.add(mesh2);
        this.thingsToMove.push({
            mesh: mesh2,
            rotation: new THREE.Vector3(0, Math.PI / 10, 0), currentRotation: new THREE.Vector3(0, 0, 0),
            translation: new THREE.Vector3(-20 / 60, 0, 10), currentTranslation: new THREE.Vector3(0, 0, 0),
            isRotationO1: {x: false, y: false, z: false}, isTranslationO1: {x: false, y: false, z: true}});
        const mesh3: THREE.Mesh = new THREE.Mesh(sphere3, material); group.add(mesh3);
        this.thingsToMove.push({
            mesh: mesh3,
            rotation: new THREE.Vector3(0, Math.PI / -10, 0), currentRotation: new THREE.Vector3(0, 0, 0),
            translation: new THREE.Vector3(-35, 0, 30), currentTranslation: new THREE.Vector3(0, 0, 0),
            isRotationO1: {x: false, y: false, z: false}, isTranslationO1: {x: false, y: false, z: true}});
        const mesh4: THREE.Mesh = new THREE.Mesh(sphere4, material); group.add(mesh4);
        this.thingsToMove.push({
            mesh: mesh4,
            rotation: new THREE.Vector3(0, Math.PI / -4.3, 0), currentRotation: new THREE.Vector3(0, 0, 0),
            translation: new THREE.Vector3(-75, 0, 35), currentTranslation: new THREE.Vector3(0, 0, 0),
            isRotationO1: {x: false, y: false, z: false}, isTranslationO1: {x: false, y: false, z: true}});

        return group;
    }

    protected getDorsalFin(): THREE.Mesh {
        const heartShape: THREE.Shape = new THREE.Shape();
        const xoff: number = -79;
        const yoff: number = -261;
        // tslint:disable:binary-expression-operand-order Generated with : http://www.victoriakirst.com/beziertool/
        heartShape.moveTo(3 + xoff, 273 + yoff);
        heartShape.bezierCurveTo(-4 + xoff, 286 + yoff, 43 + xoff, 211 + yoff, 64 + xoff, 203 + yoff);
        heartShape.bezierCurveTo(87 + xoff, 194 + yoff, 144 + xoff, 190 + yoff, 157 + xoff, 197 + yoff);
        heartShape.bezierCurveTo(174 + xoff, 206 + yoff, 208 + xoff, 209 + yoff, 222 + xoff, 212 + yoff);
        heartShape.bezierCurveTo(233 + xoff, 214 + yoff, 225 + xoff, 219 + yoff, 261 + xoff, 224 + yoff);
        heartShape.bezierCurveTo(290 + xoff, 228 + yoff, 286 + xoff, 238 + yoff, 301 + xoff, 241 + yoff);
        heartShape.bezierCurveTo(310 + xoff, 243 + yoff, 312 + xoff, 240 + yoff, 339 + xoff, 255 + yoff);
        heartShape.bezierCurveTo(353 + xoff, 263 + yoff, 380 + xoff, 272 + yoff, 400 + xoff, 275 + yoff);
        heartShape.bezierCurveTo(419 + xoff, 278 + yoff, 437 + xoff, 300 + yoff, 451 + xoff, 304 + yoff);
        heartShape.bezierCurveTo(477 + xoff, 311 + yoff, 518 + xoff, 353 + yoff, 503 + xoff, 355 + yoff);
        heartShape.bezierCurveTo(475 + xoff, 358 + yoff, 444 + xoff, 393 + yoff, 432 + xoff, 406 + yoff);
        heartShape.bezierCurveTo(422 + xoff, 417 + yoff, 46 + xoff, 365 + yoff, 2 + xoff, 279 + yoff);
        // tslint:disable-next-line:no-any
        const options: any = {amount: 3, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.001, bevelThickness: 0.001 };
        const geometry: THREE.ExtrudeGeometry = new THREE.ExtrudeGeometry( heartShape, options );
        geometry.rotateZ(Math.PI);
        geometry.rotateY(Math.PI / -2);
        geometry.scale(0.2, 0.2, 0.2);
        geometry.translate(0, 60, 0);

        const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: this.drakenColor,
                                                                               wireframe: false,
                                                                               side: THREE.DoubleSide});

        return new THREE.Mesh(geometry, material);
    }
}
