var scene;
var camera;
var renderer;

var velocity = 0.017;

var ground;
var pivot;
var controls;

var textureLoader;
var loaded = false, loadedSound= false, dancing = true;
var vaca;

var spotLight;
var ambientLight;
var directionalLight;

var criaGround = function (){
    textureLoader = new THREE.TextureLoader();
    groundTexture = textureLoader.load('assets/textura/terrain/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 10, 10 );
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    groundNormal = textureLoader.load('assets/textura/terrain/grasslight-big-nm.jpg');
    groundNormal.wrapS = groundNormal.wrapT = THREE.RepeatWrapping;
    groundNormal.repeat.set( 10, 10 );
    groundNormal.anisotropy = 16;
    
    ground = new THREE.Mesh(
        new THREE.PlaneGeometry(2048, 2048, 25,25),
        new THREE.MeshBasicMaterial({map : groundTexture})
    );

    ground.material.normalMap = groundNormal

    ground.rotation.x -= Math.PI / 2;
    ground.position.y=-2;
    ground.receiveShadow = true;

    scene.add(ground);
};

var mixer

var loadObj = function(){
    gltfLoader = new THREE.GLTFLoader();
 
    gltfLoader.load(
        'assets/models/vaca.glb', //arquivo que vamos carregar
        function(object){
            object.castShadow = true;
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
            vaca.position.y = -1.5;

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
            loaded = true;
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
        loadedSound = true
    });
}

var guiFunction = function(){
    const gui = new dat.GUI();

    param = {
        dancing: true,
        speed: 1,
        volume: 30,
        play: () => {sound.pause(); sound.play()},
        pause: () => {sound.pause()},
        restart: () => {sound.stop(); sound.play()}
    };

    let dance = gui.add(param, 'dancing').name("Dancing");
    dance.onChange(function (param){
        dancing = param
    })

    let speed = gui.add(param, 'speed').min(0.5).max(2).name("Speed");
    speed.onChange(function (OldValue){
        OldMax = 2; OldMin=0.5
        NewMax = 0.034; NewMin = 0.0085
        OldRange = (OldMax - OldMin)
        NewRange = (NewMax - NewMin)  
        NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin
        velocity = NewValue
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

    renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    loadObj();

    camera.position.z = 100;
    camera.position.y = 30;

    //Iluminação 
    spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.angle = 0.8;
    spotLight.position.y = 40;
    spotLight.position.z = 80;
    spotLight.intensity = 1;

    spotLight.castShadow = true;
    spotLight.shadow.distance = 100;
    spotLight.shadow.penumbra = 30;
    spotLight.shadow.angle = 35;

    scene.add(spotLight);

    //const helper = new THREE.CameraHelper( spotLight.shadow.camera );
    //scene.add( helper );

    //helperSpot = new THREE.SpotLightHelper(spotLight);
    //scene.add(helperSpot);

    pivot = new THREE.Group()
    pivot.position.x = 0
    pivot.position.y = 0
    pivot.position.z = 20
    pivot.add(camera)
    scene.add(pivot)

    scene.fog = new THREE.Fog( 0xcce0ff, 200, 500 );

    ambient = new THREE.AmbientLight( 0xffffff )
    ambient.intensity = 0.3
    
    scene.add(ambient);

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;   //damping 
    controls.dampingFactor = 0.25;   //damping inertia
    controls.enablePan = false;      //pan 
    controls.enableZoom = true;      //Zooming
    controls.maxPolarAngle = Math.PI / 2; // Limit angle of visibility

    criaGround();

    guiFunction();

    criaMusica()

    render();
};

var ci = 0
var render = function() {
    requestAnimationFrame( render );

    controls.update()

    if (dancing && loaded && loadedSound) {
        mixer.update(velocity)
    }

    renderer.render( scene, camera );
};

window.onload = this.init;

function toRadians(angle) {
	return angle * (Math.PI / 180);
}
