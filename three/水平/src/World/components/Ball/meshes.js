import { Mesh } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

import { createGeometries } from './geometries.js'
import { createMaterials } from './materials.js'

function createMeshes() {
    const geometries = createGeometries()
    const materials = createMaterials()

    const innerBall = new Mesh(geometries.innerBall, materials.body)
    innerBall.position.set(0, 0, -10)

    const outerBall = new Mesh(geometries.outerBall, materials.detail)
    outerBall.position.set(0, 0, -10)

    const aroundBall = new Mesh()
    // aroundBall.position.set(25, 25, 25)

    for (let i = 0; i < 1000; i++) {
        const mesh = new Mesh(geometries.aroundBall, materials.around)
        mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
        mesh.position.multiplyScalar(90 + Math.random() * 700)
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
        aroundBall.add(mesh)
    }

    return { innerBall, outerBall, aroundBall }
}
export { createMeshes }
