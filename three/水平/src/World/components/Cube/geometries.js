import { BoxGeometry } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createGeometries() {
    const cube = new BoxGeometry(700, 700, 700, 10, 10, 10)

    return { cube }
}
export { createGeometries }
