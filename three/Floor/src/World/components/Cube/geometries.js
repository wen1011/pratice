import { BoxGeometry } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createGeometries() {
    const cube = new BoxGeometry(30, 30, 30)

    return { cube }
}
export { createGeometries }
