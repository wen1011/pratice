import { MeshBasicMaterial, DoubleSide, VideoTexture } from "three";

function createMaterials() {
	const video = document.getElementById("video");
	video.play();
	var texture = new VideoTexture(video);
	const body = new MeshBasicMaterial({
		map: texture,
		side: DoubleSide,
	});
	return { body };
}
export { createMaterials };
