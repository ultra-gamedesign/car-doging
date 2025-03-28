import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import GUI from 'lil-gui';

export default class Floor {
    private scene: THREE.Scene;
    private world: CANNON.World;
    private gui: GUI;
    private floorParams: {
        color: number;
        width: number;
        height: number;
        material: string;
    };
    private floorMesh: THREE.Mesh;
    private floorBody: CANNON.Body;
    private guiFolder: any;

    constructor(scene: THREE.Scene, world: CANNON.World, gui: GUI) {
        this.scene = scene;
        this.world = world;
        this.gui = gui;

        // Default Floor Properties
        this.floorParams = {
            color: 0x454545,
            width: 50,
            height: 50,
            material: 'Standard', // 'Standard' or 'Phongs' material
        };

        // Create the floor (both visual and physical)
        this.createFloor();

        // Setup GUI controls for floor properties
        this.setupGUI();
    }

    createFloor() {
        // Create the Three.js floor mesh
        const floorGeo = new THREE.CircleGeometry(this.floorParams.width, this.floorParams.height);
        const floorMaterial = this.floorParams.material === 'Standard'
            ? new THREE.MeshStandardMaterial({ color: this.floorParams.color })
            : new THREE.MeshPhongMaterial({ color: this.floorParams.color });

        this.floorMesh = new THREE.Mesh(floorGeo, floorMaterial);
        this.floorMesh.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
        this.scene.add(this.floorMesh);

        // Create the Cannon.js body for the floor (static body)
        const floorShape = new CANNON.Plane();
        this.floorBody = new CANNON.Body({
            mass: 0, // Static body
        });
        this.floorBody.addShape(floorShape);
        this.world.addBody(this.floorBody);
        this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); // Rotate to match Three.js plane
    }

    setupGUI() {
        // Floor Debug Folder
        this.guiFolder = this.gui.addFolder('Floor');

        this.guiFolder.addColor(this.floorParams, 'color').onChange(this.updateFloor.bind(this));
        this.guiFolder.add(this.floorParams, 'width', 10, 200).onChange(this.updateFloor.bind(this));
        this.guiFolder.add(this.floorParams, 'height', 10, 200).onChange(this.updateFloor.bind(this));
        this.guiFolder.add(this.floorParams, 'material', ['Standard', 'Phong']).onChange(this.updateFloor.bind(this));

        this.guiFolder.open();
    }

    updateFloor() {
        // Update Floor Mesh (Three.js)
        this.floorMesh.geometry.dispose(); // Dispose old geometry
        this.floorMesh.geometry = new THREE.PlaneGeometry(this.floorParams.width, this.floorParams.height);

        // Update material
        const newMaterial = this.floorParams.material === 'Standard'
            ? new THREE.MeshStandardMaterial({ color: this.floorParams.color })
            : new THREE.MeshPhongMaterial({ color: this.floorParams.color });
        this.floorMesh.material = newMaterial;

        // Update Floor Physics (Cannon.js)
        this.floorBody.shapes[0].radius = this.floorParams.width; // Update shape (simplified)
    }
}
