import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/DRACOLoader.js';

// 📦 CONTENEDOR
const container = document.getElementById("viewer");

// 🎬 ESCENA
const scene = new THREE.Scene();

// 📷 CÁMARA (basada en el tamaño del contenedor)
const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.set(0, 1.5, 4);

// 🎨 RENDER
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// 💡 LUCES (mejoradas)
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(3, 5, 3);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.8));

// 🎮 CONTROLES
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;

// 📦 MODELOS
const evaList = [
    { name: "EVA-01", path: "./resources/models/evangelion_unit-01.glb" },
    { name: "EVA-02", path: "./resources/models/evangelion_unit-02.glb" },
    { name: "EVA-00", path: "./resources/models/evangelion_unit-00.glb" },
    { name: "EVA-03", path: "./resources/models/evangelion_unit-03.glb" },
    { name: "EVA-04", path: "./resources/models/evangelion_unit-04.glb" },
    { name: "EVA-MASS-PRODUCTION", path: "./resources/models/mass_production_evangelion.glb" }
];

let currentIndex = 0;
let currentModel = null;

// 🔧 LOADER
const loader = new GLTFLoader();

// 🚀 FUNCIÓN PARA CARGAR EVA
function loadEva(index) {

    if (currentModel) {
        scene.remove(currentModel);
    }

    const eva = evaList[index];

    loader.load(eva.path, (gltf) => {

        currentModel = gltf.scene;

        // 🔥 ARREGLO DE MATERIALES
        currentModel.traverse((child) => {
            if (child.isMesh) {

                child.material.side = THREE.DoubleSide;
                child.material.transparent = false;
                child.material.depthWrite = true;

                child.geometry.computeVertexNormals();

                // 👁 brillo ojos
                if (child.name.toLowerCase().includes("eye")) {
                    child.material.emissive = new THREE.Color(0xff0000);
                    child.material.emissiveIntensity = 2;
                }
            }
        });

        // 📍 CENTRAR MODELO
        const box = new THREE.Box3().setFromObject(currentModel);
        const center = box.getCenter(new THREE.Vector3());
        currentModel.position.sub(center);

        // 🔧 ESCALA CONTROLADA (ajusta si quieres)
        currentModel.scale.set(1, 1, 1);

        scene.add(currentModel);

        // 🎯 CENTRO DE ROTACIÓN
        controls.target.set(0, 1, 0);
        controls.update();

        // 📝 UI
        document.getElementById("evaName").textContent = eva.name;

    }, undefined, (error) => {
        console.error("Error cargando modelo:", error);
    });
}

// 🔘 BOTONES
document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % evaList.length;
    loadEva(currentIndex);
});

document.getElementById("prevBtn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + evaList.length) % evaList.length;
    loadEva(currentIndex);
});

// 🚀 CARGA INICIAL
loadEva(currentIndex);

// 🎬 ANIMACIÓN
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// 📱 RESPONSIVE (CORREGIDO)
window.addEventListener('resize', () => {

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});

const toggleBtn = document.getElementById("menu-toggle");
const sidebar = document.getElementById("side-bar");
const overlay = document.getElementById("menu-overlay");

if (toggleBtn && sidebar && overlay) {

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    });

    overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });

}