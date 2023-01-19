import { Color, Scene } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createScene() {
    const scene = new Scene()

    scene.background = new Color('black')

    return scene
}

export { createScene }
