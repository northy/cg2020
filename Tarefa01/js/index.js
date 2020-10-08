var scene;
var camera;
var renderer;

var esfera;

var velesfera = [1,0.5];

const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 500;

    criaesfera();
};

const render = () => {
    requestAnimationFrame(render);

    animaesfera();

    renderer.render(scene, camera)
};

const animaesfera = () => {
    if (esfera.position.x>=300 || esfera.position.x<=-300) {
        this.velesfera[0]=velesfera[0]*-1;
    }
    if (esfera.position.y>=125 || esfera.position.y<=-125) {
        this.velesfera[1]=velesfera[1]*-1;
    }

    this.esfera.position.x+=velesfera[0];
    this.esfera.position.y+=velesfera[1];
}

const criaesfera = () => {
    var geometria = new THREE.SphereGeometry(50,50,50);
    var material = new THREE.MeshBasicMaterial({color:'red'});

    esfera = new THREE.Mesh(geometria, material)
    scene.add(esfera);
};

init();
render()