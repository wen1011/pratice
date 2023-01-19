import { Group, MathUtils } from "three";

import { createMeshes } from "./meshes.js";

const moveSpeed = MathUtils.degToRad(0);

class Cube2 extends Group {
	constructor() {
		super();
		this.meshes = createMeshes();

		this.add(this.meshes.cube2);
	}

	tick(delta) {
		// this.meshes.cube.rotation.x -= moveSpeed * delta
		this.meshes.cube2.rotation.y += moveSpeed * delta;
		this.meshes.cube2.rotation.x -= moveSpeed * delta;
		this.meshes.cube2.rotation.z -= moveSpeed * delta;
	}
}
export { Cube2 };
