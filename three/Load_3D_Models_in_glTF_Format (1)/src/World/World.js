import { loadBirds } from './components/birds/birds.js'
import { createCamera } from './components/camera.js'
import { createLights } from './components/lights.js'
import { createScene } from './components/scene.js'
import { Cube } from './components/Cube/Cube.js'
import { Floor } from './components/floor/Floor.js'
import { createControls } from './systems/controls.js'
import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'
import { Loop } from './systems/Loop.js'

let camera
let controls
let renderer
let scene
let loop

class World {
    constructor(container) {
        camera = createCamera()
        renderer = createRenderer()
        scene = createScene()
        loop = new Loop(camera, scene, renderer)
        container.append(renderer.domElement)
        controls = createControls(camera, renderer.domElement)
        const cube = new Cube()
        const floor = new Floor()
        const { ambientLight, mainLight } = createLights()

        loop.updatables.push(controls, cube)
        scene.add(ambientLight, mainLight, cube)

        const resizer = new Resizer(container, camera, renderer)
    }

    async init() {
        const { parrot } = await loadBirds()

        // move the target to the center of the front bird
        controls.target.copy(parrot.position)

        scene.add(parrot)
    }

    render() {
        renderer.render(scene, camera)
    }

    start() {
        loop.start()
    }

    stop() {
        loop.stop()
    }
}

export { World }
