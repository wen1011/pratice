import { MeshBasicMaterial, BackSide, VideoTexture, Scene } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
function createMaterials() {
	const gui = new GUI();

	const options = {
		src: "video",
	};
	const src1 = {
		girl: "./assets/texture/MaryOculus.webm",
		man: "./assets/texture/pano.mp4",
	};
	const video = document.getElementById("video");

	gui.add(options, "src", src1).onChange(function (value) {
		document.getElementById("video").src = null;
		video.src = value;
		video.play();
	});
	var texture = new VideoTexture(video);

	const body = new MeshBasicMaterial({
		map: texture,
	});
	texture.needsUpdate = true;
	return { body };
}
export { createMaterials };
