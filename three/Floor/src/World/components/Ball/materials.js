import { MeshPhongMaterial, DoubleSide } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createMaterials() {
    const body = new MeshPhongMaterial({
        color: '#987284',
        flatShading: true,
    })
    const around = new MeshPhongMaterial({
        color: '#686868',
        flatShading: true,
    })
    const detail = new MeshPhongMaterial({
        color: '#D9F7FA',
        wireframe: true,
        side: DoubleSide,
    })

    return { body, detail, around }
}
export { createMaterials }
