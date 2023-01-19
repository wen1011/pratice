import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
let renderer, scene, camera
let cameraControl, stats
// points建立 15000 個頂點
const particleCount = 15000
let points

function initStats() {
    const stats = new Stats()
    stats.setMode(0)
    document.getElementById('stats').appendChild(stats.domElement)
    return stats
}
// 自訂頂點創立粒子系統
function createPoints() {
    const geometry = new THREE.Geometry()

    const texture = new THREE.TextureLoader().load('./star.png')
    let material = new THREE.PointsMaterial({
        size: 5,
        map: texture,
        // 載入的貼圖去背
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.8,
    })
    // 將每一個頂點的（x, y, z）值分別設定在介於（-250, 250）的隨機值
    // 類似邊長為 500 的正立方體粒子群
    const range = 250
    for (let i = 0; i < particleCount; i++) {
        const x = THREE.Math.randInt(-range, range)
        const y = THREE.Math.randInt(-range, range)
        const z = THREE.Math.randInt(-range, range)
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
function init() {
    // scene
    scene = new THREE.Scene()
    // 霧化效果，可以讓極遠處的粒子有種模糊美，而相機視角及位置稍微拉大拉遠來觀察更多的粒子
    scene.fog = new THREE.FogExp2(0x000000, 0.0008)
    // camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 100)
    camera.lookAt(scene.position)
    // stats
    stats = initStats()
    // helper
    // let axes = new THREE.AxesHelper(20)
    // scene.add(axes)

    // renderer
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    // orbitControls
    cameraControl = new OrbitControls(camera, renderer.domElement)
    cameraControl.enableDamping = true
    // enableDamping 與 dampingFactor 效果可以理解為在拖移旋轉時的「滑鼠靈敏度」；
    cameraControl.dampingFactor = 0.25
    createPoints()

    document.body.appendChild(renderer.domElement)
}
function pointsAnimation() {
    points.geometry.vertices.forEach(function (v) {
        v.y = v.y - v.velocityY
        v.x = v.x - v.velocityX
        if (v.y <= -250) v.y = 250
        if (v.x <= -250 || v.x >= 250) v.velocityX = v.velocityX * -1
    })
    // !!告訴渲染器需更新頂點位置
    points.geometry.verticesNeedUpdate = true
}
function render() {
    pointsAnimation()
    stats.update()
    requestAnimationFrame(render)
    cameraControl.update()
    renderer.render(scene, camera)
}

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
render()
