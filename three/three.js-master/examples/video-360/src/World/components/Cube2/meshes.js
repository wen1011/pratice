import { Mesh } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { createGeometries } from "./geometries.js";
import { createMaterials } from "./materials.js";

function createMeshes() {
	const geometries = createGeometries();
	const materials = createMaterials();

	const cube2 = new Mesh(geometries.cube2, materials.body);

	return { cube2 };
}
export { createMeshes };
