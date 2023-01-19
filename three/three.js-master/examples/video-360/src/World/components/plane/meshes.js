import { Mesh } from "three";

import { createGeometries } from "./geometries.js";
import { createMaterials } from "./materials.js";

function createMeshes() {
	const geometries = createGeometries();
	const materials = createMaterials();

	const plane = new Mesh(geometries.plane, materials.body);
	plane.position.set(0, -350, -100);
	return { plane };
}
export { createMeshes };
