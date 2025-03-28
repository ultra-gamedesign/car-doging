import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'
import Stats from 'stats.js'
import Car from "./objects/Car";
import DirectionalLightControl from "./classes/DirectionalLightControl";
import GUI from "lil-gui";
import Floor from "./classes/Floor";


export class App {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private stats: Stats;
  private world: CANNON.World;
  private car: Car;
  private gui: GUI;
  private cameraOffset: THREE.Vector3;


  constructor() {
    this.scene = new THREE.Scene();

    this.gui = new GUI();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.stats = new Stats();
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    });
    this.car = new Car(this.scene, this.world);
    this.cameraOffset = new THREE.Vector3(0, 3, -10); // Camera offset behind the car

  }

  private setup() {
    // Initialize stats
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
    document.body.appendChild(this.stats.dom);

    // Set scene background color
    this.scene.background = new THREE.Color(0xFF6000);

    // Add a light source
    new DirectionalLightControl(this.scene, this.gui);
    new Floor(this.scene, this.world, this.gui);

    // Initialize car
    this.car.init();

    // Resize event listener
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Camera setup
    this.camera.position.set(0, 4, 6);
    this.scene.add(this.camera);
    this.controls.enableDamping = true;

    this.setupDebugGUI();

    // Start the animation loop
    this.tick();
  }

  private onWindowResize() {
    const sizes = { width: window.innerWidth, height: window.innerHeight };
    this.camera.aspect = sizes.width / sizes.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private updateCameraPosition() {
    const carPosition = new THREE.Vector3();
    const carRotation = new THREE.Euler();

    if (this.car.chassis.position) {
      // Get the car's position and rotation
      carPosition.copy(this.car.chassis.position);
      carRotation.copy(this.car.chassis.rotation);

      // Apply the rotation to the camera offset to make it follow the car
      const offset = this.cameraOffset.clone().applyEuler(carRotation);
      this.camera.position.copy(carPosition).add(offset);

      // Ensure the camera is looking at the car
      this.camera.lookAt(carPosition);
    }
  }

  private setupDebugGUI() {
    // Camera Offset Debug Folder
    const cameraFolder = this.gui.addFolder('Camera Offset');
    cameraFolder.add(this.cameraOffset, 'x', -10, 10).name('Offset X').onChange(this.updateCameraPosition.bind(this));
    cameraFolder.add(this.cameraOffset, 'y', 0, 10).name('Offset Y').onChange(this.updateCameraPosition.bind(this));
    cameraFolder.add(this.cameraOffset, 'z', -30, -1).name('Offset Z').onChange(this.updateCameraPosition.bind(this));
    cameraFolder.open(); // Open the folder by default
  }

  private tick() {
    const timeStep = 1 / 60; // seconds
    let lastCallTime: number = 0;
    const animate = () => {
      this.stats.begin();
      const time = performance.now() / 1000; // seconds

      if (!lastCallTime) {
        this.world.step(timeStep);
      } else {
        const dt = time - lastCallTime;
        this.world.step(timeStep, dt);
      }
      lastCallTime = time;

      // Update camera position to follow the car
      this.updateCameraPosition();

      // Render the scene
      this.renderer.render(this.scene, this.camera);
      this.stats.end();

      // Call tick again on the next frame
      window.requestAnimationFrame(animate);
    };

    animate();
  }

  public start() {
    this.setup();
  }
}


