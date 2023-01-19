import { WebGLRenderer } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createRenderer() {
    const renderer = new WebGLRenderer()

    return renderer
}

export { createRenderer }
