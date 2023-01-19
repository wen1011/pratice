import { DirectionalLight, HemisphereLight } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createLights() {
    const ambientLight = new HemisphereLight('white', 'darkslategrey', 3)

    const mainLight = new DirectionalLight(0xffffff, 2)
    mainLight.position.set(1, 1, 1)
    const secondLight = new DirectionalLight(0x002288, 2)
    mainLight.position.set(-1, -1, -1)

    return { ambientLight, mainLight, secondLight }
}

export { createLights }
