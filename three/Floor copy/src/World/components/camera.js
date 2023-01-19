import { PerspectiveCamera } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createCamera() {
    const camera = new PerspectiveCamera(35, 1, 0.1, 10000)

    camera.position.set(10, 10, 10)

    return camera
}

export { createCamera }
