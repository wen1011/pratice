import { Group, MathUtils } from "three";

import { createMeshes } from "./meshes.js";

const moveSpeed = MathUtils.degToRad(0.1);

class Plane extends Group {
	constructor() {
		super();
		this.meshes = createMeshes();

		this.add(this.meshes.plane);
	}

	tick(delta) {
		// this.meshes.cube.rotation.x -= moveSpeed * delta
		this.meshes.plane.rotation.y += moveSpeed * delta;
		this.meshes.plane.rotation.x -= moveSpeed * delta;
		this.meshes.plane.rotation.z -= moveSpeed * delta;
	}
}
export { Plane };
