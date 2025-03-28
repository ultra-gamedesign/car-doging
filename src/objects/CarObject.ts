import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export class CarObject{
    mesh: THREE.Mesh;

    public async load(): Promise<void> {
        const loader = new GLTFLoader();

        try {
            const gltf = await loader.loadAsync("./src/assets/car.glb"); // Adjust the path
            this.mesh = gltf.scene;
            this.mesh.scale.set(1, 1, 1); // Adjust the scale if needed
            console.log("Car model loaded successfully!");
        } catch (error) {
            console.error("Error loading the car model:", error);
        }
    }
}