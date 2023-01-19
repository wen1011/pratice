import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
let renderer, scene, camera
let cameraControl, stats, gui
let creeperObj
let walkSpeed = 0

let tween, tweenBack
let invert = 1 // 正反向
let startTracking = false
// object
class Creeper {
    constructor() {
        const headGeo = new THREE.BoxGeometry(4, 4, 4)
        const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
        const footGeo = new THREE.BoxGeometry(2, 3, 2)
        // 臉貼圖
        const headMap = new THREE.TextureLoader().load('./creeper_face.png')
        const skinMap = new THREE.TextureLoader().load('./creeper_skin.png')
        const skinMat = new THREE.MeshPhongMaterial({
            map: skinMap,
        })
        const headMaterials = []
        for (let i = 0; i < 6; i++) {
            let map
            if (i === 4) map = headMap
            else map = skinMap

            headMaterials.push(new THREE.MeshPhongMaterial({ map: map }))
        }
        this.head = new THREE.Mesh(headGeo, headMaterials)
        this.head.position.set(0, 6, 0)

        this.body = new THREE.Mesh(bodyGeo, skinMat)
        this.body.position.set(0, 0, 0)

        this.foot1 = new THREE.Mesh(footGeo, skinMat)
        this.foot1.position.set(-1, -5.5, 2)
        this.foot2 = this.foot1.clone()
        this.foot2.position.set(-1, -5.5, -2)
        this.foot3 = this.foot1.clone()
        this.foot3.position.set(1, -5.5, 2)
        this.foot4 = this.foot1.clone()
        this.foot4.position.set(1, -5.5, -2)

        this.feet = new THREE.Group()
        this.feet.add(this.foot1)
        this.feet.add(this.foot2)
        this.feet.add(this.foot3)
        this.feet.add(this.foot4)

        this.creeper = new THREE.Group()
        this.creeper.add(this.head)
        this.creeper.add(this.body)
        this.creeper.add(this.feet)

        // 這邊有個 traverse方法，這是 THREE.Scene中提供一個用來遍歷目標物件（creeper）及其所有後代（head、body、feet）的方法，透過傳入的 function，可以對苦力怕底下的所有子元件都設定陰影效果。
        this.creeper.traverse(function (object) {
            // instanceof 是用來判斷 A是否為B的實例
            if (object instanceof THREE.Mesh) {
                object.castShadow = true
                object.receiveShadow = true
            }
        })
    }
}
//!!生成creeper+場景
function createCreeper() {
    creeperObj = new Creeper()
    tweenHandler()
    scene.add(creeperObj.creeper)
}
// 控制面板
let datGUIControls = new (function () {
    this.startTracking = false
})()
function initStats() {
    const stats = new Stats()
    stats.setMode(0)
    document.getElementById('stats').appendChild(stats.domElement)
    return stats
}
function init() {
    scene = new THREE.Scene()
    // 相機設定
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(50, 50, 50)
    camera.lookAt(scene.position)

    let axes = new THREE.AxesHelper(20)
    scene.add(axes)
    stats = initStats()

    // 渲染器設定
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = 2

    // 建立OrbitControls
    cameraControl = new OrbitControls(camera, renderer.domElement)
    cameraControl.enableDamping = true
    cameraControl.dampingFactor = 0.25
    // 地板
    const planeGeometry = new THREE.PlaneGeometry(80, 80)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xfffff })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(0, -7, 0)
    plane.receiveShadow = true
    plane.name = 'floor'
    scene.add(plane)

    // 產生苦力怕物件
    createCreeper()
    // 設置環境光
    let ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // 設置聚光燈
    let spotLight = new THREE.SpotLight(0xf0f0f0)
    spotLight.position.set(-10, 30, 20)
    scene.add(spotLight)

    // 點光
    let pointLight = new THREE.PointLight(0xccffcc, 1, 100)
    pointLight.castShadow = true
    pointLight.position.set(-30, 30, 30)
    scene.add(pointLight)

    // gui
    gui = new dat.GUI()
    gui.add(datGUIControls, 'startTracking').onChange(function (e) {
        startTracking = e
        // invert 來判斷暫停時的動畫過程是停在 tween 還是 tweenBack。
        if (invert > 0) {
            if (startTracking) {
                tween.start()
            } else {
                tween.stop()
            }
        } else {
            if (startTracking) {
                tweenBack.start()
            } else {
                tweenBack.stop
            }
        }
    })
    document.body.appendChild(renderer.domElement)
}

function tweenHandler() {
    let offset = { x: 0, z: 0, rotateY: 0 }
    let target = { x: 20, z: 20, rotateY: 0.5 }
    // 走動及轉身
    const onUpdate = () => {
        creeperObj.feet.position.x = offset.x
        creeperObj.feet.position.z = offset.z
        creeperObj.head.position.x = offset.x
        creeperObj.head.position.z = offset.z
        creeperObj.body.position.x = offset.x
        creeperObj.body.position.z = offset.z

        if (target.x > 0) {
            creeperObj.feet.rotation.y = offset.rotateY
            creeperObj.head.rotation.y = offset.rotateY
            creeperObj.body.rotation.y = offset.rotateY
        } else {
            creeperObj.feet.rotation.y = -offset.rotateY
            creeperObj.head.rotation.y = -offset.rotateY
            creeperObj.body.rotation.y = -offset.rotateY
        }
    }
    // !計算新的目標值
    const handleNewTarget = () => {
        // 限制苦力怕走路邊界
        if (camera.position.x > 30) target.x = 20
        else if (camera.position.x < -30) target.x = -20
        else target.x = camera.position.x
        if (camera.position.z > 30) target.z = 20
        else if (camera.position.z < -30) target.z = -20
        else target.z = camera.position.z
        // 原點面朝方向
        const v1 = new THREE.Vector2(0, 1)
        // 面相新相機方向
        const v2 = new THREE.Vector2(target.x, target.z)
        // 內積除以純量得兩向量 cos 值
        let cosValue = v1.dot(v2) / (v1.length() * v2.length())

        // 防呆 Cos值區間(-1,1)
        if (cosValue > 1) cosValue = 1
        else if (cosValue < -1) cosValue = -1

        // Cos求轉身角度
        // acos()方法是一個靜態方法，只能藉由Math.acos()來呼叫，acos()方法可以取得輸入參數的反餘弦值。
        target.rotateY = Math.acos(cosValue)
    }

    tween = new TWEEN.Tween(offset)
        .to(target, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(onUpdate)
        .onComplete(() => {
            invert = -1
            tweenBack.start()
        })
    tweenBack = new TWEEN.Tween(offset)
        .to({ x: 0, z: 0, rotateY: 0 }, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(onUpdate)
        .onComplete(() => {
            // 計算新目標
            handleNewTarget()
            invert = 1
            tween.start()
        })
}
function creeperFeetWalk() {
    walkSpeed += 0.04
    creeperObj.foot1.rotation.x = Math.sin(walkSpeed) / 4 // 前腳左
    creeperObj.foot2.rotation.x = -Math.sin(walkSpeed) / 4 // 後腳左
    creeperObj.foot3.rotation.x = -Math.sin(walkSpeed) / 4 // 前腳右
    creeperObj.foot4.rotation.x = Math.sin(walkSpeed) / 4 // 後腳左
}

function render() {
    stats.update()
    cameraControl.update()
    creeperFeetWalk()
    TWEEN.update()

    requestAnimationFrame(render)
    renderer.render(scene, camera)
}

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
render()
