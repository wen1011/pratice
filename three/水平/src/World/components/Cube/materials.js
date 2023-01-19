import { MeshPhongMaterial, DoubleSide } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createMaterials() {
    const body = new MeshPhongMaterial({
        color: 0xfffff,
        wireframe: true,
    })

    return { body }
}
export { createMaterials }
