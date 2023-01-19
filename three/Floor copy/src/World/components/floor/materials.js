import { MeshPhongMaterial, DoubleSide } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createMaterials() {
    const floorMaterial = new MeshPhongMaterial({ vertexColors: true })

    return { floorMaterial }
}
export { createMaterials }
