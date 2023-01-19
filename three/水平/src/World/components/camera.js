import { PerspectiveCamera } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createCamera() {
    const camera = new PerspectiveCamera(45, 1, 0.1, 10000)

    camera.position.set(-1.5, 1.5, 2000)

    return camera
}

export { createCamera }
