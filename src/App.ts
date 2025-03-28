import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import GUI from "lil-gui";

import {CarObject} from "./objects/CarObject";
import {UserInput} from "./classes/UserInput";
import {Floor} from "./objects/Floor";

export class App {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private stats!: Stats;
  private gui!: GUI;

  private userInput!: UserInput; // Instance of UserInput
  private car: CarObject;
  private floor: Floor;

  async init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202020);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // === OrbitControls ===
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // === Lights ===
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(5, 5, 5);
    this.scene.add(ambient, directional);

    // === Objects ===
    this.car = new CarObject();
    await this.car.load();
    this.scene.add(this.car.mesh);

    // === Floor ===
    this.floor = new Floor(); // Create the floor
    this.scene.add(this.floor.mesh);
    
    // === UserInput ===
    this.userInput = new UserInput(); // Initialize the UserInput class

    // === Stats ===
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps
    document.body.appendChild(this.stats.dom);

    // === GUI ===
    this.gui = new GUI();
    const carfolder = this.gui.addFolder("Cube");
    carfolder.add(this.car.mesh.position, "x", -5, 5).name("Position X");
    carfolder
      .add(this.car.mesh.rotation, "y", 0, Math.PI * 2)
      .name("Rotation Y");

    carfolder.open();

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.stats?.begin();

    // Let UserInput handle car movement and rotation
    this.userInput?.handleCarMovement(this.car);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.stats?.end();
  };

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
