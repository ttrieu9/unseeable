if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, controls;
var camera, scene, renderer, light;

var audioListener;
var sounds = [];

var cameraPosition = 1;

var clock = new THREE.Clock();

var mixers = [];

var raycaster;
var mouse = new THREE.Vector2();
var currentObject;
var currentHover;
var previousMaterial;
var previousPosition;
var coloredObjects = [];
var attempts = 0;
var colormode = 1;
var intersectableObjects = [];
var paperGroup = [];
var paper = new THREE.Group();
var posted = false;
var controlsEnabled = true;

var paths = [];
var splineTargets = [];

var subtitles;

var logger = new Logger('player id', 1);

init();

//TODO: will probably need to get the building answers here
// loadJSON("colorPaperAnswers", (result) => {
//     colorPaperAnswers = result
// });

function disableControls() {
    controlsEnabled = false;
    document.body.style.cursor = 'none';
    hideCameraControls();
}

function enableControls() {
    controlsEnabled = true;
    document.body.style.cursor = 'default';
    if(cameraPosition === 1 && controlsUsed === false){
        showCameraControls();
    }
}

//TODO: update to work with blocks
function onMouseMove() {
    if(controlsEnabled) {
        event.preventDefault();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y =  - ( event.clientY / window.innerHeight ) * 2 + 1;


        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(intersectableObjects);

        if(intersects.length > 0) {
            var intersected = intersects[0].object;
            switch(cameraPosition) {
                case 1:
                    if(intersected.name.includes('Table') && !intersected.name.includes('Chair') && !intersected.name.includes('Legs') && !intersected.name.includes("Path")) {
                        document.body.style.cursor = 'pointer';

                        if(!currentHover) {
                            currentHover = intersected;
                            newMaterial = currentHover.material[0].clone();
                            previousMaterial = [currentHover.material[0].clone(),currentHover.material[1].clone()];
                            newMaterial.color.setHex('0xffffff');
                            currentHover.material = newMaterial
                        }
                        else {
                            currentHover.material = previousMaterial;
                            currentHover = intersected;
                            newMaterial = currentHover.material[0].clone();
                            previousMaterial = [currentHover.material[0].clone(),currentHover.material[1].clone()];
                            newMaterial.color.setHex('0xffffff');
                            currentHover.material = newMaterial
                        }
                    }
                    else {
                        document.body.style.cursor = 'default';

                        if(currentHover) {
                            currentHover.material = previousMaterial;
                            currentHover = null
                        }
                    }
                    break;
                case 2:
                    if(intersected.name.includes('Crayon')) {
                        document.body.style.cursor = 'pointer';

                        if(!intersected.name.includes('Box')) {
                            if(!currentHover) {
                                currentHover = intersected;
                                previousPosition = {
                                    x: intersected.position.x,
                                    y: intersected.position.y,
                                    z: intersected.position.z
                                };
                                currentHover.position.set(previousPosition.x + 0.015, previousPosition.y, previousPosition.z - 0.025)
                            }
                            else if(currentHover.name !== intersected.name) {
                                currentHover.position.set(previousPosition.x, previousPosition.y, previousPosition.z);
                                currentHover = intersected;
                                previousPosition = {
                                    x: intersected.position.x,
                                    y: intersected.position.y,
                                    z: intersected.position.z
                                };
                                currentHover.position.set(previousPosition.x + 0.015, previousPosition.y, previousPosition.z - 0.025)
                            }
                        }
                        else if(currentHover) {
                            currentHover.position.set(previousPosition.x, previousPosition.y, previousPosition.z);
                            currentHover = null
                        }
                    }
                    else if(intersected.name.includes('Paper')) {
                        if(!intersected.name.includes('Outline')) {
                            document.body.style.cursor = 'pointer'
                        }
                        else {
                            document.body.style.cursor = 'default'
                        }
                    }
                    else {
                        document.body.style.cursor = 'default';

                        if(currentHover) {
                            currentHover.position.set(previousPosition.x, previousPosition.y, previousPosition.z);
                            currentHover = null
                        }
                    }
                    break;
                case 3:
                    if(posted === false) {
                        document.body.style.cursor = 'pointer'
                        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
                        vector.unproject(camera);
                        var dir = vector.sub( camera.position ).normalize();
                        var distance = - camera.position.z / dir.z;
                        var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
                        pos.set(-1.9*(pos.x + 3.9), -1.9*(pos.y - 1.2), pos.z - 7.5);
                        paper.position.copy(pos);
                    }
                    break;
            }
        }
    }
}

//TODO: update this function to use blocks instead of crayons
function colorPaper() {
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(intersectableObjects);

    if(intersects.length > 0) {
        var intersected = intersects[0].object;

        if (intersected.name.includes('Crayon')) {
            if(intersected.name.includes('Crayon_Box')){
                currentObject.visible = true;
                currentObject = null;
            }
            else {
                if(currentObject && currentObject.visible === false) {
                    currentObject.visible = true;
                }

                currentObject = intersected;
                currentObject.visible = false;
            }

            playSound("Click");
        }
        else if(intersected.name.includes('Paper') && coloredObjects.includes(intersected.name) && !intersected.name.includes("Outline") && currentObject) {
            intersected.material = currentObject.material[0];
            updatePaperScore(intersected.name, currentObject.material[0].name)
            var paperIndex = coloredObjects.findIndex((object) => {
                return object.includes(intersected.name)
            });
            coloredObjects.splice(paperIndex, 1);

            playSound("Writing");

            if(coloredObjects.length === 0) {
                startCutScene();
                logger.logTask("Color paper", colorPaperScore / 14);
                setTimeout(() => {
                    nextPosition();
                }, 750);

                setTimeout(() => {
                    // create paper group
                    for(var i in paperGroup) {
                        paper.add(paperGroup[i]);
                    }
                    paper.rotateX(Math.PI/2);
                    paper.rotateY(Math.PI/4);
                    scene.add(paper);
                }, 1500);
            }
        }
    }
}

//TODO: update score for building instead of coloring
/**
 * Updates player score when coloring a piece of paper.
 *
 * @param {*} intersectedName - name of piece of paper that is being colored.
 * @param {*} crayonColor - current color of crayon, identified by name.
 */
function updatePaperScore(intersectedName, crayonColor) {
    var piece = colorPaperAnswers.find((element) => {
        return element.name == intersectedName;
    });

    if(piece.trueColor == crayonColor) {
        colorPaperScore++;
    };
}

function startCutScene() {
    disableControls();

    var topBar = document.getElementById("top_bar");
    var bottomBar = document.getElementById("bottom_bar");
    topBar.classList.remove("fade-out");
    bottomBar.classList.remove("fade-out");
    topBar.offsetWidth;
    bottomBar.offsetWidth;
    topBar.classList.add("fade-in");
    bottomBar.classList.add("fade-in");

    setTimeout(() => {
        topBar.style.opacity = 1;
        bottomBar.style.opacity = 1;
    }, 950);
}

function endCutScene () {
    var topBar = document.getElementById("top_bar");
    var bottomBar = document.getElementById("bottom_bar");
    topBar.classList.remove("fade-in");
    bottomBar.classList.remove("fade-in");
    topBar.offsetWidth;
    bottomBar.offsetWidth;
    topBar.classList.add("fade-out");
    bottomBar.classList.add("fade-out");

    setTimeout(() => {
        enableControls();
        topBar.style.opacity = 0;
        bottomBar.style.opacity = 0;
    }, 950);
}

function fade() {
    var curtain = document.getElementById("curtain");
    curtain.classList.remove("screen-change");
    curtain.offsetWidth;
    curtain.classList.add("screen-change");
}

/**
 * Play the given sound
 * @param name String name of the sound to be played
 */
function playSound(name) {
    //find the sound whose name includes the given string
    let sound = sounds.find(function(element){
        return element.name.includes(name);
    });

    //add subtitles
    let subs = subtitles.audio.find(function(element){
        return element.name.includes(name);
    });

    if(subs){
        for(let i in subs.lines){
            setTimeout(function(){
                let subtitle = document.getElementById("subs");
                subtitle.innerText = subs.lines[i].text;
            }, subs.lines[i].offset);
        }
    }

    sound.play();
}

function init() {
    //create the scene
    scene = new THREE.Scene();

    //create camera that will be used
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 2000 );
    camera.rotation.reorder( "YXZ" );
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //camera controls, mostly for debugging purposes
    controls = new THREE.OrbitControls( camera );
    controls.target = new THREE.Vector3(3, 1, 5);
    controls.enabled = true; //set to false to turn off controls

    //initial camera position
    camera.position.set(-6.342057562830126, 2.340890947024859, 6.883271833415659);
    camera.rotation.set(-0.09963408823470919, -1.5005061696940256, 2.0920433907298925e-17);

    //
    // LOADING
    //

    //load the bedroom
    loadWorldFBX('Newest.2.22.18.fbx',
        function(object){
            console.log(object);
        });

    //load audio

    //TODO: create subtitles for dialogue for level 2
    // load subtitles
    // loadJSON("level2subs", function(json){
    //     subtitles = json;
    // });

    //
    // LIGHTS
    //

    light = new THREE.PointLight(0xfff1e0, 0.3, 50, 1);
    light.position.set(-4, 9, -1);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light));

    light = new THREE.PointLight(0xfff1e0, 0.3, 50, 1);
    light.position.set(4, 9, -1);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light));

    light = new THREE.PointLight(0xfff1e0, 0.3, 50, 1);
    light.position.set(-4, 9, 10);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light));

    light = new THREE.PointLight(0xfff1e0, 0.3, 50, 1);
    light.position.set(4, 9, 10);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light));

    //ambient light to make the shadows not as dark
    light = new THREE.AmbientLight(0xfff1e0, 0.6);
    scene.add(light);

    //create raycaster for object selection
    raycaster = new THREE.Raycaster();
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

    var element = document.body;

    //
    // EVENT LISTENERS
    //

    element.addEventListener("keypress", function(event){
        if(String.fromCharCode(event.keyCode) === "c"){
            console.log(camera);
        }
        else if(String.fromCharCode(event.keyCode) === "f"){
            logger.printLog();
        }
        else if(String.fromCharCode(event.keyCode) === "t"){
            console.log(coloredObjects)
        }
        else if(String.fromCharCode(event.keyCode) === "o"){
            controls.enabled = !controls.enabled;
        }
        else if(String.fromCharCode(event.keyCode) === " "){
            nextPosition();
        }
    }, false);

    window.addEventListener("dblclick", () => {
        if(colormode === 1) {
            revertColors(document);
            for(var i in paths) {
                paths[i].visible = true;
            }
            colormode = 0
        }
        else {
            changeColorVision();
            for(var i in paths) {
                paths[i].visible = false;
            }
            colormode = 1
        }
    });

    window.addEventListener("mousemove", onMouseMove);

    //TODO: update these for the bedroom situations
    window.addEventListener("mousedown", () => {
        if(controlsEnabled) {
            switch(cameraPosition) {
                case 1:
                    selectTable();
                    playSound("Click.mp3");
                    logger.logEvent("mousedown", mouse.x, mouse.y);
                    break;
                case 2:
                    colorPaper();
                    logger.logEvent("mousedown", mouse.x, mouse.y);
                    break;
                case 3:
                    postPaper();
                    logger.logEvent("mousedown", mouse.x, mouse.y);
                    break;
            }
        }
    });

    window.addEventListener( 'resize', onWindowResize, false );

    animate();
}

window.onload = changeColorVision();

//TODO: update cameraPositions for this level
function nextPosition(){
    switch(cameraPosition){
        case 1:
            cameraPosition = 2;
            break;
        case 2:
            // grab camera rotation on view of teacher
            camera.lookAt(new THREE.Vector3(4, 3.55, -1));
            var teacherView = {
                x: camera.rotation.x,
                y: camera.rotation.y,
                z: camera.rotation.z
            };
            camera.rotation.set(-1.0581080584316573, -0.5617291507874522, 0);

            // Tween camera to view teacher
            var lookAtTeacher = new TWEEN.Tween(camera.rotation).to(teacherView, 1000).onComplete(() => {
                // teacher makes announcement to place art on board
                playSound("FinishColoring");
            }, 2000);
            lookAtTeacher.start();



            cameraPosition = 3;
            break;
        case 3:
            teacher.position.set(-9, -.05, 8);
            camera.position.set(-6.342057562830126, 2.340890947024859, 6.883271833415659);
            camera.rotation.set(-0.09963408823470919, -1.5005061696940256, 2.0920433907298925e-17);
            cameraPosition = 1;
            break;
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    camera.updateProjectionMatrix();
    requestAnimationFrame( animate );

    //play animations for all animated objects
    if ( mixers.length > 0 ) {
        let time = clock.getDelta();
        for ( var i = 0; i < mixers.length; i ++ ) {
            mixers[ i ].update( time );
        }
    }

    stats.update();
    //if controls are enabled
    if(controls.enabled) {
        controls.update();
    }

    render();

}
function render() {
    TWEEN.update();
    updateSpline();

    renderer.render( scene, camera );
}