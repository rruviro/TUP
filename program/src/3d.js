import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Pathfinding, PathfindingHelper } from 'three-pathfinding';
import { all, start, targets } from './const';
const loadingScreen = document.createElement('div');
loadingScreen.style.position = 'fixed';
loadingScreen.style.top = '0';
loadingScreen.style.left = '0';
loadingScreen.style.width = '100%';
loadingScreen.style.height = '100%';
loadingScreen.style.backgroundColor = '#000'; // Black background
loadingScreen.style.color = '#fff'; // White text
loadingScreen.style.display = 'flex';
loadingScreen.style.justifyContent = 'center';
loadingScreen.style.alignItems = 'center';
loadingScreen.style.fontSize = '24px';
loadingScreen.innerText = 'Loading...';
document.body.appendChild(loadingScreen);

// Loading manager
const loadingManager = new THREE.LoadingManager();

// Show progress
loadingManager.onProgress = (url, loaded, total) => {
    loadingScreen.innerText = `Loading: ${Math.round((loaded / total) * 100)}%`;
};

// When loading is complete
loadingManager.onLoad = () => {
    loadingScreen.style.display = 'none'; // Hide the loading screen
};

// When an error occurs
loadingManager.onError = (url) => {
    console.error(`Error loading ${url}`);
    loadingScreen.innerText = `Error loading resources.`;
};
const floors = ['1ST_FLOOR', '2ND_FLOOR', '3RD_FLOOR', '4TH_FLOOR', '5TH_FLOOR'];

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf4f4f4);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;

document.body.appendChild(renderer.domElement);

export const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(100, 470, -300);
// camera.up.set(0, 0, -1);

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
// orbitControls.minPolarAngle = Math.PI / 4; // prevent top down view
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
let cafaGroup = new THREE.Group();
let allGroup = new THREE.Group();

const pathfinding = new Pathfinding();
const pathfindinghelper = new PathfindingHelper();

const ZONE = '1';
const SPEED = 1;
const navmesh = {
    cap: null,
    cit: null,
    coe: null,
    cos: null,
    esep: null,
    gapt: null,
    irtc: null,
    rip: null,
    cafa: null,
    all: null,
};
let groupID;
let navpath;

const loader = new GLTFLoader(loadingManager);

scene.add(pathfindinghelper);

scene.add(capGroup);
scene.add(citGroup);
scene.add(coeGroup);
scene.add(cosGroup);
scene.add(esepGroup);
scene.add(gaptGroup);
scene.add(irtcGroup);
scene.add(ripGroup);
scene.add(cafaGroup);
scene.add(allGroup);

// CAP MODEL
loader.load(
    '../res/CAP BLDG/model.glb',
    function (gltf) {
        const model = gltf.scene;
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
        model.visible = false;
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
        model.visible = false;
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
        model.visible = false;
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
        model.visible = false;
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
        model.visible = false;
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
        model.visible = false;
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
        model.visible = false;
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
        model.visible = false;
        ripGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
// CAFA MODEL
loader.load(
    '../res/CAFA/model.glb',
    function (gltf) {
        const model = gltf.scene;
        cafaGroup.add(model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
loader.load(
    '../res/CAFA/nav.glb',
    function (gltf) {
        const model = gltf.scene;
        model.traverse((node) => {
            if (node.isObject3D && node.children && node.children.length > 0) {
                navmesh.cafa = node.children;
            }
        });
        model.visible = false;
        cafaGroup.add(model);
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
        model.visible = false;
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
        cafaGroup.visible = false;
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
        cafaGroup.visible = false;
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
        cafaGroup.visible = false;
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
        cafaGroup.visible = false;
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
        cafaGroup.visible = false;
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
        cafaGroup.visible = false;
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
        cafaGroup.visible = false;
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
        cafaGroup.visible = false;
        allGroup.visible = false;
    } else if (model === 'CAFA') {
        capGroup.visible = false;
        citGroup.visible = false;
        coeGroup.visible = false;
        cosGroup.visible = false;
        esepGroup.visible = false;
        gaptGroup.visible = false;
        irtcGroup.visible = false;
        ripGroup.visible = false;
        cafaGroup.visible = true;
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
        cafaGroup.visible = false;
        allGroup.visible = true;
    }
}
const agentHeight = 1;
const agentRadius = 0.1;
const agent = new THREE.Mesh(new THREE.CylinderGeometry(agentRadius, agentRadius, agentHeight), new THREE.MeshPhongMaterial({ color: 'green' }));
agent.position.y = agentHeight / 2;
const agentGroup = new THREE.Group();
const agentSize = Math.max(agentGroup.scale.x, agentGroup.scale.z);
const margin = agentSize * 0.5;

agentGroup.add(agent);
export async function updateAnimation() {
    showModel('ALL');
    await moveToBuilding('ALL', currentBuilding);
    showModel(currentBuilding);
    const keysArray = Object.keys(start[currentBuilding]);
    const count = keysArray.length;
    for (let t = 0; t < count; t++) {
        scene.getObjectByName(floors[t] + currentBuilding).visible = false;
    }
    for (let i = 1; i <= endFloor; i++) {
        await moveToTarget(i); // Wait for the agent to reach the target for each floor
    }
    currentFloor = 1;
    currentBuilding = 'ALL';
    endFloor = 1;
    endRoom = 1;
}

async function moveToBuilding(curBuilding, to) {
    return new Promise((resolve) => {
        // Validate inputs
        if (!start[curBuilding] || !navmesh[curBuilding.toLowerCase()] || !all[to]) {
            console.error('Invalid inputs for moveToBuilding.');
            resolve();
            return;
        }

        // Set agent's starting position
        agentGroup.position.set(start[curBuilding][1].x, start[curBuilding][1].y, start[curBuilding][1].z);

        // Set pathfinding zone data
        pathfinding.setZoneData(ZONE, Pathfinding.createZone(navmesh[curBuilding.toLowerCase()][0].geometry));

        // Determine target
        let target = all[to];

        const agentpos = agentGroup.position;
        groupID = pathfinding.getGroup(ZONE, agentGroup.position);

        // Find closest nodes for the agent and target
        const clampedAgentPosition = pathfinding.getClosestNode(agentGroup.position, ZONE, groupID)?.centroid || agentGroup.position;
        const clampedTargetPosition = pathfinding.getClosestNode(target, ZONE, groupID)?.centroid || target;

        // Compute the navigation path
        navpath = pathfinding.findPath(clampedAgentPosition, clampedTargetPosition, ZONE, groupID);

        if (navpath) {
            // Pathfinding helper
            pathfindinghelper.reset();
            pathfindinghelper.setPlayerPosition(agentpos);
            pathfindinghelper.setTargetPosition(target);
            pathfindinghelper.setPath(navpath);

            // Animate the agent movement
            const clock = new THREE.Clock();
            function animateMovement() {
                const delta = clock.getDelta();

                if (!navpath || navpath.length === 0) {
                    resolve(); // Resolve the promise when movement is complete
                    return;
                }

                const targetPosition = navpath[0];
                const distance = targetPosition.clone().sub(agentGroup.position);

                if (distance.length() > 0.01) {
                    // Smooth movement using lerp
                    agentGroup.position.lerp(targetPosition, delta * SPEED);
                } else {
                    navpath.shift(); // Remove the reached node from the path
                }

                requestAnimationFrame(animateMovement);
            }
            animateMovement();
        } else {
            resolve(); // Resolve immediately if no path is found
        }
    });
}

async function moveToTarget(floor) {
    return new Promise((resolve) => {
        // Make the current floor visible
        const curFloor = scene.getObjectByName(floors[floor - 1] + currentBuilding);
        curFloor.visible = true;

        // Set agent's starting position
        agentGroup.position.set(start[currentBuilding][floor].x, start[currentBuilding][floor].y, start[currentBuilding][floor].z);

        // Set pathfinding zone data
        pathfinding.setZoneData(ZONE, Pathfinding.createZone(navmesh[currentBuilding.toLowerCase()][floor - 1].geometry));

        // Determine target
        let target;
        if (floor !== parseInt(endFloor)) {
            target = targets[currentBuilding][floor].STAIRS; // Next stairs if not the last floor
        } else {
            target = targets[currentBuilding][floor][endRoom]; // Final room for the last floor
        }

        const agentpos = agentGroup.position;
        groupID = pathfinding.getGroup(ZONE, agentGroup.position);

        // Find closest nodes for the agent and target
        const clampedAgentPosition = pathfinding.getClosestNode(agentGroup.position, ZONE, groupID)?.centroid || agentGroup.position;
        const clampedTargetPosition = pathfinding.getClosestNode(target, ZONE, groupID)?.centroid || target;

        // Compute the navigation path
        navpath = pathfinding.findPath(clampedAgentPosition, clampedTargetPosition, ZONE, groupID);

        if (navpath) {
            pathfindinghelper.reset();
            pathfindinghelper.setPlayerPosition(agentpos);
            pathfindinghelper.setTargetPosition(target);
            pathfindinghelper.setPath(navpath);

            // Animate the agent movement
            const clock = new THREE.Clock();
            function animateMovement() {
                const delta = clock.getDelta();

                if (!navpath || navpath.length <= 0) {
                    if (floor !== parseInt(endFloor)) {
                        curFloor.visible = false; // Hide the current floor
                    } else {
                        // Show custom modal when agent reaches the final room
                        showModal(`Agent has reached the final room: ${endRoom} on floor ${floor}`, () => {
                            showModel('ALL');
                            agentGroup.position.set(start['ALL'][1].x, start['ALL'][1].y, start['ALL'][1].z);
                            pathfindinghelper.reset();
                        });
                    }

                    resolve(); // Resolve the promise when movement is complete
                    return;
                }

                const targetPosition = navpath[0];
                const distance = targetPosition.clone().sub(agentGroup.position);

                if (distance.lengthSq() > 0.01 * 0.01) {
                    distance.normalize();
                    // Move agent towards target
                    agentGroup.position.add(distance.multiplyScalar(delta * SPEED));
                } else {
                    navpath.shift(); // Remove the reached node from the path
                }

                // Continue animation
                requestAnimationFrame(animateMovement);
            }
            animateMovement();
        } else {
            curFloor.visible = false; // Hide the current floor if no path is found
            resolve(); // Resolve immediately if no path is found
        }
    });
}
scene.add(agentGroup);
showModel(currentBuilding);

const raycaster = new THREE.Raycaster(); // create once
const clickMouse = new THREE.Vector2(); // create once

function intersect(pos) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects([navmesh[currentBuilding.toLowerCase()][currentFloor - 1]]);
}
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

function showModal(message, okCallback) {
    // Create modal container
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '9999';
    modal.style.color = '#fff';
    modal.style.fontSize = '24px';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#222';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.textAlign = 'center';

    const modalMessage = document.createElement('p');
    modalMessage.textContent = message;

    // OK Button
    const okButton = document.createElement('button');
    okButton.textContent = 'Reset'; // RENAME
    okButton.style.marginTop = '10px';
    okButton.style.marginRight = '10px';
    okButton.style.padding = '10px 20px';
    okButton.style.border = 'none';
    okButton.style.borderRadius = '5px';
    okButton.style.backgroundColor = '#0d6efd';
    okButton.style.color = '#fff';
    okButton.style.cursor = 'pointer';

    // Cancel Button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Stay'; // RENAME
    cancelButton.style.marginTop = '10px';
    cancelButton.style.padding = '10px 20px';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '5px';
    cancelButton.style.backgroundColor = '#dc3545';
    cancelButton.style.color = '#fff';
    cancelButton.style.cursor = 'pointer';

    // Close modal on OK button click and execute OK callback
    okButton.addEventListener('click', () => {
        document.body.removeChild(modal); // Remove modal from the DOM
        if (okCallback) okCallback(); // Execute the OK callback if provided
    });

    // Close modal on Cancel button click
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal); // Simply close the modal
    });

    // Append content to modal and modal to body
    modalContent.appendChild(modalMessage);
    modalContent.appendChild(okButton);
    modalContent.appendChild(cancelButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}
