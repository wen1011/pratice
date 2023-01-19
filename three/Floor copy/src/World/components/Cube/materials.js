import {
    MeshPhongMaterial,
    BackSide,
    CubeTextureLoader,
} from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function createMaterials() {
    const loader = new CubeTextureLoader()
    loader.setPath('./assets/texture/')
    const textureCube = loader.load([
        'purplenebula_ft.png',
        'purplenebula_bk.png',
        'purplenebula_up.png',
        'purplenebula_dn.png',
        'purplenebula_rt.png',
        'purplenebula_lf.png',
    ])
    const body = new MeshPhongMaterial({
        color: 0xffffff,
        envMap: textureCube,
        side: BackSide,
        flatShading: true,
    })

    return { body }
}
export { createMaterials }
