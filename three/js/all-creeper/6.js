import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'

import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
let renderer, scene, camera, creeperObj

let cameraControl, stats, gui, plane

let rotateHeadOffset = 0,
    walkOffset = 0,
    scaleHeadOffset = 0
let startRotateHead = false
let startWalking = false
let startScaleBody = false
// object
class Creeper {
    // constructor（建構子）是個隨著 class 一同建立並初始化物件的特殊方法。
    constructor() {
        // 宣告 頭+身+腳幾何大小
        const headGeo = new THREE.BoxGeometry(4, 4, 4)
        const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
        const footGeo = new THREE.BoxGeometry(2, 3, 2)

        const headMap = new THREE.TextureLoader().load(
            'https://dl.dropboxusercontent.com/s/bkqu0tty04epc46/creeper_face.png'
        )
        const skinMap = new THREE.TextureLoader().load(
            'https://dl.dropboxusercontent.com/s/eev6wxdxfmukkt8/creeper_skin.png'
        )
        const skinMat = new THREE.MeshStandardMaterial({
            roughness: 0.9, // 粗糙度
            metalness: 0.7, // 金屬感
            transparent: true, // 透明與否
            opacity: 0.9, // 透明度
            side: THREE.DoubleSide, // 雙面材質
            map: skinMap, // 皮膚貼圖
        })
        // 準備頭跟臉的材質
        const headMaterials = []
        for (let i = 0; i < 6; i++) {
            let map
            if (i === 4) map = headMap
            else map = skinMap
            headMaterials.push(new THREE.MeshStandardMaterial({ map: map }))
        }
        // 頭
        this.head = new THREE.Mesh(headGeo, headMaterials)
        this.head.position.set(0, 6, 0)
        // this.head.rotation.y = 0.5
        // 身
        this.body = new THREE.Mesh(bodyGeo, skinMat)
        this.body.position.set(0, 0, 0)

        // 四隻腳
        this.foot1 = new THREE.Mesh(footGeo, skinMat)
        this.foot1.position.set(-1, -5.5, 2)
        // 複製第一隻
        this.foot2 = this.foot1.clone()
        this.foot2.position.set(-1, -5.5, -2)
        this.foot3 = this.foot1.clone()
        this.foot3.position.set(1, -5.5, 2)
        this.foot4 = this.foot1.clone()
        this.foot4.position.set(1, -5.5, -2)

        //set feet group
        this.feet = new THREE.Group()
        this.feet.add(this.foot1)
        this.feet.add(this.foot2)
        this.feet.add(this.foot3)
        this.feet.add(this.foot4)
        // set robot group
        this.creeper = new THREE.Group()
        this.creeper.add(this.head)
        this.creeper.add(this.body)
        this.creeper.add(this.feet)
        // 投影設定
        this.creeper.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true
                object.receiveShadow = true
            }
        })
    }
}
//! const拿掉
function createCreeper() {
    creeperObj = new Creeper()
    scene.add(creeperObj.creeper)
}
let datGUIControls = new (function () {
    this.startRotateHead = false
    this.startWalking = false
    this.startScaleBody = false
})()
function initStats() {
    const stats = new Stats()
    stats.setMode(0)
    document.getElementById('stats').appendChild(stats.domElement)
    return stats
}
function init() {
    scene = new THREE.Scene()
    // 相機設定 OrbitControls
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(50, 50, 50)
    camera.lookAt(scene.position)

    //  三座標補助
    let axes = new THREE.AxesHelper(20)
    scene.add(axes)
    stats = initStats()

    // 渲染器
    // shadow  renderer.shadowMap.enabled 把陰影效果啟用，不然後面都不會出現陰影。
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 設定需要渲染陰影的效果
    renderer.shadowMap.enabled = true
    // THREE.PCFSoftShadowMap
    // 陰影的毛邊優化，調整成 THREE.PCFSoftShadowMap 影子會看起來比較圓滑。
    renderer.shadowMap.type = 2

    // todo建立OrbitControls
    cameraControl = new OrbitControls(camera, renderer.domElement)
    // / 啟用阻尼效果
    cameraControl.enableDamping = true
    // 阻尼系數
    cameraControl.dampingFactor = 0.25
    // 啟用自動旋轉
    // cameraControl.autoRotate = true

    // 簡單地地板
    const planeGeometry = new THREE.PlaneGeometry(80, 80)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    plane = new THREE.Mesh(planeGeometry, planeMaterial)
    // 沿著 x 軸正方向逆時針轉 90 度
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(0, -7, 0)
    // 地板需接收陰影
    plane.receiveShadow = true
    plane.name = 'floor'
    scene.add(plane)

    // creeper加入
    createCreeper()

    // 設置環境光提供輔助柔和白光
    let ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // 聚光燈
    let spotLight = new THREE.SpotLight(0xf0f0f0)
    spotLight.position.set(-10, 30, 20)

    scene.add(spotLight)

    //移動光點
    // 顏色,強度,距離
    let pointLight = new THREE.PointLight(0xccffcc, 1, 100)
    pointLight.castShadow = true
    pointLight.position.set(-30, 30, 30)
    scene.add(pointLight)

    // dat.Gui
    gui = new dat.GUI()
    gui.add(datGUIControls, 'startRotateHead').onChange(function (e) {
        startRotateHead = e
    })
    gui.add(datGUIControls, 'startWalking').onChange(function (e) {
        startWalking = e
    })
    gui.add(datGUIControls, 'startScaleBody').onChange(function (e) {
        startScaleBody = e
    })

    // 渲染
    document.body.appendChild(renderer.domElement)
}
// 苦力怕擺頭
function creeperHeadRotate() {
    rotateHeadOffset += 0.04
    if (startRotateHead) {
        creeperObj.head.rotation.y = Math.sin(rotateHeadOffset)
    }
}

// 苦力怕走動
function creeperFeetWalk() {
    walkOffset += 0.04
    if (startWalking) {
        creeperObj.foot1.rotation.x = Math.sin(walkOffset) / 4 // 前腳左
        creeperObj.foot2.rotation.x = -Math.sin(walkOffset) / 4 // 後腳左
        creeperObj.foot3.rotation.x = -Math.sin(walkOffset) / 4 // 前腳右
        creeperObj.foot4.rotation.x = Math.sin(walkOffset) / 4 // 後腳右
    }
}

// 苦力怕膨脹
function creeperScaleBody() {
    scaleHeadOffset += 0.04
    if (startScaleBody) {
        let scaleRate = Math.abs(Math.sin(scaleHeadOffset)) / 16 + 1
        creeperObj.creeper.scale.set(scaleRate, scaleRate, scaleRate)
    }
}

function render() {
    stats.update()

    // 如果.autoRotate為真 ，圍繞目標旋轉的速度有多快。默認值為 2.0，相當於 60fps 時每個軌道 30 秒。請注意，如果啟用了.autoRotate ，則必須 在動畫循環中 調用.update ()。
    cameraControl.update()
    // update

    creeperHeadRotate()
    creeperFeetWalk()
    creeperScaleBody()
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
