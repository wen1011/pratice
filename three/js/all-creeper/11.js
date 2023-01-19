import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
let renderer, scene, camera
let cameraControl, stats, gui
let creeperObj
let walkSpeed = 0
let tween, tweenBack
let invert = 1 // 正反向
let startTracking = false
let musicPlayback = false
let pointLight
const sound = document.querySelector('audio')
let sceneType = 'SNOW'

// points建立 15000 個頂點
// points
const particleCount = 15000
let points
let material
const textureLoader = new THREE.TextureLoader()
const startTexture = textureLoader.load('./snowflake.png')
const rainTexture = textureLoader.load('./star.png')

// 苦力怕物件
class Creeper {
    constructor() {
        // 宣告頭、身體、腳幾何體大小
        const headGeo = new THREE.BoxGeometry(4, 4, 4)
        const bodyGeo = new THREE.BoxGeometry(4, 8, 2)
        const footGeo = new THREE.BoxGeometry(2, 3, 2)

        // 苦力怕臉部貼圖
        const headMap = textureLoader.load('./creeper_face.png')
        // 苦力怕皮膚貼圖
        const skinMap = textureLoader.load('./creeper_skin.png')

        // 身體與腳的材質設定
        const skinMat = new THREE.MeshPhongMaterial({
            map: skinMap, // 皮膚貼圖
        })

        // 準備頭部與臉的材質
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
        // this.head.rotation.y = 0.5 // 稍微的擺頭

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

        this.creeper.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true
                object.receiveShadow = true
            }
        })
    }
}

// creeper加入
function createCreeper() {
    creeperObj = new Creeper()
    tweenHandler()
    scene.add(creeperObj.creeper)
}

let datGUIControls = new (function () {
    this.startTracking = false
    this.togglePlayMusic = function () {
        if (musicPlayback) {
            sound.pause()
            musicPlayback = false
        } else {
            sound.play()
            musicPlayback = true
        }
    }
    this.changeScene = function () {
        if (sceneType === 'SNOW') {
            material.map = rainTexture
            material.size = 2
            sceneType = 'RAIN'
        } else {
            material.map = startTexture
            material.size = 5
            sceneType = 'SNOW'
        }
    }
})()

// 自訂頂點創立粒子系統
function createPoints() {
    const geometry = new THREE.Geometry()

    material = new THREE.PointsMaterial({
        size: 5,
        map: startTexture,
        // 載入的貼圖去背
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.5,
    })
    // 將每一個頂點的（x, y, z）值分別設定在介於（-300, 300）的隨機值
    // 類似邊長為 600 的正立方體粒子群
    const range = 300
    for (let i = 0; i < particleCount; i++) {
        const x = THREE.Math.randInt(-range / 2, range / 2)
        const y = THREE.Math.randInt(0, range * 20)
        const z = THREE.Math.randInt(-range / 2, range / 2)
        const point = new THREE.Vector3(x, y, z)
        // !!
        // todo粒子橫向移動速度
        point.velocityX = THREE.Math.randFloat(-0.16, 0.16)
        // todo粒子縱向移動速度
        point.velocityY = THREE.Math.randFloat(0.1, 0.3)
        geometry.vertices.push(point)
    }
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

function initStats() {
    const stats = new Stats()
    stats.setMode(0)
    document.getElementById('stats').appendChild(stats.domElement)
    return stats
}

function init() {
    // scene
    scene = new THREE.Scene()
    // 霧化效果，可以讓極遠處的粒子有種模糊美，而相機視角及位置稍微拉大拉遠來觀察更多的粒子
    scene.fog = new THREE.FogExp2(0x000000, 0.0008)
    // camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(-100, 100, 200)
    camera.lookAt(scene.position)
    // stats
    stats = initStats()
    // helper
    // let axes = new THREE.AxesHelper(20)
    // scene.add(axes)

    // renderer
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x111111, 1.0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = 2
    // orbitControls
    // enableDamping 與 dampingFactor 效果可以理解為在拖移旋轉時的「滑鼠靈敏度」；
    cameraControl = new OrbitControls(camera, renderer.domElement)
    cameraControl.enableDamping = true
    cameraControl.dampingFactor = 0.25

    // 簡單地板
    const planeGeometry = new THREE.PlaneGeometry(300, 300)
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(0, -7, 0)
    plane.receiveShadow = true
    plane.name = 'floor'
    scene.add(plane)

    createCreeper()

    createPoints()
    // LIght-環境光
    let ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)
    // Light-聚光燈
    let spotLight = new THREE.SpotLight(0xf0f0f0)
    spotLight.position.set(-10, 30, 20)
    // scene.add(spotLight)

    // Light-點光源
    pointLight = new THREE.PointLight(0xf0f0f0, 1, 100)
    pointLight.castShadow = true
    pointLight.position.set(-30, 30, 30)
    scene.add(pointLight)

    // 控制版
    gui = new dat.GUI()
    gui.add(datGUIControls, 'togglePlayMusic')
    gui.add(datGUIControls, 'changeScene')
    gui.add(datGUIControls, 'startTracking').onChange(function (e) {
        startTracking = e
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
                tweenBack.stop()
            }
        }
    })

    document.body.appendChild(renderer.domElement)
}
function tweenHandler() {
    let offset = { x: 0, z: 0, rotateY: 0 }
    let target = { x: 100, z: 100, rotateY: 0.7853981633974484 } // 目標值

    // 苦力怕走動及轉身補間動畫
    const onUpdate = () => {
        // 移動
        creeperObj.feet.position.x = offset.x
        creeperObj.feet.position.z = offset.z
        creeperObj.head.position.x = offset.x
        creeperObj.head.position.z = offset.z
        creeperObj.body.position.x = offset.x
        creeperObj.body.position.z = offset.z
        pointLight.position.x = offset.x - 20
        pointLight.position.z = offset.z + 20

        // 轉身
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

    // 計算新的目標值
    const handleNewTarget = () => {
        // 限制苦力怕走路邊界
        const range = 100
        if (camera.position.x > range) target.x = range
        else if (camera.position.x < -range) target.x = -range
        else target.x = camera.position.x
        if (camera.position.z > range) target.z = range
        else if (camera.position.z < -range) target.z = -range
        else target.z = camera.position.z

        const v1 = new THREE.Vector2(0, 1) // 原點面向方向
        const v2 = new THREE.Vector2(target.x, target.z) // 苦力怕面向新相機方向

        // 內積除以純量得兩向量 cos 值
        let cosValue = v1.dot(v2) / (v1.length() * v2.length())

        // 防呆，cos 值區間為（-1, 1）
        if (cosValue > 1) cosValue = 1
        else if (cosValue < -1) cosValue = -1

        // cos 值求轉身角度
        target.rotateY = Math.acos(cosValue)
    }

    // 計算新的目標值
    const handleNewTweenBackTarget = () => {
        // 限制苦力怕走路邊界
        const range = 150
        const tmpX = target.x
        const tmpZ = target.z

        target.x = THREE.Math.randFloat(-range, range)
        target.z = THREE.Math.randFloat(-range, range)

        const v1 = new THREE.Vector2(tmpX, tmpZ)
        const v2 = new THREE.Vector2(target.x, target.z)

        // 內積除以純量得兩向量 cos 值
        let cosValue = v1.dot(v2) / (v1.length() * v2.length())

        // 防呆，cos 值區間為（-1, 1）
        if (cosValue > 1) cosValue = 1
        else if (cosValue < -1) cosValue = -1

        // cos 值求轉身角度
        target.rotateY = Math.acos(cosValue)
    }

    // 朝相機移動
    tween = new TWEEN.Tween(offset)
        .to(target, 15000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(onUpdate)
        .onComplete(() => {
            handleNewTweenBackTarget()
            invert = -1
            tweenBack.start()
        })

    // 隨機移動
    tweenBack = new TWEEN.Tween(offset)
        .to(target, 15000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(onUpdate)
        .onComplete(() => {
            handleNewTarget() // 計算新的目標值
            invert = 1
            tween.start()
        })
}

// 苦力怕原地走動動畫
function creeperFeetWalk() {
    walkSpeed += 100
    creeperObj.foot1.rotation.x = Math.sin(walkSpeed) / 4 // 前腳左
    creeperObj.foot2.rotation.x = -Math.sin(walkSpeed) / 4 // 後腳左
    creeperObj.foot3.rotation.x = -Math.sin(walkSpeed) / 4 // 前腳右
    creeperObj.foot4.rotation.x = Math.sin(walkSpeed) / 4 // 後腳左
}

function pointsAnimation() {
    points.geometry.vertices.forEach(function (v) {
        if (v.y >= -7) {
            v.x = v.x - v.velocityX
            v.y = v.y - v.velocityY
        }
        if (v.x <= -150 || v.x >= 150) v.velocityX = v.velocityX * -1
        if (v.y <= -7) {
            ;(material.depthTest = true), (material.depthWrite = false)
        }
    })

    // console.log(points.geometry)
    points.geometry.verticesNeedUpdate = true
}

function render() {
    stats.update()
    cameraControl.update()
    creeperFeetWalk()
    pointsAnimation()
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
