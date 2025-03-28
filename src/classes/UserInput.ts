// UserInput.ts
import { CarObject } from "../objects/CarObject"; // Import CarObject type

export class UserInput {
    private keysPressed: Set<string> = new Set();
    private carSpeed: number = 0.1; // Speed of the car movement
    private carRotationSpeed: number = 0.05; // Speed of the car rotation

    constructor() {
        window.addEventListener("keydown", (event) => this.onKeyDown(event));
        window.addEventListener("keyup", (event) => this.onKeyUp(event));
    }

    // Track which keys are pressed
    private onKeyDown(event: KeyboardEvent) {
        this.keysPressed.add(event.key);
    }

    // Remove keys when they're released
    private onKeyUp(event: KeyboardEvent) {
        this.keysPressed.delete(event.key);
    }

    // Movement and rotation logic directly handled here
    handleCarMovement(car: CarObject) {
        if (this.isMovingForward()) {
            car.mesh.position.z -= this.carSpeed; // Move car forward
        }
        if (this.isMovingBackward()) {
            car.mesh.position.z += this.carSpeed; // Move car backward
        }
        if (this.isRotatingLeft()) {
            car.mesh.rotation.y += this.carRotationSpeed; // Rotate car left
        }
        if (this.isRotatingRight()) {
            car.mesh.rotation.y -= this.carRotationSpeed; // Rotate car right
        }
    }

    // Check if the up arrow key is pressed
    isMovingForward() {
        return this.keysPressed.has("ArrowUp");
    }

    // Check if the down arrow key is pressed
    isMovingBackward() {
        return this.keysPressed.has("ArrowDown");
    }

    // Check if the left arrow key is pressed
    isRotatingLeft() {
        return this.keysPressed.has("ArrowLeft");
    }

    // Check if the right arrow key is pressed
    isRotatingRight() {
        return this.keysPressed.has("ArrowRight");
    }
}
