import { Group, MathUtils } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

import { createMeshes } from './meshes.js'

const moveSpeed = MathUtils.degToRad(24)

class Ball extends Group {
    constructor() {
        super()
        this.meshes = createMeshes()

        this.add(this.meshes.innerBall, this.meshes.aroundBall, this.meshes.outerBall)
    }
    tick(delta) {
        this.meshes.innerBall.rotation.x -= moveSpeed * delta
        this.meshes.innerBall.rotation.y -= moveSpeed * delta
        this.meshes.outerBall.rotation.x -= moveSpeed * delta
        this.meshes.outerBall.rotation.y += moveSpeed * delta
        this.meshes.aroundBall.rotation.x -= moveSpeed * delta
        this.meshes.aroundBall.rotation.y += moveSpeed * delta
    }
}
export { Ball }
