import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import GUI from "lil-gui";

import { Cube } from "./objects/Cube";
import { Sphere } from "./objects/Sphere";
import { Torus } from "./objects/Torus";
import {CarObject} from "./objects/CarObject";

export class App {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private stats!: Stats;
  private gui!: GUI;

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
    const car = new CarObject();
    await car.load();
    this.scene.add(car.mesh);

    // === Stats ===
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps
    document.body.appendChild(this.stats.dom);

    // === GUI ===
    this.gui = new GUI();
    const carfolder = this.gui.addFolder("Cube");
    carfolder.add(car.mesh.position, "x", -5, 5).name("Position X");
    carfolder
      .add(car.mesh.rotation, "y", 0, Math.PI * 2)
      .name("Rotation Y");

    carfolder.open();

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.stats.begin();

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.stats.end();
  };

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
