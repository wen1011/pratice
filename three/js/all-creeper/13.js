import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'

let renderer, scene, camera
let cameraControl, stats, gui
let creeperObj, plane
let rotateHeadOffset = 0,
    walkOffset = 0,
    scaleHeadOffset = 0
const textureLoader = new THREE.TextureLoader()
// point
const pointCount = 1000
const movementSpeed = 10

let explosion = []
let size = 10

const smokeTexture = textureLoader.load('./star.png')

// 建立粒子系統

class Explosion {
    constructor(x, y, color) {
        const geometry = new THREE.Geometry()

        this.material = new THREE.PointsMaterial({
            size: size,
            color: color,
            map: smokeTexture,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            opacity: 0.7,
        })
        // 粒子總數
        this.pCount = pointCount
        // 移速種子
        this.movementSpeed = movementSpeed
        // 建立一個爆炸方向的屬性，取名為 dirs，是一個陣列，儲存每一個粒子的爆炸方向
        this.dirs = []

        for (let i = 0; i < this.pCount; i++) {
            // 每個頂點起點都在爆炸起源點
            const vertex = new THREE.Vector3(x, y, 0)
            geometry.vertices.push(vertex)

            // !噴射方向隨機 -> 不規則球體
            // . randFloat（低：浮動，高：浮動）：隨機浮動
            const r = this.movementSpeed * THREE.Math.randFloat(0, 1) + 2
            // 噴射方向隨機 -> 不規則球體
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI
            // ，改寫成球體座標，並且將半徑用移動速度再乘上一個隨機值就能產生接近球體但比較像爆炸的不規則形狀
            this.dirs.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi),
            })
            // !噴射方向隨機 -> 正方形
            // this.dirs.push({
            //     x: Math.random() * r - r / 2,
            //     y: Math.random() * r - r / 2,
            //     z: Math.random() * r - r / 2,
            // })
        }
        let points = new THREE.Points(geometry, this.material)
        this.object = points
        scene.add(this.object)
    }
    update() {
        let p = this.pCount
        const d = this.dirs
        while (p--) {
            let particle = this.object.geometry.vertices[p]
            // !每個頂點往自己噴射方向一直移動，會漸漸淡出是也可見範圍，但他仍一直在運動
            particle.x += d[p].x
            particle.y += d[p].y
            particle.z += d[p].z
        }
        this.object.geometry.verticesNeedUpdate = true
    }
    // !!
    destroy() {
        this.object.geometry.dispose()
        scene.remove(this.object)
        console.log(renderer.info)
        this.dirs.length = 0
    }
}
class Creeper {
    constructor() {
        // 宣告頭、身體、腳幾何體大小
        const headGeo = new THREE.BoxGeometry(4, 4, 4)
        const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
        const footGeo = new THREE.BoxGeometry(2, 3, 2)

        const headMap = textureLoader.load('./creeper_face.png')
        const skinMap = textureLoader.load('./creeper_skin.png')

        const skinMat = new THREE.MeshPhongMaterial({
            map: skinMap, // 皮膚貼圖
        })

        const headMaterials = []
        for (let i = 0; i < 6; i++) {
            let map

            if (i === 4) map = headMap
            else map = skinMap

            headMaterials.push(new THREE.MeshPhongMaterial({ map: map }))
        }

        // 頭
        this.head = new THREE.Mesh(headGeo, headMaterials)
        this.head.position.set(0, 6, 0)

        // 身體
        this.body = new THREE.Mesh(bodyGeo, skinMat)
        this.body.position.set(0, 0, 0)

        // 四隻腳
        this.foot1 = new THREE.Mesh(footGeo, skinMat)
        this.foot1.position.set(-1, -5.5, 2)
        this.foot2 = this.foot1.clone()
        this.foot2.position.set(-1, -5.5, -2)
        this.foot3 = this.foot1.clone()
        this.foot3.position.set(1, -5.5, 2)
        this.foot4 = this.foot1.clone()
        this.foot4.position.set(1, -5.5, -2)

        // 將四隻腳組合為一個 group
        this.feet = new THREE.Group()
        this.feet.add(this.foot1) // 前腳左
        this.feet.add(this.foot2) // 後腳左
        this.feet.add(this.foot3) // 前腳右
        this.feet.add(this.foot4) // 後腳右

        // 將頭、身體、腳組合為一個 group
        this.creeper = new THREE.Group()
        this.creeper.add(this.head)
        this.creeper.add(this.body)
        this.creeper.add(this.feet)
        this.creeper.name = 'creeper'

        this.creeper.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true
                object.receiveShadow = true
            }
        })
    }
}

// 生成苦力怕並加到場景
function createCreeper() {
    creeperObj = new Creeper()
    scene.add(creeperObj.creeper)
}
// gui
let datGUIControls = new (function () {
    this.explosionTrigger = function () {
        for (let i = 0; i < scene.children.length; i++) {
            const object = scene.children[i]

            if (object.name === 'creeper') {
                if (explosion) {
                    const len = explosion.length
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            explosion[i].destroy()
                        }
                    }
                    explosion.length = 0
                }
                scene.remove(creeperObj.creeper)
                // 產生爆炸
                explosion[0] = new Explosion(0, 0, 0, 0x000000)
                explosion[1] = new Explosion(5, 5, 5, 0x333333)
                explosion[2] = new Explosion(-5, 5, 10, 0x666666)
                explosion[3] = new Explosion(-5, 5, 5, 0x99999)
                explosion[4] = new Explosion(5, 5, -5, 0xcccccc)
            }
        }
    }
    this.resetCreeper = function () {
        scene.add(creeperObj.creeper)
    }
})()
function initStats() {
    const stats = new Stats()
    stats.setMode(0)
    document.getElementById('stats').appendChild(stats.domElement)
    return stats
}
function init() {
    // scene
    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.0008)
    // camera
    // 視角（fov, field of view）：又稱為視野、視場，指的是我們能從畫面上看到的視野範圍，一般在遊戲中會設定在 60 ~ 90 度。
    // 畫面寬高比（aspect）：渲染結果的畫面比例，一般都是使用 window.innerWidth / window.innerHeight 。
    // 近面距離（near）：從距離相機多近的地方開始渲染，一般推薦使用 0.1
    // 遠面距離（far）：相機能看得多遠，一般推薦使用 1000，可視需求調整，設置過大會影響效能。
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 20, 1000)
    camera.position.set(50, 50, 50)
    camera.lookAt(scene.position)
    // stats
    stats = initStats()

    //axes
    //     AxesHelper( size : Number )
    // size -- (optional) size of the lines representing the axes. Default is 1.
    let axes = new THREE.AxesHelper(20)
    scene.add(axes)
    // .setClearColor ( color : Color, alpha : Float ) : undefined
    // Sets the clear color and opacity.
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = 2

    // OrbitControls

    cameraControl = new OrbitControls(camera, renderer.domElement)
    cameraControl.enableDamping = true
    cameraControl.dampingFactor = 0.25

    // plane
    const planeGeometry = new THREE.PlaneGeometry(80, 80)
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
    plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(0, -7, 0)
    plane.receiveShadow = true
    plane.name = 'floor'
    scene.add(plane)

    // creeper
    createCreeper()

    // light
    let ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)
    let spotLight = new THREE.SpotLight(0xf0f0f0)
    spotLight.position.set(-10, 30, 20)
    scene.add(spotLight)
    //  顏色 距離 強度
    let pointLight = new THREE.PointLight(0xccffcc, 1, 100)
    pointLight.position.set(-30, 30, 30)
    pointLight.shadowMap = true
    scene.add(pointLight)

    // dat.GUI
    gui = new dat.GUI()
    gui.add(datGUIControls, 'explosionTrigger')
    gui.add(datGUIControls, 'resetCreeper')
    document.body.appendChild(renderer.domElement)
}

// 膨脹
function creeperScaleBody() {
    scaleHeadOffset += 0.04
    // he value without regard to whether it is positive or negative
    let scaleRate = Math.abs(Math.sin(scaleHeadOffset)) / 16 + 1
    creeperObj.creeper.scale.set(scaleRate, scaleRate, scaleRate)
}

function render() {
    // 作一個 method 用來做爆炸的動畫 update()，方法就是每個頂點依據自己的噴射方向屬性一直疊加，最後會漸漸淡出視野可見範圍，達到爆炸的效果。
    if (explosion) {
        const len = explosion.length
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                explosion[i].update()
            }
        }
    }
    stats.update()
    cameraControl.update()
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
