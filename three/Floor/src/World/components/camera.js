import { PerspectiveCamera } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createCamera() {
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000)

    camera.position.y = 10

    return camera
}

export { createCamera }
