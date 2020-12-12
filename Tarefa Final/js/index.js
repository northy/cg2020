var scene;
var camera;
var renderer;

var velocity = 0.1;

var ground;
var pivot;

var textureLoader;

var vaca;

var spotLight;
var ambientLight;
var directionalLight;

var criaGround = function (){
    textureLoader = new THREE.TextureLoader();
    groundTexture = textureLoader.load('assets/textura/terrain/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 20, 20 );
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    ground = new THREE.Mesh(
        new THREE.PlaneGeometry(1050, 1050, 25,25),
        new THREE.MeshBasicMaterial({map : groundTexture})
    );

    ground.rotation.x -= Math.PI / 2;
    ground.position.y=-2;

    scene.add(ground);
};

var mixer

var loadObj = function(){
    gltfLoader = new THREE.GLTFLoader();
 
    gltfLoader.load(
        'assets/models/vaca.glb', //arquivo que vamos carregar
        function(object){
            vaca = object.scene;

            vaca.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material.map = textureLoader.load("assets/textura/UVCow.png");
                    child.material.map.flipY = false
                    child.material.needsUpdate = true;
                    child.material.metalness=0
                    child.castShadow = true;
                }
            });

            vaca.scale.x = 20;
            vaca.scale.y = 20;
            vaca.scale.z = 20;

            vaca.position.z = 20;
            vaca.position.x = 0;
            vaca.position.y = 0;

            vaca.rotation.y = 0.6

            spotLight.target.position.set(vaca.position);

            mixer = new THREE.AnimationMixer( vaca );

            var action = mixer.clipAction( object.animations[ 0 ] );
            //console.log("action.time")
            //console.log(action.time)
            var clip = action.getClip();
            //console.log("clip.time")
            //console.log(clip.duration)
            action.setLoop(THREE.Loop);
            action.enable = true
            action.play();

            vaca.castShadow = true;

            scene.add(vaca);    
        },//metodo, tudo deu certo
        function( andamento) {
            console.log((andamento.loaded / andamento.total *100) + "% pronto vaca!");
        },//metodo executa enquanto carrega
        function (error){
            console.log("Deu caca vaca: " + error);
        } //metodo deu merda
    );
}

var sound

const criaMusica = function() {
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'assets/sounds/vaca.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.3 );
    });
}

var guiFunction = function(){
    const gui = new dat.GUI();

    param = {
        rotacao: 0,
        volume: 30,
        play: () => {sound.play()},
        pause: () => {sound.pause()},
        restart: () => {sound.stop(); sound.play()}
    };

    let rotacao = gui.add(param, 'rotacao').min(0).max(360).name("Rotation");
    rotacao.onChange(function (param){
        pivot.rotation.y = toRadians(param)
    });

    let pastaMus = gui.addFolder("Music");
    pastaMus.open()

    let volume = pastaMus.add(param, 'volume').min(0).max(100).name("Volume");
    volume.onChange(function (param){
        sound.setVolume( param/100 );
    });

    pastaMus.add(param, 'play').name("Play");
    pastaMus.add(param, 'pause').name("Pause");
    pastaMus.add(param, 'restart').name("Restart");

    gui.open();
   
};

var init = function() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcce0ff );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 600 );

    renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    loadObj();

    camera.position.z = 100;
    camera.position.y = 30;

    //Iluminação 
    spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.angle = 0.7;
    spotLight.position.y = 40;
    spotLight.position.z = 80;
    spotLight.castShadow = true;

    spotLight.shadow.distance = 30;
    spotLight.shadow.penumbra = 30;
    spotLight.shadow.angle = 25;

    scene.add(spotLight);

    spotLight.intensity = 1;

    //helperSpot = new THREE.SpotLightHelper(spotLight);
    //scene.add(helperSpot);

    pivot = new THREE.Group()
    pivot.position.x = 0
    pivot.position.y = 0
    pivot.position.z = 20
    pivot.add(camera)
    scene.add(pivot)

    renderer.shadowMap.enable = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    scene.fog = new THREE.Fog( 0xcce0ff, 200, 500 );

    ambient = new THREE.AmbientLight( 0xffffff )
    ambient.intensity = 0.3
    
    scene.add(ambient);

    criaGround();

    guiFunction();

    criaMusica()

    render();
};

var ci = 0
var render = function() {
    requestAnimationFrame( render );

    try {
        mixer.update(0.01)
    }
    catch {}

    renderer.render( scene, camera );
};

window.onload = this.init;

function toRadians(angle) {
	return angle * (Math.PI / 180);
}
