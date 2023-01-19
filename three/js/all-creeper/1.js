let scene, renderer, camera
let cube

// 初始化場景+渲染器+相機+物體
function init() {
    // todo建立場景
    scene = new THREE.Scene()

    //建立渲染器
    renderer = new THREE.WebGLRenderer()
    // 場景大小
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 預設背景顏色預設，背景顏色不設的話預設就是黑色（0x000000）
    renderer.setClearColor(0xeeeeee, 1.0)
    // 陰影效果
    renderer.shadowMap.enable = true

    // 將渲染器DOM綁到網頁上
    document.body.appendChild(renderer.domElement)

    //todo 建立相機(透視投影相機PerspectiveCamera)
    // 視角（fov, field of view）：又稱為視野、視場，指的是我們能從畫面上看到的視野範圍，一般在遊戲中會設定在 60 ~ 90 度。
    // 畫面寬高比（aspect）：渲染結果的畫面比例，一般都是使用 window.innerWidth / window.innerHeight 。
    // 近面距離（near）：從距離相機多近的地方開始渲染，一般推薦使用 0.1
    // 遠面距離（far）：相機能看得多遠，一般推薦使用 1000，可視需求調整，設置過大會影響效能。
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)

    // camera.lookAt ，這個屬性是指相機會盯著何處，一般靜止觀察的相機都是設定為 camera.lookAt(scene.position)，
    // 就是觀察場景固定的位置。但若今天你要讓相機動態追蹤某個物體，那你可以在渲染時改變 camera.lookeAt 中的參數為特定物體的某個基準座標

    // 相機位置
    camera.position.set(10, 10, 10)
    // 相機焦點
    camera.lookAt(scene.position)

    // todo建立光源
    let pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(10, 10, -10)
    scene.add(pointLight)

    // todo建立物體
    // 這邊幾何體使用四方體的 THREE.BoxGeometry、材質設定為馮氏材質，此種材質會受光源影響它的表面
    // 幾何體
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    // 材質
    const material = new THREE.MeshPhongMaterial({
        color: 0xacacff,
    })
    // 建立網格物件
    // 一般建立物體的 SOP 就是宣告形狀（geometry）、材質（material），然後用這兩個要素建立一個網格物件（mesh），並設定其位置加到場景中便可完成。
    cube = new THREE.Mesh(geometry, material)
    cube.position.set(0, 0, 0)
    scene.add(cube)
}
// 建立動畫
function animate() {
    cube.rotation.x += 0.02
    cube.rotation.y += 0.02
}
// 渲染場景
function render() {
    animate()
    // requestAnimationFrame，就需要處理「每隔一段時間重新渲染場景」的工作
    // requestAnimationFrame 是 HTML5 中瀏覽器提供的一個為動畫而生的接口，它能讓畫面盡可能平滑、高效地進行重新渲染，還有效節省 CPU、GPU 資源，所以一般在 Three.js 會透過它來幫忙重新渲染場景。
    // 在 requestAnimationFrame 中，我們放入了 render 當作它的 callback function，讓場景能不斷的被重新渲染，使得動畫能持續地進行下去。s
    requestAnimationFrame(render)
    renderer.render(scene, camera)
}
// RWD
// 最後針對每次瀏覽器視窗寬高有變化時，要能有 RWD 的效果，就需要在監聽螢幕尺寸有變化時，須告訴相機與場景新的寬高比，如此一來，不管怎麼調整視窗寬高，都能讓這個正方體一直維持在畫面中旋轉。
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
init()
render()
