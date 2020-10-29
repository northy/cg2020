var scene;
var camera;
var renderer;

var createBraco = function() {
    var geometry = new THREE.BoxGeometry( 2, 10, 2 );

    red = new THREE.Color(1, 0, 0);
    green = new THREE.Color(0, 1, 0);
    blue = new THREE.Color(0, 0, 1);
    var colors = [red, green, blue];

    for (var i = 0; i < 3; i++) {
        geometry.faces[4 * i].color = colors[i];
        geometry.faces[4 * i+1].color = colors[i];
        geometry.faces[4 * i+2].color = colors[i];
        geometry.faces[4 * i+3].color = colors[i];
    }

    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: true } );
    braco = new THREE.Mesh( geometry, material );
    antebraco = new THREE.Mesh( geometry, material );
    scene.add( braco );
    scene.add(antebraco)

    var geometry2 = new THREE.SphereGeometry(2, 32,32);
    var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff} );
    ombro = new THREE.Mesh(geometry2, material2);
    cotovelo = new THREE.Mesh(geometry2, material2);
    ombro.position.y-=5;
    cotovelo.position.y-=5;
    braco.add(ombro);
    antebraco.add(cotovelo)

    pivot = new THREE.Group();
    pivot.position.set(0,0,0);
    pivot.add(braco);

    pivotcotovelo = new THREE.Group();
    pivotcotovelo.position.set(0,10,0);
    pivotcotovelo.add(antebraco);

    pivot.add(pivotcotovelo)

    scene.add(pivot);
    braco.position.y+=pivot.position.x+5;
    antebraco.position.y+=pivotcotovelo.position.x+5;
};

var init = function() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    this.createBraco();

    camera.position.z = 50;
    camera.position.y = 10

    render();

    document.addEventListener('keydown', onKeyDown ); 
    document.addEventListener('keyup', onKeyUp ); 

    document.addEventListener('mousedown', onMouseDown ); //metodos de controle do mouser
    document.addEventListener('mouseup', onMouseUp ); 
    document.addEventListener('mousemove', onMouseMouse ); 
  
};

var cotovelomove = true
var render = function() {
    requestAnimationFrame( render );

    if (cotovelomove && cotoveloDesl>=0) {
        pivotcotovelo.rotation.z-=toRadians(2.5)*0.5; 
        cotoveloDesl-=2.5
    }

    renderer.render( scene, camera );
};

rotacaoAtualK = {
    z:0
}

cotoveloDesl = 0

var onKeyUp = function(e){
    if (e.keyCode == 32) {
        cotovelomove = true
    }
}

var onKeyDown = function(e){
    const maxRotationK = {
        z:135
    }

    if (e.keyCode == 32){ //espaço -> BIG FLEX.
        if (cotoveloDesl<=135) {
            pivotcotovelo.rotation.z+=toRadians(10)*0.5; 
            cotoveloDesl+=10
        }
        cotovelomove = false
    }
    if (e.keyCode == 65){ // a
        if (rotacaoAtualK.z+5<=maxRotationK.z) {
            pivot.rotation.z+=toRadians(5)*0.5
            rotacaoAtualK.z+=5
        }
    }
    if (e.keyCode == 87){ // w

    }
    if (e.keyCode == 68){ // d
        if (rotacaoAtualK.z-5>=(-maxRotationK.z)) {
            pivot.rotation.z-=toRadians(5)*0.5
            rotacaoAtualK.z-=5
        }
    }
    if (e.keyCode == 83){ // s

    }
}


var posicaoMouser = { //controla a posição do mouser
    x: 0,
    y: 0
};

var rotacaoAtual = {
    x: 0,
    y: 0
}

var cliquePressionado = false; //para controlar o tempo que o cara esta pressionando o botao do mouser

var onMouseDown = function(e){
    cliquePressionado = true;
    //console.log("Apertou Clicou")
}


var onMouseUp = function(e){
    cliquePressionado = false;
  //  console.log("SOltou o clique");
}

var onMouseMouse = function (e){
    const maxRotation = {
        x: 200,
        y: 100
    }

    if (cliquePressionado){
        var deltaMovimento = {
            x: e.offsetX - posicaoMouser.x,
            y: e.offsetY - posicaoMouser.y,
        }

        //console.log(rotacaoAtual)

        //braco.position.x += deltaMovimento.x*0.01;
        //braco.position.y += deltaMovimento.y*0.01*-1;


        if (rotacaoAtual.x+deltaMovimento.y<=maxRotation.x && rotacaoAtual.x+deltaMovimento.y>=(-maxRotation.x)) {
            pivot.rotation.x += toRadians(deltaMovimento.y)*0.5;
            if (deltaMovimento.y>0) rotacaoAtual.x = Math.min(rotacaoAtual.x+deltaMovimento.y,maxRotation.x);
            else rotacaoAtual.x = Math.max(rotacaoAtual.x+deltaMovimento.y,-maxRotation.x)
        }
        if (rotacaoAtual.y+deltaMovimento.x<=maxRotation.y && rotacaoAtual.y+deltaMovimento.x>=(-maxRotation.y)) {
            pivot.rotation.y += toRadians(deltaMovimento.x)*0.5;
            if (deltaMovimento.x>0) rotacaoAtual.y = Math.min(rotacaoAtual.y+deltaMovimento.x,maxRotation.y);
            else rotacaoAtual.y = Math.max(rotacaoAtual.y+deltaMovimento.x,-maxRotation.y)
        }
    }

    posicaoMouser = {  //nova posição do mouser
        x : e.offsetX,
        y : e.offsetY
    };
}

window.onload = this.init;

function toRadians(angle) {
	return angle * (Math.PI / 180);
}