import { OrbitControls } from 'https://cdn.skypack.dev/three@0.120.0/examples/jsm/controls/OrbitControls.js'

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas)
    controls.enableKeys = true
    controls.keys = {
        LEFT: 37, //left arrow
        UP: 38, // up arrow
        RIGHT: 39, // right arrow
        BOTTOM: 40, // down arrow
    }
    controls.enableDamping = true

    // forward controls.update to our custom .tick method
    controls.tick = () => controls.update()

    return controls
}

export { createControls }
