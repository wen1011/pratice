import { PerspectiveCamera } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createCamera() {
    const camera = new PerspectiveCamera(35, 1, 0.1, 1000)

    camera.position.set(-1.5, 1.5, 6.5)

    return camera
}

export { createCamera }
