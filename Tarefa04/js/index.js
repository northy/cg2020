var scene;
var camera;
var renderer;

var create = function() {
    var geometryBox = new THREE.BoxGeometry( 2, 10, 2 );
    var geometrySphere = new THREE.SphereGeometry(2, 32,32);
    var geometryCylinder = new THREE.CylinderGeometry( 2, 2, 6, 32 );

    var materialWhite = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: true } );
    var materialRed = new THREE.MeshBasicMaterial( { color: 0xff0000, vertexColors: true } );
    var materialGreen = new THREE.MeshBasicMaterial( { color: 0x00ff00, vertexColors: true } );
    var materialBlue = new THREE.MeshBasicMaterial( { color: 0x0000ff, vertexColors: true } );
    var materialPurple = new THREE.MeshBasicMaterial( { color: 0xff00ff, vertexColors: true } );
    var materialTurqoise = new THREE.MeshBasicMaterial( { color: 0x3fe0d0, vertexColors: true } );

    box = new THREE.Mesh( geometryBox, materialWhite );
    sphere = new THREE.Mesh( geometrySphere, materialRed );
    cylinder = new THREE.Mesh( geometryCylinder, materialGreen );
    box2 = new THREE.Mesh( geometryBox, materialBlue );
    sphere2 = new THREE.Mesh( geometrySphere, materialPurple );
    cylinder2 = new THREE.Mesh( geometryCylinder, materialTurqoise );

    scene.add( box );
    scene.add( sphere );
    scene.add( cylinder );
    scene.add( box2 );
    scene.add( sphere2 );
    scene.add( cylinder2 );

    box.position.x=34
    box.position.y=-37
    box.position.z=15

    sphere.position.x=0
    sphere.position.y=0
    sphere.position.z=0

    cylinder.position.x=-29
    cylinder.position.y=36
    cylinder.position.z=6

    box2.position.x=-18
    box2.position.y=7
    box2.position.z=13

    sphere2.position.x=36
    sphere2.position.y=13
    sphere2.position.z=-37

    cylinder2.position.x=28
    cylinder2.position.y=-32
    cylinder2.position.z=-49
};

var init = function() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    this.create();

    camera.position.z = 100;

    render();

    document.addEventListener('keydown', onKeyDown ); 
    document.addEventListener('keyup', onKeyUp );
  
};

var render = function() {
    requestAnimationFrame( render );

    renderer.render( scene, camera );
};

var onKeyUp = function(e){
    
}

const speed = {
    x: 5,
    y: 5,
    z: 5
}

var onKeyDown = function(e){
    if (e.keyCode == 38){ //Up
        camera.position.y+=speed.y
    }
    if (e.keyCode == 40){ //Down
        camera.position.y-=speed.y
    }
    if (e.keyCode == 39){ //direita
        camera.position.x+=speed.x
    }
    if (e.keyCode == 37){ //esquerda
        camera.position.x-=speed.x
    }
    if (e.keyCode == 81){ //Q
        camera.position.z+=speed.z
    }
    if (e.keyCode == 65){ //A
        camera.position.z-=speed.z
    }
    if (e.keyCode == 32){ //espaço
        //camera.position.applyQuaternion( new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), toRadians(5) ));
        camera.rotateY(toRadians(5))
    }
}

window.onload = this.init;

function toRadians(angle) {
	return angle * (Math.PI / 180);
}1