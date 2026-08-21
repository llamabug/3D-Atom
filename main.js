import './style.css';
import * as THREE from 'three';



const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 45;

const clock = new THREE.Timer();



const geometry = new THREE.SphereGeometry(8, 20, 20);

const nucleusTexture = new THREE.TextureLoader().load(
    `${import.meta.env.BASE_URL}nucleus.jpeg`
);

const texture = new THREE.TextureLoader().load(
    `${import.meta.env.BASE_URL}electron.webp`
);

const protonMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(
        `${import.meta.env.BASE_URL}proton.jpeg`
    )
});

const neutronMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(
        `${import.meta.env.BASE_URL}neutron.jpeg`
    )
});
const nucleusMaterial = new THREE.MeshBasicMaterial({
    map: nucleusTexture,
    transparent: true
});
const material = new THREE.MeshBasicMaterial({
    map: texture
});
const protonGeometry = new THREE.SphereGeometry(1.5,20,20)



const orb = new THREE.Mesh(
    geometry,
    nucleusMaterial
);

scene.add(orb);

const p1 = new THREE.Mesh(protonGeometry, protonMaterial);
const p2 = new THREE.Mesh(protonGeometry, protonMaterial);
const p3 = new THREE.Mesh(protonGeometry, protonMaterial);

const n1 = new THREE.Mesh(protonGeometry, neutronMaterial);
const n2 = new THREE.Mesh(protonGeometry, neutronMaterial);
const n3 = new THREE.Mesh(protonGeometry, neutronMaterial);
const n4 = new THREE.Mesh(protonGeometry, neutronMaterial);

const protons = [
    p1, p2, p3, n1, n2, n3, n4
];

protons.forEach(particle => {
    scene.add(particle);
});

p1.position.set(-2, 0, 0);
p2.position.set(2, 0, 0);
p3.position.set(0, 2, 1);

n1.position.set(0, -2, 0);
n2.position.set(-1, 1, 2);
n3.position.set(1, -1, -2);
n4.position.set(0, 0, -2);

let protonProgress = 0;

const e = new THREE.SphereGeometry(
    1.2,
    20,
    20
);

const e1 = new THREE.Mesh(e, material);
const e2 = new THREE.Mesh(e, material);
const e3 = new THREE.Mesh(e, material);

scene.add(e1);
scene.add(e2);
scene.add(e3);




function add_star() {

    const star_geometry = new THREE.SphereGeometry(
        0.25,
        24,
        24
    );

    const star_material = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

    const star = new THREE.Mesh(
        star_geometry,
        star_material
    );

    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(200));

    star.position.set(x, y, z);

    scene.add(star);
}

Array(200)
    .fill()
    .forEach(add_star);


let targetCameraZ = 45;

function moveCamera() {
    const scrollY = window.scrollY;

    targetCameraZ = Math.max(15, 45 - scrollY * 0.02);

    protonProgress = THREE.MathUtils.clamp( (scrollY - 900) / 500, 0, 1);
}

window.addEventListener('scroll', moveCamera);

moveCamera();


function animate() {
  requestAnimationFrame(animate);
clock.update();
  const t = clock.getElapsed();


  e1.position.x = Math.sin(5*t) * -15;
  e1.position.y = Math.sin(5*t) * 15;
  e1.position.z = Math.cos(5*t) * 15;

  e2.position.x = Math.cos(5*t) * 15;
  e2.position.y = Math.cos(5*t) * 15;
  e2.position.z = Math.sin(5*t) * 15;

e3.position.x = Math.sin(5 * t + 1.5) * 15;
e3.position.y = 0;
e3.position.z = Math.cos(5 * t + 1.5) * 15;


  camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

const electronScale = Math.max(
    0.5,
    camera.position.z / 45
);

e1.scale.setScalar(electronScale);
e2.scale.setScalar(electronScale);
e3.scale.setScalar(electronScale);

protons.forEach(particle => {
    particle.scale.setScalar(protonProgress);
});

nucleusMaterial.opacity = 1 - ( protonProgress * 0.75 );


  renderer.render(scene, camera);
}

animate(); 


function show(topic) {
    const display = document.querySelector('#display')

    if (topic === 'introduction') {
        display.innerHTML = `
        <h1>Intro</h1>
            <p> What makes up the world? Atoms of course! Atoms, (from the greek work atomos, meaning 'indivisible'), are the basic building blocks of all matter, with the ability to combine into molecules but unable to divide by ordinary means.</p>
            `;
    }

    if (topic === 'history') {
        display.innerHTML = `
        <h1>History</h1>
            <p>Something about the greeks? In 1803, John Dalton proposed the theory that all matter is made of atoms- solid spheres that can't be broken down. Atoms from the same element are the same, and different to those of a different element.</p>
            <p>94 years later, JJ Thomson came up with the plum pudding model. This model showed atoms as positive spheres containing negative regions (electrons) inside them. </p>
            <p>Later, Ernest Rutherford conducted the gold foil experiment, proving the atom is mainly empty space, containing a dense positive centre with orbiting negative electrons</p>
            <p>Today's model is based on Niels Bohr, who developed the idea that electrons orbit the nucleus in fixed shells.</p>
           
        `;
    }

    if (topic === 'structure') {
        display.innerHTML = `
        <h1>Structure</h1>
        <p>Our modern understanding of the atom is that it is made up of smaller particles. The nucleus, consisting of protons (which are positive) and neutrons (which are neutral), is surrounded by electrons (negative) that orbit in 'clouds'. </p>
            <p>We also believe that these subatomic particles are made up of even smaller things called quarks and leptons</p>

        `;
    }

    if (topic === 'properties') {
        display.innerHTML = `
        <h1>Properties</h1>
        <p>The atomic number of an electron is determined by how many protons it has, which determines the kind of atom it it. </p>
            <p>Mass number is the amount of protons and neutrons added up. It doesn't include electrons as their weight is negligible.</p>
            <p>Isotopes occur when atoms of the same element (same  amount of protons) have a different amount of neutrons and therefore a different mass number.</p>
            <p>Ordinary atoms have an equal amount of protons and electrons and are overall neutral. When atoms lose or gain electrons they change in amount of charge and become ions</p>
            <p>The atom depicted is Lithium, and contains 3 protons (in white), 4 neutrons (in black), and 3 electrons, which you can see orbiting. It has an atomic number of 3 and a mass of 7.</p>
        `;
    }

}

window.show = show;
