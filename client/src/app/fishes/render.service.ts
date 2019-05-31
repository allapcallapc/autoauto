import { Injectable } from "@angular/core";
import * as THREE from "three";
import { OrbitControls } from "three-orbitcontrols-ts";
import { AquariumLife } from "./Aquarium/aquariumLife";

const BACKGROUND_COLOR: number = 0x2D2C31;
const AXIS_LENGTH: number = 30;
const MIN_SCENE_WIDTH: number = 700;
const FACTOR_H_W_SCENE: number =  0.75;

@Injectable()
export class RenderService {

  private container: HTMLDivElement;
  private idAnimationFrame: number;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private farClippingPane: number = 1500;
  // tslint:disable-next-line:no-magic-numbers
  private cameraZ: number = this.farClippingPane / 2;
  private fieldOfView: number = 70;
  private nearClippingPane: number = 1;

  private aquariumWall: THREE.Object3D;
  public aquariumLife: AquariumLife;

  public constructor() {
    this.aquariumLife = new AquariumLife();
    this.idAnimationFrame = 0;
  }

  private animateCube(): void {
    this.aquariumLife.animate();
  }

  private createAquarium(): void {
    if ( this.aquariumWall !== undefined) {
      this.scene.remove(this.aquariumWall);
    }
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.sizeOfAquarium.x, this.sizeOfAquarium.y, this.sizeOfAquarium.z);
    const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( {color: BACKGROUND_COLOR, wireframe: true} );
    this.aquariumWall = new THREE.Mesh(geometry, material);
    this.scene.add(this.aquariumWall);
  }

  private createScene(): void {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( BACKGROUND_COLOR );
    this.scene.add(new THREE.AmbientLight("white"));
    this.scene.add(new THREE.AxesHelper(AXIS_LENGTH));

    /* Camera */
    const aspectRatio: number = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane,
    );
    this.camera.position.z = this.cameraZ;

    let controls: OrbitControls = new OrbitControls( this.camera );
    controls = controls;
  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }

  private startRenderingLoop(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(this.renderer.domElement);
    this.render();
  }

  private render(): void {
    this.idAnimationFrame = requestAnimationFrame(() => this.render());
    this.animateCube();

    this.renderer.render(this.scene, this.camera);
  }

  private initStats(): void {
    // this.stats = new Stats();
    // this.stats.dom.style.position = 'absolute';

    // this.container.appendChild(this.stats.dom);
  }

  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.aquariumLife.resize(this.sizeOfAquarium);
    this.createAquarium();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public get sizeOfAquarium(): THREE.Vector3 {
    const WIDTH: number = Math.max(MIN_SCENE_WIDTH, this.container.clientWidth * FACTOR_H_W_SCENE);

    return new THREE.Vector3(WIDTH, this.container.clientHeight * FACTOR_H_W_SCENE, this.farClippingPane);
  }

  public initialize(container: HTMLDivElement): Promise<void> {
    return new Promise((resolve) => {
      this.container = container;

      if ( this.idAnimationFrame === 0) {
        this.createScene();
        this.createAquarium();
        this.aquariumLife.fill(this.scene, this.sizeOfAquarium);
      }
      this.initStats();
      this.startRenderingLoop();
      resolve();
    });
  }

  public stop(): void {
    cancelAnimationFrame(this.idAnimationFrame);
  }
}
