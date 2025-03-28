// Floor.ts
import * as THREE from "three";

export class Floor {
    mesh: THREE.Mesh;

    constructor() {
        // Create a large plane geometry for the floor
        const geometry = new THREE.PlaneGeometry(100, 100);

        // Use MeshStandardMaterial for better lighting and shadows
        const material = new THREE.MeshStandardMaterial({
            color: 0x808080, // Light grey color
            roughness: 1,
        });

        this.mesh = new THREE.Mesh(geometry, material);

        // Rotate the plane to lay flat on the x-z plane
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = -1; // Slightly lower than the car to avoid clipping

        this.mesh.receiveShadow = true; // Make the floor receive shadows
    }
}
