import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
let renderer, scene, camera
let cameraControl, stats
// object
class Creeper {
    // constructor（建構子）是個隨著 class 一同建立並初始化物件的特殊方法。
    constructor() {
        // 宣告 頭+身+腳幾何大小
        const headGeo = new THREE.BoxGeometry(4, 4, 4)
        const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
        const footGeo = new THREE.BoxGeometry(2, 3, 2)

        const creeperMat = new THREE.MeshPhongMaterial({ color: 0x00ff00 })

        // 頭
        this.head = new THREE.Mesh(headGeo, creeperMat)
        this.head.position.set(0, 6, 0)

        // 身
        this.body = new THREE.Mesh(bodyGeo, creeperMat)
        this.body.position.set(0, 0, 0)

        // 四隻腳
        this.foot1 = new THREE.Mesh(footGeo, creeperMat)
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
    }
}
function createCreeper() {
    const creeperObj = new Creeper()
    scene.add(creeperObj.creeper)
}
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
    camera.position.set(30, 30, 30)
    camera.lookAt(scene.position)

    //  三座標補助
    let axes = new THREE.AxesHelper(20)
    scene.add(axes)
    stats = initStats()

    // 渲染器
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    // todo建立OrbitControls
    cameraControl = new OrbitControls(camera, renderer.domElement)
    // / 啟用阻尼效果
    cameraControl.enableDamping = true
    // 阻尼系數
    cameraControl.dampingFactor = 0.25
    // 啟用自動旋轉
    cameraControl.autoRotate = true

    // 簡單地地板
    const planeGeometry = new THREE.PlaneGeometry(60, 60)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    // 沿著 x 軸正方向逆時針轉 90 度
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(0, -7, 0)
    scene.add(plane)

    // creeper加入
    createCreeper()

    //light
    let spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-10, 40, 30)
    scene.add(spotLight)

    // 渲染
    document.body.appendChild(renderer.domElement)
}

function render() {
    stats.update()
    // !!如果.autoRotate為真 ，圍繞目標旋轉的速度有多快。默認值為 2.0，相當於 60fps 時每個軌道 30 秒。請注意，如果啟用了.autoRotate ，則必須 在動畫循環中 調用.update ()。
    cameraControl.update()
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
