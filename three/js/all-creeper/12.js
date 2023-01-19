let renderer, scene, camera
let cameraControl, stats, gui
// point
const pointCount = 10000
const movementSpeed = 20

let explosion
let size = 20

const textureLoader = new THREE.TextureLoader()
const smokeTexture = textureLoader.load('./star.png')

function initStats() {
    const stats = new Stats()
    stats.setMode(0)
    document.getElementById('stats').appendChild(stats.domElement)
    return stats
}
// gui
let controls = new (function () {
    this.explosionTrigger = function () {
        if (explosion) {
            explosion.destroy()
        }
        explosion = new Explosion(0, 0)
    }
    this.pointSize = 20
    this.cameraNear = 500
})()

// 建立粒子系統

class Explosion {
    constructor(x, y) {
        const geometry = new THREE.Geometry()

        this.material = new THREE.PointsMaterial({
            size: size,
            color: new THREE.Color(Math.random() * 0xffffff),
            map: smokeTexture,
            blending: THREE.AdditiveBlending,
            depthTest: false,
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
function init() {
    // scene
    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.0008)
    // camera
    // 視角（fov, field of view）：又稱為視野、視場，指的是我們能從畫面上看到的視野範圍，一般在遊戲中會設定在 60 ~ 90 度。
    // 畫面寬高比（aspect）：渲染結果的畫面比例，一般都是使用 window.innerWidth / window.innerHeight 。
    // 近面距離（near）：從距離相機多近的地方開始渲染，一般推薦使用 0.1
    // 遠面距離（far）：相機能看得多遠，一般推薦使用 1000，可視需求調整，設置過大會影響效能。
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 500, 5000)
    camera.position.set(0, 0, 1000)
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

    // dat.GUI
    gui = new dat.GUI()
    gui.add(controls, 'explosionTrigger')
    gui.add(controls, 'pointSize', 10, 200).onChange((e) => {
        size = e
    })
    gui.add(controls, 'cameraNear', 1, 1000).onChange((near) => {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, near, 5000)
        camera.position.set(0, 0, 1000)
        camera.lookAt(scene.position)
    })
    document.body.appendChild(renderer.domElement)
}
function render() {
    // 作一個 method 用來做爆炸的動畫 update()，方法就是每個頂點依據自己的噴射方向屬性一直疊加，最後會漸漸淡出視野可見範圍，達到爆炸的效果。
    if (explosion) {
        explosion.update()
    }
    stats.update()
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
