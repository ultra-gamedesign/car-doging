import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import GUI from "lil-gui";

import { Cube } from "./objects/Cube";
import { Sphere } from "./objects/Sphere";
import { Torus } from "./objects/Torus";

export class App {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private stats!: Stats;
  private gui!: GUI;

  private cube!: Cube;
  private sphere!: Sphere;
  private torus!: Torus;

  init() {
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
    this.cube = new Cube();
    this.scene.add(this.cube.mesh);

    this.sphere = new Sphere();
    this.scene.add(this.sphere.mesh);

    this.torus = new Torus();
    this.scene.add(this.torus.mesh);

    // === Stats ===
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps
    document.body.appendChild(this.stats.dom);

    // === GUI ===
    this.gui = new GUI();
    const cubeFolder = this.gui.addFolder("Cube");
    cubeFolder.add(this.cube.mesh.position, "x", -5, 5).name("Position X");
    cubeFolder
      .add(this.cube.mesh.rotation, "y", 0, Math.PI * 2)
      .name("Rotation Y");
    cubeFolder
      .addColor({ color: "#ff0000" }, "color")
      .name("Color")
      .onChange((value: string) => {
        (this.cube.mesh.material as THREE.MeshStandardMaterial).color.set(
          value
        );
      });
    cubeFolder.open();

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
