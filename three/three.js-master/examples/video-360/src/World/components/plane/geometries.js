import { PlaneGeometry } from "three";

function createGeometries() {
	const plane = new PlaneGeometry(200, 100);

	return { plane };
}
export { createGeometries };
