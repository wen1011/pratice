import { SphereGeometry } from "three";

function createGeometries() {
	const cube2 = new SphereGeometry(500, 60, 40);
	cube2.scale(-2, 2, 2);
	return { cube2 };
}
export { createGeometries };
