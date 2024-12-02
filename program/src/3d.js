import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Pathfinding, PathfindingHelper } from 'three-pathfinding';
import { start, targets } from './const';

const floors = ['1ST_FLOOR', '2ND_FLOOR', '3RD_FLOOR', '4TH_FLOOR', '5TH_FLOOR'];

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;

document.body.appendChild(renderer.domElement);

export const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 200);
camera.position.set(100, 470, -300);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    RIGHT: THREE.MOUSE.PAN,
};
orbitControls.enableDamping = true;
orbitControls.enablePan = true;
// orbitControls.minDistance = 20;
orbitControls.minDistance = 0;
orbitControls.maxDistance = 200;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05; // prevent camera below ground
orbitControls.minPolarAngle = Math.PI / 4; // prevent top down view
orbitControls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0); // Upper color is white, lower is gray
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = false;
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight2.position.set(-5, 10, -7.5);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight3.position.set(7.5, -10, 5);
scene.add(directionalLight3);

const directionalLight4 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight4.position.set(-7.5, -10, -5);
scene.add(directionalLight4);

const pointLight = new THREE.PointLight(0xffffff, 5, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let capGroup = new THREE.Group();
let citGroup = new THREE.Group();
let coeGroup = new THREE.Group();
let cosGroup = new THREE.Group();
let esepGroup = new THREE.Group();
let gaptGroup = new THREE.Group();
let irtcGroup = new THREE.Group();
let ripGroup = new THREE.Group();
let allGroup = new THREE.Group();

let currentFloor = 1;
let currentBuilding = 'ALL';
const pathfinding = new Pathfinding();
const pathfindinghelper = new PathfindingHelper();

const ZONE = '1';
const SPEED = 5;
const navmesh = {
    cap: null,
    cit: null,
    coe: null,
    cos: null,
    esep: null,
    gapt: null,
    irtc: null,
    rip: null,
    all: null,
};
let groupID;
let navpath;

const loader = new GLTFLoader();

scene.add(pathfindinghelper);

scene.add(capGroup);
scene.add(citGroup);
scene.add(coeGroup);
scene.add(cosGroup);
scene.add(esepGroup);
scene.add(gaptGroup);
scene.add(irtcGroup);
scene.add(ripGroup);
scene.add(allGroup);

// CAP MODEL
loader.load(
    '../res/CAP BLDG/model.glb',
    function (gltf) {
        const model = gltf.scene;
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        capGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
loader.load(
    '../res/CAP BLDG/nav.glb',
    function (gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isObject3D && node.children && node.children.length > 0) {
                navmesh.cap = node.children;
            }
        });
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        capGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
// CIT MODEL
loader.load(
    '../res/CIT/nav.glb',
    function (gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isObject3D && node.children && node.children.length > 0) {
                navmesh.cit = node.children;
            }
        });
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        model.getObjectByName('3RD_FLOOR').visible = false;
        citGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
loader.load(
    '../res/CIT/model.glb',
    function (gltf) {
        const model = gltf.scene;
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        model.getObjectByName('3RD_FLOOR').visible = false;
        citGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
// COE MODEL
loader.load(
    '../res/COE/model.glb',
    function (gltf) {
        const model = gltf.scene;
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        model.getObjectByName('3RD_FLOOR').visible = false;
        model.getObjectByName('4TH_FLOOR').visible = false;
        coeGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
loader.load(
    '../res/COE/nav.glb',
    function (gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isObject3D && node.children && node.children.length > 0) {
                navmesh.coe = node.children;
            }
        });
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        model.getObjectByName('3RD_FLOOR').visible = false;
        model.getObjectByName('4TH_FLOOR').visible = false;
        coeGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
// COS MODEL
loader.load(
    '../res/COS CLA/model.glb',
    function (gltf) {
        const model = gltf.scene;

        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        // model.getObjectByName('3RD_FLOOR').visible = false;
        cosGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
loader.load(
    '../res/COS CLA/nav.glb',
    function (gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isObject3D && node.children && node.children.length > 0) {
                navmesh.cos = node.children;
            }
        });

        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        // model.getObjectByName('3RD_FLOOR').visible = false;
        cosGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
// ESEP MODEL
loader.load(
    '../res/ESEP/model.glb',
    function (gltf) {
        const model = gltf.scene;
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        esepGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
loader.load(
    '../res/ESEP/nav.glb',
    function (gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isObject3D && node.children && node.children.length > 0) {
                navmesh.esep = node.children;
            }
        });
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        esepGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
// GAPT MODEL
loader.load(
    '../res/GAPT/model.glb',
    function (gltf) {
        const model = gltf.scene;
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        gaptGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
loader.load(
    '../res/GAPT/nav.glb',
    function (gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isObject3D && node.children && node.children.length > 0) {
                navmesh.gapt = node.children;
            }
        });
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        gaptGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
// IRTC MODEL
loader.load(
    '../res/IRTC/model.glb',
    function (gltf) {
        const model = gltf.scene;
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        model.getObjectByName('4TH_FLOOR').visible = false;
        model.getObjectByName('5TH_FLOOR').visible = false;
        irtcGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
loader.load(
    '../res/IRTC/nav.glb',
    function (gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isObject3D && node.children && node.children.length > 0) {
                navmesh.irtc = node.children;
            }
        });
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        model.getObjectByName('4TH_FLOOR').visible = false;
        model.getObjectByName('5TH_FLOOR').visible = false;
        irtcGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
// RIPALDA MODEL
loader.load(
    '../res/RIPALDA/model.glb',
    function (gltf) {
        const model = gltf.scene;
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        model.getObjectByName('3RD_FLOOR').visible = false;
        ripGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
loader.load(
    '../res/RIPALDA/nav.glb',
    function (gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isObject3D && node.children && node.children.length > 0) {
                navmesh.rip = node.children;
            }
        });
        model.getObjectByName('1ST_FLOOR').visible = false;
        model.getObjectByName('2ND_FLOOR').visible = false;
        model.getObjectByName('3RD_FLOOR').visible = false;
        ripGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
// TUP MODEL
loader.load(
    '../res/TUP MAP/model.glb',
    function (gltf) {
        const model = gltf.scene;
        // model.getObjectByName('1ST_FLOOR').visible = false;
        // model.getObjectByName('2ND_FLOOR').visible = false;
        allGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
loader.load(
    '../res/TUP MAP/nav.glb',
    function (gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isObject3D && node.children && node.children.length > 0) {
                navmesh.all = node.children;
            }
        });
        allGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
export function showModel(model) {
    if (model === 'CAP') {
        capGroup.visible = true;
        citGroup.visible = false;
        coeGroup.visible = false;
        cosGroup.visible = false;
        esepGroup.visible = false;
        gaptGroup.visible = false;
        irtcGroup.visible = false;
        ripGroup.visible = false;
        allGroup.visible = false;
    } else if (model === 'CIT') {
        capGroup.visible = false;
        citGroup.visible = true;
        coeGroup.visible = false;
        cosGroup.visible = false;
        esepGroup.visible = false;
        gaptGroup.visible = false;
        irtcGroup.visible = false;
        ripGroup.visible = false;
        allGroup.visible = false;
    } else if (model === 'COE') {
        capGroup.visible = false;
        citGroup.visible = false;
        coeGroup.visible = true;
        cosGroup.visible = false;
        esepGroup.visible = false;
        gaptGroup.visible = false;
        irtcGroup.visible = false;
        ripGroup.visible = false;
        allGroup.visible = false;
    } else if (model === 'COS') {
        capGroup.visible = false;
        citGroup.visible = false;
        coeGroup.visible = false;
        cosGroup.visible = true;
        esepGroup.visible = false;
        gaptGroup.visible = false;
        irtcGroup.visible = false;
        ripGroup.visible = false;
        allGroup.visible = false;
    } else if (model === 'ESEP') {
        capGroup.visible = false;
        citGroup.visible = false;
        coeGroup.visible = false;
        cosGroup.visible = false;
        esepGroup.visible = true;
        gaptGroup.visible = false;
        irtcGroup.visible = false;
        ripGroup.visible = false;
        allGroup.visible = false;
    } else if (model === 'GAPT') {
        capGroup.visible = false;
        citGroup.visible = false;
        coeGroup.visible = false;
        cosGroup.visible = false;
        esepGroup.visible = false;
        gaptGroup.visible = true;
        irtcGroup.visible = false;
        ripGroup.visible = false;
        allGroup.visible = false;
    } else if (model === 'IRTC') {
        capGroup.visible = false;
        citGroup.visible = false;
        coeGroup.visible = false;
        cosGroup.visible = false;
        esepGroup.visible = false;
        gaptGroup.visible = false;
        irtcGroup.visible = true;
        ripGroup.visible = false;
        allGroup.visible = false;
    } else if (model === 'RIP') {
        capGroup.visible = false;
        citGroup.visible = false;
        coeGroup.visible = false;
        cosGroup.visible = false;
        esepGroup.visible = false;
        gaptGroup.visible = false;
        irtcGroup.visible = false;
        ripGroup.visible = true;
        allGroup.visible = false;
    } else {
        capGroup.visible = false;
        citGroup.visible = false;
        coeGroup.visible = false;
        cosGroup.visible = false;
        esepGroup.visible = false;
        gaptGroup.visible = false;
        irtcGroup.visible = false;
        ripGroup.visible = false;
        allGroup.visible = true;
    }
}
const agentHeight = 1;
const agentRadius = 0.1;
const agent = new THREE.Mesh(new THREE.CylinderGeometry(agentRadius, agentRadius, agentHeight), new THREE.MeshPhongMaterial({ color: 'green' }));
agent.position.y = agentHeight / 2;
const agentGroup = new THREE.Group();

agentGroup.add(agent);

agentGroup.position.set(start[currentBuilding][currentFloor].x, start[currentBuilding][currentFloor].y, start[currentBuilding][currentFloor].z);

scene.add(agentGroup);
showModel(currentBuilding);

const raycaster = new THREE.Raycaster(); // create once
const clickMouse = new THREE.Vector2(); // create once

function intersect(pos) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects([navmesh[currentBuilding.toLowerCase()][currentFloor - 1]]);
}
window.addEventListener('click', (event) => {
    // THREE RAYCASTER
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    pathfinding.setZoneData(ZONE, Pathfinding.createZone(navmesh[currentBuilding.toLowerCase()][currentFloor - 1].geometry));
    const found = intersect(clickMouse);
    if (found.length > 0) {
        // let target = targets.CIT[1].ROOM1;
        let target = found[0].point;
        const agentpos = agentGroup.position;
        // console.log(`agentpos: ${JSON.stringify(agentpos)}`);
        console.log(`target: ${JSON.stringify(target)}`);

        groupID = pathfinding.getGroup(ZONE, agentGroup.position);
        // console.log('Zone Data:', groupID);
        // find closest node to agent, just in case agent is out of bounds
        const clampedAgentPosition = pathfinding.getClosestNode(agentGroup.position, ZONE, groupID)?.centroid || agentGroup.position;
        const clampedTargetPosition = pathfinding.getClosestNode(target, ZONE, groupID)?.centroid || target;

        navpath = pathfinding.findPath(clampedAgentPosition, clampedTargetPosition, ZONE, groupID);
        if (navpath) {
            pathfindinghelper.reset();
            pathfindinghelper.setPlayerPosition(agentpos);
            pathfindinghelper.setTargetPosition(target);
            pathfindinghelper.setPath(navpath);
        }
    }
});

// MOVEMENT ALONG PATH
function move(delta) {
    if (!navpath || navpath.length <= 0) return;

    let targetPosition = navpath[0];
    const distance = targetPosition.clone().sub(agentGroup.position);

    if (distance.lengthSq() > 0.05 * 0.05) {
        distance.normalize();
        // Move player to target
        agentGroup.position.add(distance.multiplyScalar(delta * SPEED));
    } else {
        // Remove node from the path we calculated
        navpath.shift();
    }
}

const clock = new THREE.Clock();
function animate() {
    move(clock.getDelta());
    orbitControls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// const size = 100; // Size of the grid
// const divisions = 150; // Number of divisions

// // XY Plane Grid (XZ Grid)
// const xyGrid = new THREE.GridHelper(size, divisions, 0x00ff00, 0x00ff00);
// xyGrid.rotation.x = Math.PI / 2; // Align with XY plane
// scene.add(xyGrid);

// // XZ Plane Grid (Default)
// const xzGrid = new THREE.GridHelper(size, divisions, 0xff0000, 0xff0000);
// scene.add(xzGrid);

// // YZ Plane Grid
// const yzGrid = new THREE.GridHelper(size, divisions, 0x0000ff, 0x0000ff);
// yzGrid.rotation.z = Math.PI / 2; // Align with YZ plane
// scene.add(yzGrid);

// // Axes Helper
// const axesHelper = new THREE.AxesHelper(size / 2); // Adds X, Y, Z axes
// scene.add(axesHelper);
