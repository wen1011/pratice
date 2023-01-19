import { BoxGeometry } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createGeometries() {
    const cube = new BoxGeometry(10000, 10000, 10000)

    return { cube }
}
export { createGeometries }
