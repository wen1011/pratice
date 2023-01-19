import { Mesh } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

import { createGeometries } from './geometries.js'
import { createMaterials } from './materials.js'

function createMeshes() {
    const geometries = createGeometries()
    const materials = createMaterials()

    const floor = new Mesh(geometries.floorGeometry, materials.floorMaterial)

    return { floor }
}
export { createMeshes }
