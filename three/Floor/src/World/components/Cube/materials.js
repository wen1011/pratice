import {
    MeshPhongMaterial,
    DoubleSide,
    CubeTextureLoader,
} from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createMaterials() {
    const loader = new CubeTextureLoader()
    loader.setPath('./assets/texture/')
    const textureCube = loader.load(['1.jpg', '1.jpg', '1.jpg', '1.jpg', '1.jpg', '1.jpg'])
    const body = new MeshPhongMaterial({
        color: 0xffffff,
        envMap: textureCube,
        side: DoubleSide,
        flatShading: true,
    })

    return { body }
}
export { createMaterials }
