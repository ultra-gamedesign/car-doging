import * as THREE from 'three';
import GUI from 'lil-gui';


export default class DirectionalLightControl {
    private scene: any;
    private lightParams: { shadowLeft: number; color: number; shadowHeight: number; positionX: number; shadowNear: number; intensity: number; positionY: number; positionZ: number; shadowRight: number; shadowWidth: number; shadowBottom: number; shadowTop: number; shadowFar: number };
    private dirLight: any;
    private guiFolder: any;
    private gui: GUI;

    constructor(scene, gui) {
        this.scene = scene;
        this.gui = gui;

        // Default Light Properties
        this.lightParams = {
            color: 0xF0997D,
            intensity: 4,
            positionX: -60,
            positionY: 100,
            positionZ: -10,
            shadowTop: 50,
            shadowBottom: -50,
            shadowLeft: -50,
            shadowRight: 50,
            shadowNear: 0.1,
            shadowFar: 200,
            shadowWidth: 4096,
            shadowHeight: 4096
        };

        // Create the light source
        this.createLight();

        // Setup GUI controls
        this.setupGUI();
    }

    createLight() {
        this.dirLight = new THREE.DirectionalLight(this.lightParams.color, this.lightParams.intensity);
        this.dirLight.position.set(this.lightParams.positionX, this.lightParams.positionY, this.lightParams.positionZ);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.camera.top = this.lightParams.shadowTop;
        this.dirLight.shadow.camera.bottom = this.lightParams.shadowBottom;
        this.dirLight.shadow.camera.left = this.lightParams.shadowLeft;
        this.dirLight.shadow.camera.right = this.lightParams.shadowRight;
        this.dirLight.shadow.camera.near = this.lightParams.shadowNear;
        this.dirLight.shadow.camera.far = this.lightParams.shadowFar;
        this.dirLight.shadow.mapSize.width = this.lightParams.shadowWidth;
        this.dirLight.shadow.mapSize.height = this.lightParams.shadowHeight;

        this.scene.add(this.dirLight);
    }

    setupGUI() {
        this.guiFolder = this.gui.addFolder('Directional Light');
        // Add controls for all light properties
        this.guiFolder.addColor(this.lightParams, 'color').onChange(this.updateLight.bind(this));
        this.guiFolder.add(this.lightParams, 'intensity', 0, 20).onChange(this.updateLight.bind(this));
        this.guiFolder.add(this.lightParams, 'positionX', -100, 100).onChange(this.updateLight.bind(this));
        this.guiFolder.add(this.lightParams, 'positionY', -100, 200).onChange(this.updateLight.bind(this));
        this.guiFolder.add(this.lightParams, 'positionZ', -100, 100).onChange(this.updateLight.bind(this));
        this.guiFolder.add(this.lightParams, 'shadowTop', -100, 100).onChange(this.updateShadow.bind(this));
        this.guiFolder.add(this.lightParams, 'shadowBottom', -100, 100).onChange(this.updateShadow.bind(this));
        this.guiFolder.add(this.lightParams, 'shadowLeft', -100, 100).onChange(this.updateShadow.bind(this));
        this.guiFolder.add(this.lightParams, 'shadowRight', -100, 100).onChange(this.updateShadow.bind(this));
        this.guiFolder.add(this.lightParams, 'shadowNear', 0, 10).onChange(this.updateShadow.bind(this));
        this.guiFolder.add(this.lightParams, 'shadowFar', 10, 300).onChange(this.updateShadow.bind(this));
        this.guiFolder.add(this.lightParams, 'shadowWidth', 1024, 8192).onChange(this.updateShadow.bind(this));
        this.guiFolder.add(this.lightParams, 'shadowHeight', 1024, 8192).onChange(this.updateShadow.bind(this));

        this.guiFolder.open();
    }

    updateLight() {
        // Update Light Properties
        this.dirLight.color.set(this.lightParams.color);
        this.dirLight.intensity = this.lightParams.intensity;
        this.dirLight.position.set(this.lightParams.positionX, this.lightParams.positionY, this.lightParams.positionZ);
    }

    updateShadow() {
        // Update Shadow Properties
        const shadowCam = this.dirLight.shadow.camera;
        shadowCam.top = this.lightParams.shadowTop;
        shadowCam.bottom = this.lightParams.shadowBottom;
        shadowCam.left = this.lightParams.shadowLeft;
        shadowCam.right = this.lightParams.shadowRight;
        shadowCam.near = this.lightParams.shadowNear;
        shadowCam.far = this.lightParams.shadowFar;
        this.dirLight.shadow.mapSize.width = this.lightParams.shadowWidth;
        this.dirLight.shadow.mapSize.height = this.lightParams.shadowHeight;
    }
}
