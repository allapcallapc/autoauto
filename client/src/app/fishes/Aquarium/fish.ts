import * as THREE from "three";
import { addTwoVector, getPerpendicularVector } from "../vectorsOperation";
import { CHANCE_OF_COHESION, COLOR_FISH, DISTANCE_AVOID_PREDATOR_ATTACKING, DISTANCE_AVOID_PREDATOR_NORMAL,
         MAX_INITAL_VELOCITY, MAX_STEER_FORCE, MAX_VELOCITY_Y, MOUVEMENTSIDE_NORMAL,
         NEIGHBORHOOD_RADIUS, TIME_TO_REACH_SAFE_ZONE_AFTER_ATTACK, VELOCITY_AVOIDING, VELOCITY_NORMAL } from "./aquariumParameters";
import { PredatorFish } from "./predatorFish";

export class Fish extends THREE.Group {

    protected color: number;
    private width: number;
    private height: number;
    private depth: number;
    protected velocity: THREE.Vector3;
    protected velocityLength: number;
    protected mouvementSide: { factor: number, timeDone: number, maxTimeDone: number };
    protected acceleration: THREE.Vector3;
    // tslint:disable-next-line:no-any
    private timeOutForVelocityNormal: any;
    private isCohesionOn: boolean;

    public constructor(width: number, height: number, depth: number) {
        super();
        this.assemble();
        this.width = width / 2;
        this.height = height / 2;
        this.depth = depth / 2;
        this.setRandomPosition();
        this.velocity = new THREE.Vector3(this.getRandomBoundedPosition(1, MAX_INITAL_VELOCITY),
                                          this.getRandomBoundedPosition(1, MAX_INITAL_VELOCITY),
                                          this.getRandomBoundedPosition(1, MAX_INITAL_VELOCITY));
        this.mouvementSide = MOUVEMENTSIDE_NORMAL;
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.changeSpeed(VELOCITY_NORMAL);
        this.isCohesionOn = true;
    }

    protected assemble(): void {
        this.color = this.getRandomColor();
        this.add(this.getBody());
        this.add(this.getTail());
    }

    public avoid(pointToAvoid: THREE.Vector3): void {
        if (this.position.distanceTo(pointToAvoid) < 100) {
            this.acceleration.copy(this.position);
            this.acceleration.sub(pointToAvoid);
            this.acceleration.multiplyScalar( 2 / this.position.distanceToSquared(pointToAvoid) * this.velocity.length());
        }
    }

    public avoidPredator(predator: PredatorFish): void {
        const DISTANCE_FOR_AVOID: number = predator.isAttacking() ? DISTANCE_AVOID_PREDATOR_ATTACKING : DISTANCE_AVOID_PREDATOR_NORMAL;
        if (this.position.distanceTo(predator.position) < DISTANCE_FOR_AVOID) {
            const steer: THREE.Vector3 = new THREE.Vector3();
            steer.copy(this.position);
            steer.sub(predator.position);
            steer.multiplyScalar( predator.velocityLength * predator.velocityLength);
            steer.divideScalar(this.position.distanceToSquared(predator.position) * 1.125);
            if (predator.isAttacking()) {
                this.isCohesionOn = false;
                this.changeSpeed(VELOCITY_AVOIDING);
                clearTimeout(this.timeOutForVelocityNormal);
                this.timeOutForVelocityNormal = setTimeout(() => {
                    this.changeSpeed(VELOCITY_NORMAL);
                    this.isCohesionOn = true;
                },                                         TIME_TO_REACH_SAFE_ZONE_AFTER_ATTACK);
            }
            this.acceleration.add(steer);
        }
    }

    public changeSpeed(newSpeed: number): void {
        this.velocityLength = newSpeed;
    }

    public move(): void {
        this.updateMouvementSide();
        this.updateVelocity();
        this.position.add(this.velocity);
        // Checks bound
        if (Math.abs(this.position.x) >= this.width) {
            this.position.x = Math.sign(this.position.x) * (this.width - 1);
            this.velocity.x *= -1;
        }
        if (Math.abs(this.position.y) >= this.height) {
            this.position.y = Math.sign(this.position.y) * (this.height - 1);
            this.velocity.y *= -1;
        }
        if (Math.abs(this.position.z) >= this.depth) {
            this.position.z = Math.sign(this.position.z) * (this.depth - 1);
            this.velocity.z *= -1;
        }
    }

    public updateVelocity(): void {
        this.velocity.add(this.acceleration);
        this.velocity.normalize();
        if (this.velocity.y > MAX_VELOCITY_Y) {
            this.velocity.y = MAX_VELOCITY_Y;
        }
        this.velocity.multiplyScalar(this.velocityLength);
        this.acceleration.set(0, 0, 0);
    }

    public updateMouvementSide(): void {
        this.lookAt(addTwoVector(this.position, this.velocity));
        this.acceleration.add(this.mouvementVector);
        this.mouvementSide.timeDone++;
        if ( this.mouvementSide.timeDone >= this.mouvementSide.maxTimeDone ) {
            this.mouvementSide.timeDone = 0;
            this.mouvementSide.factor *= -1;
        }
    }

    public get mouvementVector(): THREE.Vector3 {
        let vectorTest: THREE.Vector3 = (new THREE.Vector3(0, 1, 0)).transformDirection(this.matrixWorld);
        vectorTest = getPerpendicularVector(this.velocity, vectorTest);
        vectorTest.normalize();

        return vectorTest.multiplyScalar(this.mouvementSide.factor);
    }

    public school(fishes: Fish[]): void {
        if (this.isCohesionOn) {
            this.acceleration.add(this.alignment(fishes));
            this.acceleration.add(this.cohesion(fishes));
            this.acceleration.add(this.separation(fishes));
        }
    }

    private alignment(fishes: Fish[]): THREE.Vector3 {
        const velSum: THREE.Vector3 = new THREE.Vector3();
        let count: number = 0;
        // tslint:disable-next-line:prefer-for-of
        fishes.forEach((fish: Fish) => {
            if ( Math.random() < CHANCE_OF_COHESION ) {
                const distance: number = fish.position.distanceTo( this.position );
                if ( distance > 0 && distance <= NEIGHBORHOOD_RADIUS ) {
                    velSum.add( fish.velocity );
                    count++;
                }
            }
        });

        if ( count > 0 ) {
            velSum.divideScalar( count );
            const l: number = velSum.length();
            if ( l > MAX_STEER_FORCE ) {
                velSum.divideScalar( l / MAX_STEER_FORCE );
            }
        }

        return velSum;
    }

    private cohesion(fishes: Fish[]): THREE.Vector3 {
        const posSum: THREE.Vector3 = new THREE.Vector3();
        let count: number = 0;
        fishes.forEach((fish: Fish) => {
            if ( Math.random() < CHANCE_OF_COHESION ) {
                const distance: number = fish.position.distanceTo( this.position );
                if ( distance > 0 && distance <= NEIGHBORHOOD_RADIUS ) {
                    posSum.add( fish.position );
                    count++;
                }
            }
        });

        if ( count > 0 ) {
            posSum.divideScalar( count );
        }
        const steer: THREE.Vector3 = new THREE.Vector3();
        steer.subVectors( posSum, this.position );
        const l: number = steer.length();
        if ( l > MAX_STEER_FORCE ) {
            steer.divideScalar( l / MAX_STEER_FORCE );
        }

        return steer;
    }

    private separation(fishes: Fish[]): THREE.Vector3 {
        const posSum: THREE.Vector3 = new THREE.Vector3();

        fishes.forEach((fish: Fish) => {
            if ( Math.random() < CHANCE_OF_COHESION ) {
                const distance: number = fish.position.distanceTo( this.position );
                if ( distance > 0 && distance <= NEIGHBORHOOD_RADIUS ) {
                    const repulse: THREE.Vector3 = new THREE.Vector3();
                    repulse.subVectors( this.position, fish.position );
                    repulse.normalize();
                    repulse.divideScalar( distance );
                    posSum.add( repulse );
                }
            }
        });

        return posSum;
    }

    // tslint:disable:no-magic-numbers

    public changeWidth(width: number, height: number, depth: number): void {
        this.position.x = this.position.x / this.width * width / 2;
        this.position.y = this.position.y / this.height * height / 2;
        this.position.z = this.position.z / this.depth * depth / 2;
        this.width = width / 2;
        this.height = height / 2;
        this.depth = depth / 2;
    }

    private setRandomPosition(): void {
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;
    }

    public getRandomBoundedPosition(min: number, max: number): number {
        const zeroToMax: number = Math.floor(Math.random() * (max - min + 1) + min);

        return Math.random() < 0.5 ? zeroToMax : zeroToMax * -1;
    }

    protected getRandomColor(): number {
        return COLOR_FISH[Math.floor(Math.random() * COLOR_FISH.length)];
    }

    protected getBody(): THREE.Mesh | THREE.Group {
        const sphere: THREE.SphereGeometry = new THREE.SphereGeometry( 60, 32, 32 );
        sphere.scale(3, 1, 0.5);
        const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( {color: this.color} );
        sphere.rotateY(Math.PI / 2);

        return new THREE.Mesh( sphere, material );
    }

    // tslint:disable-next-line:max-func-body-length
    protected getTail(): THREE.Mesh {
        const geom: THREE.Geometry = new THREE.Geometry();

        // Side one
        const DIFF_FRONT_BACK: number = -12.5;
        geom.vertices.push( new THREE.Vector3(0, 0, DIFF_FRONT_BACK));
        geom.vertices.push( new THREE.Vector3(100, 10, 0));
        geom.vertices.push( new THREE.Vector3(5, 30, DIFF_FRONT_BACK));
        geom.vertices.push( new THREE.Vector3(20, -40, DIFF_FRONT_BACK));
        geom.vertices.push( new THREE.Vector3(100, -70, 0));
        geom.vertices.push( new THREE.Vector3(0, -80, DIFF_FRONT_BACK));
        geom.vertices.push( new THREE.Vector3(5, -110, DIFF_FRONT_BACK));

        geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
        geom.faces.push( new THREE.Face3( 0, 3, 1 ) );
        geom.faces.push( new THREE.Face3( 3, 4, 1 ) );
        geom.faces.push( new THREE.Face3( 3, 5, 4 ) );
        geom.faces.push( new THREE.Face3( 5, 6, 4 ) );

        // Side two
        const WIDTH: number = -25;
        geom.vertices.push( new THREE.Vector3(0, 0, WIDTH - DIFF_FRONT_BACK));
        geom.vertices.push( new THREE.Vector3(100, 0, WIDTH));
        geom.vertices.push( new THREE.Vector3(5, 30, WIDTH - DIFF_FRONT_BACK));
        geom.vertices.push( new THREE.Vector3(20, -40, WIDTH - DIFF_FRONT_BACK));
        geom.vertices.push( new THREE.Vector3(100, -70, WIDTH));
        geom.vertices.push( new THREE.Vector3(0, -80, WIDTH - DIFF_FRONT_BACK));
        geom.vertices.push( new THREE.Vector3(5, -110, WIDTH - DIFF_FRONT_BACK));

        geom.faces.push( new THREE.Face3( 7, 9, 8 ) );
        geom.faces.push( new THREE.Face3( 7, 8, 10 ) );
        geom.faces.push( new THREE.Face3( 10, 8, 11 ) );
        geom.faces.push( new THREE.Face3( 10, 11, 12 ) );
        geom.faces.push( new THREE.Face3( 12, 11, 13 ) );

        // Front - top
        geom.faces.push( new THREE.Face3( 6, 4, 13 ) );
        geom.faces.push( new THREE.Face3( 13, 11, 4 ) );
        geom.faces.push( new THREE.Face3( 2, 1, 9 ) );
        geom.faces.push( new THREE.Face3( 1, 8, 9 ) );

        // Back
        geom.faces.push( new THREE.Face3( 0, 2, 9 ) );
        geom.faces.push( new THREE.Face3( 7, 9, 0 ) );
        geom.faces.push( new THREE.Face3( 0, 3, 7 ) );
        geom.faces.push( new THREE.Face3( 7, 10, 3 ) );
        geom.faces.push( new THREE.Face3( 5, 3, 10 ) );
        geom.faces.push( new THREE.Face3( 10, 12, 5 ) );
        geom.faces.push( new THREE.Face3( 5, 6, 12 ) );
        geom.faces.push( new THREE.Face3( 12, 13, 6 ) );

        geom.computeFaceNormals();

        geom.translate(-230, 35, 11);
        geom.scale(1, 0.8, 1);
        geom.rotateY(- Math.PI / 2);

        return new THREE.Mesh( geom, new THREE.MeshPhongMaterial( {color: this.color, side: THREE.DoubleSide } ) );
    }

    /* Fish tail points for a side

      (2)

    (0)           (1)

        (3)

    (5)           (4)

      (6)
    */
}
