import { Group, MathUtils } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

import { createMeshes } from './meshes.js'

const moveSpeed = MathUtils.degToRad(10)

class Cube extends Group {
    constructor() {
        super()
        this.meshes = createMeshes()

        this.add(this.meshes.cube)
    }

    tick(delta) {
        this.meshes.cube.rotation.x -= moveSpeed * delta
        this.meshes.cube.rotation.y -= moveSpeed * delta
    }
}
export { Cube }
