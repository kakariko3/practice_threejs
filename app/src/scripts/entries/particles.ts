import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

import '../../css/particles.scss';

const texture1 = require('../../textures/particles/1.png');

//UIデバッグ
const gui = new GUI();

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 2);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

/**
 * テクスチャ設定
 */
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load(texture1);

/**
 * パーティクルを作ってみよう
 */
// ジオメトリ
const particlesGeometry = new THREE.BufferGeometry();

// マテリアル
const pointsMaterial = new THREE.PointsMaterial({
  size: 0.15,
  transparent: true,
  alphaMap: particlesTexture,
  depthWrite: false,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
});

const count = 5000;
const positionArray = new Float32Array(count * 3);
const colorArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
  colorArray[i] = Math.random();
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

// メッシュ
const particles = new THREE.Points(particlesGeometry, pointsMaterial);
scene.add(particles);

//マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener('resize', onWindowResize);

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

animate();
