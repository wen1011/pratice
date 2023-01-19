import { OrbitControls } from "https://cdn.skypack.dev/three@0.120.0/examples/jsm/controls/OrbitControls.js";

function createControls(camera, canvas) {
	const controls = new OrbitControls(camera, canvas);

	controls.screenSpacePanning = false;
	// controls.minDistance = 100
	controls.maxDistance = 2000;
	controls.maxPolarAngle = Math.PI / 2;
	controls.minPolarAngle = Math.PI / 2;
	// controls. minAzimuthAngle=  [ - 2 Math.PI, 2 Math.PI ]
	// controls.enableZoom = false
	controls.keyPanSpeed = 10;
	controls.enableKeys = false;

	// forward controls.update to our custom .tick method
	controls.tick = () => controls.update();

	return controls;
}

export { createControls };
