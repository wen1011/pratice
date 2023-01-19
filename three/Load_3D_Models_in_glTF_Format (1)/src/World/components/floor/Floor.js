import { Group, MathUtils } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

import { createMeshes } from './meshes.js'

const moveSpeed = MathUtils.degToRad(10)

class Floor extends Group {
    constructor() {
        super()
        this.meshes = createMeshes()

        this.add(this.meshes.floor)
    }

    tick(delta) {
        this.meshes.floor.rotation.x -= moveSpeed * delta
        this.meshes.floor.rotation.y -= moveSpeed * delta
    }
}
export { Floor }
