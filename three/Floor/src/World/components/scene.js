import { Color, Scene, FogExp2 } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createScene() {
    const scene = new Scene()
    scene.fog = new FogExp2(0xcccccc, 0.002)
    scene.background = new Color(0xcccccc)

    return scene
}

export { createScene }
