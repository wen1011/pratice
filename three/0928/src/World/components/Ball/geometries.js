import { IcosahedronGeometry, TetrahedronGeometry } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createGeometries() {
    const innerBall = new IcosahedronGeometry(2, 1)
    const outerBall = new IcosahedronGeometry(3, 1)
    const aroundBall = new TetrahedronGeometry(1, 0)

    return { innerBall, outerBall, aroundBall }
}
export { createGeometries }
