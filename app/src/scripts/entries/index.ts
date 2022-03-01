import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

import '../../css/index.scss';
import '../../images/space.jpg';

const texture1 = require('../../textures/earth.jpg');

// グローバル変数を宣言
let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  pointLight: THREE.PointLight,
  controls: OrbitControls;

window.addEventListener('load', init);

function init() {
  // UIデバッグを作成
  const gui = new GUI();

  // シーンを追加
  scene = new THREE.Scene();

  // カメラを追加
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, +500);

  // テクスチャを追加
  const earthTexture = new THREE.TextureLoader().load(texture1);

  // レンダラーを作成
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // ジオメトリを作成
  const ballGeometry = new THREE.SphereGeometry(100, 64, 32);
  // マテリアルを作成
  const ballMaterial = new THREE.MeshPhysicalMaterial({ map: earthTexture });
  // メッシュ化
  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);

  // UIデバッグを追加
  const positionFolder = gui.addFolder('Position');
  const visibleFolder = gui.addFolder('Visible');
  positionFolder.add(ballMesh.position, 'x', -3, 3, 0.01).name('transformX');
  positionFolder.add(ballMesh.position, 'y').min(-3).max(3).step(0.01).name('trasformY');
  positionFolder.add(ballMesh.position, 'z').min(-3).max(3).step(0.01);
  positionFolder.add(ballMesh.rotation, 'x').min(-3).max(3).step(0.01).name('rotationX');
  visibleFolder.add(ballMesh, 'visible');
  visibleFolder.add(ballMaterial, 'wireframe');
  gui.addColor(ballMaterial, 'color');

  // 平行光源を追加
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // ポイント光源を追加
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200);
  scene.add(pointLight);

  // ポイント光源の場所を視覚化(ヘルパー)
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 20);
  scene.add(pointLightHelper);

  // マウス操作を追加(カメラ制御)
  controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener('resize', onWindowResize);

  animate();
}

// ブラウザのリサイズに対応
function onWindowResize() {
  // レンダラーのサイズを設定
  renderer.setSize(window.innerWidth, window.innerHeight);

  // カメラのアスペクト比を設定
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// アニメーションを設定
function animate() {
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500)
  );

  // レンダリング
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}
