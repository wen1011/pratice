import { Group, MathUtils } from "three";

import { createMeshes } from "./meshes.js";

const moveSpeed = MathUtils.degToRad(0.1);

class Cube extends Group {
	constructor() {
		super();
		this.meshes = createMeshes();

		this.add(this.meshes.cube);
	}

	tick(delta) {
		// this.meshes.cube.rotation.x -= moveSpeed * delta
		this.meshes.cube.rotation.y += moveSpeed * delta;
		this.meshes.cube.rotation.x -= moveSpeed * delta;
		this.meshes.cube.rotation.z -= moveSpeed * delta;
	}
}
export { Cube };
