import { AnimationMixer } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js'

function setupModel(data) {
    const model = data.scene.children[0]
    const clip = data.animations[0]

    const mixer = new AnimationMixer(model)
    const action = mixer.clipAction(clip)
    action.play()

    model.tick = (delta) => mixer.update(delta)

    return model
}

export { setupModel }
