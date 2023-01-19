import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
let renderer, scene, camera
let stats, gui

// Cannon
let world
let groundBody
let sphereBody
let sphere
// 摩擦力
let friction = 0.5
// 恢復係數
let restitution = 0.7
let sphereGroundContact

function iniStats() {
    const stats = new Stats()
    stats.setMode(0)
    document.getElementById('stats').appendChild(stats.domElement)
    return stats
}
let controls = new (function () {
    this.resetBall = function () {
        sphereBody.position.set(0, 10, 0)
        sphereBody.velocity.set(0, 0, 0)
        sphereGroundContact.friction = friction
        sphereGroundContact.restitution = restitution
    }
    this.friction = 0.5
    this.restitution = 0.7
})()

function initThreeSetting() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(20, 20, 20)
    camera.lookAt(scene.position)

    let axes = new THREE.AxesHelper(20)
    scene.add(axes)

    stats = iniStats()

    gui = new dat.GUI()
    gui.add(controls, 'resetBall')
    gui.add(controls, 'friction', 0, 2).onChange((e) => {
        friction = e
    })
    gui.add(controls, 'restitution', 0, 2).onChange((e) => {
        restitution = e
    })
    renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0xeeeeee, 1.0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = 2
    renderer.setSize(window.innerWidth, window.innerHeight)

    let ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)
    let spotLight = new THREE.SpotLight(0x999999)
    spotLight.position.set(-10, 30, 20)
    scene.add(spotLight)
    let pointLight = new THREE.PointLight(0xccfcc, 1, 100)
    pointLight.castShadow = true
    pointLight.position.set(-30, 30, 30)
    scene.add(pointLight)
    document.body.appendChild(renderer.domElement)
}

function initCannonWorld() {
    // 建立物理世界
    world = new CANNON.World()

    // 設定重力 y軸-9.8 m/s2
    world.gravity.set(0, -9.8, 0)

    // 偵測碰撞
    world.broadphase = new CANNON.NaiveBroadphase()
    // 偵測地板鋼體
    let groundShape = new CANNON.Plane()
    let groundCM = new CANNON.Material()
    groundBody = new CANNON.Body({
        mass: 0,
        shape: groundShape,
        material: groundCM,
    })
    // set FromAxisAngle 旋轉x軸-90度
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    world.add(groundBody)

    // 建立球體
    let sphereShape = new CANNON.Sphere(1)
    let sphereCM = new CANNON.Material()
    sphereBody = new CANNON.Body({
        mass: 3,
        shape: sphereShape,
        position: new CANNON.Vec3(0, 10, 0),
        material: sphereCM,
    })
    world.add(sphereBody)

    // setting 兩缸體碰撞時交互作用屬性
    sphereGroundContact = new CANNON.ContactMaterial(groundCM, sphereCM, {
        // 摩擦力
        friction: friction,
        // 恢復係數
        restitution: restitution,
    })
    world.addContactMaterial(sphereGroundContact)

    // 地板網格
    let groundGeometry = new THREE.PlaneGeometry(20, 20, 32)
    let groundMaterial = new THREE.MeshLambertMaterial({
        color: 0xa5a5a5,
        side: THREE.DoubleSide,
    })
    let ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)
    // 網球格
    let sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
    let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x33aaaa })
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.castShadow = true
    scene.add(sphere)
}
// second-同步更新網格模型的位置需與剛體同步
const timeStep = 1.0 / 60.0

function render() {
    world.step(timeStep)
    if (sphere) {
        sphere.position.copy(sphereBody.position)
        sphere.quaternion.copy(sphereBody.quaternion)
    }
    stats.update()
    requestAnimationFrame(render)
    renderer.render(scene, camera)
}
window.addEventListener('reSize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

initThreeSetting()
initCannonWorld()
render()
