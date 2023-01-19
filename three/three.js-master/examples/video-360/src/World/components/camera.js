import { PerspectiveCamera } from "three";

function createCamera() {
	const camera = new PerspectiveCamera(75, 1, 0.5, 10000);
	camera.position.x = -30;
	camera.position.y = -400;
	camera.position.z = 2000;
	const zoomInButton = document.getElementById("zoomIn");
	const zoomOutButton = document.getElementById("zoomOut");

	const zoomInFunction = (e) => {
		const video = document.getElementById("video");
		video.play();
		const fov = getFov();
		camera.fov = clickZoom(fov, "zoomIn");
		camera.updateProjectionMatrix();
	};

	zoomInButton.addEventListener("click", zoomInFunction);

	const zoomOutFunction = (e) => {
		const video = document.getElementById("video");
		video.pause();
		const fov = getFov();
		camera.fov = clickZoom(fov, "zoomOut");
		camera.updateProjectionMatrix();
	};

	zoomOutButton.addEventListener("click", zoomOutFunction);

	const clickZoom = (value, zoomType) => {
		if (value >= 55 && zoomType === "zoomIn") {
			return value - 55;
		} else if (value <= 55 && zoomType === "zoomOut") {
			return value + 55;
		} else {
			return value;
		}
	};

	const getFov = () => {
		return Math.floor(
			(2 *
				Math.atan(camera.getFilmHeight() / 2 / camera.getFocalLength()) *
				180) /
				Math.PI
		);
	};

	return camera;
}

export { createCamera };
