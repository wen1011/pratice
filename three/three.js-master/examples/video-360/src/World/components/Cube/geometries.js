import { BoxGeometry } from "three";

function createGeometries() {
	const cube = new BoxGeometry(10000, 10000, 10000);

	return { cube };
}
export { createGeometries };
