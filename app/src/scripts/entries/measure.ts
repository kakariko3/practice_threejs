// import * as THREE from 'three';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Raycaster,
  BufferGeometry,
  BoxBufferGeometry,
  SphereGeometry,
  Mesh,
  MeshNormalMaterial,
  MeshBasicMaterial,
  Line,
  LineBasicMaterial,
  AmbientLight,
  Vector2,
  Vector3,
  BufferAttribute,
  Object3D,
} from 'three';
// import WEBGL from 'three/examples/jsm/capabilities/WebGL';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Projector } from 'three/examples/jsm/renderers/Projector';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

// WebGL互換性チェック
// if (WEBGL.isWebGLAvailable() === false) {
//   document.body.appendChild(WEBGL.getWebGLErrorMessage());
// }

// 変数宣言
let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls,
  stats: Stats,
  projector: Projector,
  raycaster: Raycaster,
  mouseHelper: Mesh,
  spStart: Mesh,
  spEnd: Mesh,
  sConnection: Line;
let mouse = new Vector2(); //{ x: 1, y: 1 };
let p0 = new Vector3(1, 1, 0);
let p1 = new Vector3(1, -1, 0);
let placeStartMode = false;
let placeEndMode = false;
const objects: Object3D[] = [];
// const objects: Mesh[] = [];
const container = document.getElementById('container');
console.log('container: ', container);

// init関数(初期値を設定)
function init() {
  projector = new Projector();
  raycaster = new Raycaster();

  // Renderer ------------------------------------------------------------
  renderer = new WebGLRenderer({ antialias: true }); //<canvas>要素をつくる
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setClearColor(0xeeeeee, 1); // 背景を白く
  if (container) {
    container.appendChild(renderer.domElement); //container.
  }

  // Stat:Display FPS ----------------------------------------------------
  stats = Stats();
  // stats = new Stats();
  //container.appendChild( stats.dom );

  // Scene ---------------------------------------------------------------
  scene = new Scene();
  //scene.background = new THREE.Color( 0x000000 );

  // Camera --------------------------------------------------------------
  camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 100);
  camera.position.set(0, -0.2, 0);
  camera.up.set(0, 0, 1);
  // camera.lookAt({ x: 0, y: 0, z: 0 } as any);
  camera.lookAt(new Vector3(0, 0, 0));
  controls = new OrbitControls(camera, renderer.domElement); //TrackballControls
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.5;
  controls.panSpeed = 0.2;
  //controls.noZoom = false;
  //controls.noPan = true;
  //controls.staticMoving = false;
  //controls.dynamicDampingFactor = 0.3;
  //controls.minDistance = 0.3;
  //controls.maxDistance = 0.3 * 100;

  // Light ---------------------------------------------------------------
  const ambientLight = new AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  // Mouse Helper --------------------------------------------------------
  mouseHelper = new Mesh(new BoxBufferGeometry(1, 1, 10), new MeshNormalMaterial());
  mouseHelper.visible = false;
  scene.add(mouseHelper);

  // Measurement Object --------------------------------------------------
  const lineGeometry = new BufferGeometry();
  const vertices = new Float32Array([
    p0.clone().x,
    p0.clone().y,
    p0.clone().z,
    p1.clone().x,
    p1.clone().y,
    p1.clone().z,
  ]);
  lineGeometry.setAttribute('position', new BufferAttribute(vertices, 3));
  // var lineGeometry = new THREE.Geometry();
  // lineGeometry.vertices.push(p0.clone(), p1.clone());
  const lineMaterial = new LineBasicMaterial({ color: 0xff0000, linewidth: 2.0 });
  sConnection = new Line(lineGeometry, lineMaterial);
  scene.add(sConnection);

  const geometry = new SphereGeometry(0.03, 32, 32);
  const material = new MeshBasicMaterial({ color: 0xff0000 });
  spStart = new Mesh(geometry, material);
  spStart.position.set(p0.x, p0.y, p0.z);
  scene.add(spStart);
  spEnd = new Mesh(geometry, material);
  spEnd.position.set(p1.x, p1.y, p1.z);
  scene.add(spEnd);

  /*
  // Point Cloud ---------------------------------------------------------
  var loader = new THREE.PCDLoader();
  loader.load( 'testmodels/data.pcd', function ( pcd ) {
    pcd.material.size = 0.01;
    pcd.material.color.setHex( 0xffffff );
    //scene.add( pcd );
    //var center = pcd.geometry.boundingSphere.center;
    ///controls.target.set( center.x, center.y, center.z );
    //controls.update();
  } );
  */

  // MTL, OBJ ------------------------------------------------------------
  const onProgress = (xhr: ProgressEvent) => {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete) + '% downloaded');
    }
  };
  const onError = (event: any) => {
    console.error('モデルの読み込みに失敗しました');
    var xhr = event.target;
    if (xhr) {
      console.error(xhr.responseURL + ' status:' + xhr.status + '(' + xhr.statusText + ')');
    }
  };
  // var onProgress = function (xhr) {
  //   if (xhr.lengthComputable) {
  //     var percentComplete = (xhr.loaded / xhr.total) * 100;
  //     console.log(Math.round(percentComplete, 2) + '% downloaded');
  //   }
  // };
  // var onError = function () {};
  new MTLLoader()
    .setPath('/public/models/')
    // .setPath(`../models/${groupId}/${userId}/${sessionId}/`)
    .load('mesh3d.mtl', function (materials) {
      materials.preload();
      new OBJLoader()
        .setMaterials(materials)
        .setPath('/public/models/')
        // .setPath(`../models/${groupId}/${userId}/${sessionId}/`)
        .load(
          'mesh3d.obj',
          function (object) {
            let mesh: Object3D = object;
            object.traverse(function (child) {
              if (child instanceof Mesh) {
                mesh = child;
                console.log(mesh);
              }
            });
            objects.push(mesh);
            scene.add(mesh);
          },
          onProgress,
          onError
        );
    });
  // ---------------------------------------------------------------------
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
  renderer.domElement.addEventListener('click', onClick, false);
}

function onDocumentMouseMove(event: MouseEvent) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick() {
  placeStartMode = false;
  placeEndMode = false;
}

function placeStart() {
  console.log('placeStart!!');
  placeStartMode = true;
  placeEndMode = false;
}

function placeEnd() {
  console.log('placeEnd!!');
  placeStartMode = false;
  placeEndMode = true;
}

function render() {
  requestAnimationFrame(render);
  camera.updateMatrixWorld(true);
  const vector = new Vector3(mouse.x, mouse.y, 0.5);
  // projector.unprojectVector(vector, camera);
  vector.unproject(camera);
  //raycaster.params = {"PointCloud" : {threshold: 0.1}};
  //raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );
  raycaster.setFromCamera(mouse, camera);
  if (placeStartMode || placeEndMode) {
    const intersects = raycaster.intersectObjects(objects, true);
    if (intersects.length > 0) {
      const I = intersects[0];
      if (placeStartMode) {
        // spStart.position = I.point; //NG
        spStart.position.x = I.point.x;
        spStart.position.y = I.point.y;
        spStart.position.z = I.point.z;
        p0 = I.point;
      } else if (placeEndMode) {
        //spEnd.position = I.point;	//NG
        spEnd.position.x = I.point.x;
        spEnd.position.y = I.point.y;
        spEnd.position.z = I.point.z;
        p1 = I.point;
      }
      sConnection.geometry.setAttribute('position', new BufferAttribute([p0.clone().x, p0.clone().y, p0.clone().z], 3));
      sConnection.geometry.setAttribute('position', new BufferAttribute([p1.clone().x, p1.clone().y, p1.clone().z], 3));
      sConnection.geometry.attributes.position.needsUpdate = true;
      /*
      sConnection.geometry.vertices[0].copy(p0); //spStart.position
      sConnection.geometry.vertices[1].copy(p1); //spEnd.position
      sConnection.geometry.verticesNeedUpdate = true;
      */
      sConnection.geometry.computeBoundingSphere();

      const mousePosition = document.getElementById('mousePosition');
      if (mousePosition) {
        mousePosition.innerHTML =
          'Position: x' + I.point.x.toFixed(2) + ', y' + I.point.y.toFixed(2) + ', z' + I.point.z.toFixed(2);
      }
    }
  }

  // Placing distance label -------------------------------------------
  const labelPos = p0.clone().add(p1).multiplyScalar(0.5);
  //var labelPos = spStart.position.clone().add(spEnd.position).multiplyScalar(0.5);
  labelPos.project(camera);
  // projector.projectVector(labelPos, camera);
  labelPos.x = ((labelPos.x + 1) / 2) * window.innerWidth;
  labelPos.y = (-(labelPos.y - 1) / 2) * window.innerHeight;
  // console.log('labelPos: ', labelPos.x, labelPos.y);
  //var distance = spStart.position.distanceTo(spEnd.position);
  const distance = p0.distanceTo(p1);
  //console.log( 'Distance : %f',  distance );
  const lblDistance = document.getElementById('lblDistance');
  if (lblDistance) {
    lblDistance.style.left = labelPos.x.toString();
    lblDistance.style.top = labelPos.y.toString();
    lblDistance.innerHTML = 'Distance: ' + distance.toFixed(2);
  }

  stats.update();
  controls.update();
  renderer.render(scene, camera);
}

document.getElementById('placeStart')!.addEventListener('click', function () {
  placeStart();
});
document.getElementById('placeEnd')!.addEventListener('click', function () {
  placeEnd();
});

init();
render();
