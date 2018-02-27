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
var controlsEnabled = true;

var paths = [];
var splineTargets = [];

var subtitles;

var logger = new Logger('player id', 1);

//TODO: probably only temporary for building
var box;
var buildingStep = 0;

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
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y =  - ( event.clientY / window.innerHeight ) * 2 + 1;


    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(intersectableObjects);

    if(intersects.length > 0) {
        var intersected = intersects[0].object;

        //if mouse is over a blocko
        if(intersected.name.includes('Blockos') && intersected.placed === false) {
            document.body.style.cursor = 'pointer';

            //if there is no already hovering piece
            if(!currentHover){
                currentHover = intersected;

                //move the piece up slightly
                previousPosition = {
                    x: intersected.position.x,
                    y: intersected.position.y,
                    z: intersected.position.z
                };
                currentHover.position.set(previousPosition.x, previousPosition.y+.1, previousPosition.z);
            }
            //if mouse hovers over a new piece
            else if(currentHover.name !== intersected.name){
                //return the previous piece back and select the new one
                currentHover.position.set(previousPosition.x, previousPosition.y, previousPosition.z);
                currentHover = intersected;

                //move the piece up slightly
                previousPosition = {
                    x: intersected.position.x,
                    y: intersected.position.y,
                    z: intersected.position.z
                };
                currentHover.position.set(previousPosition.x, previousPosition.y+.1, previousPosition.z);
            }


        }
        //if not hovering over a piece
        else if(currentHover){
            document.body.style.cursor = 'default';
            currentHover.position.set(previousPosition.x, previousPosition.y, previousPosition.z);
            currentHover = null;
        }

        //if there is a selected piece, make it follow the mouse on the rug
        if(currentObject){
            let rug = intersects.find(function(element){
                return element.object.name.includes("pCylinder1");
            })
            if(rug){
                //TODO: make offsets for the pieces so that they are above the rug and not in it
                let point = rug.point;
                currentObject.position.set(point.x, point.y, point.z);
            }

        }
    }
}

//TODO: update this function to use blocks instead of crayons
function buildBlock() {
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(intersectableObjects);

    if(intersects.length > 0) {
        var intersected = intersects[0].object;
        console.log(intersected);

        //if clicking on a block
        if(intersected.name.includes("Blockos") && intersected.placed === false){
            //if there is already a selected block, make if visible
            if(currentObject){
                currentObject.visible = true;
            }

            //select the block and make it invisible
            currentObject = intersected;
            let curPos = currentObject.position;
            let curWorPos = currentObject.getWorldPosition();
        }
        //if placing the piece inside of the box
        else if(currentObject && intersected === box){
            placeBlock();
        }
    }
}

//TODO: update the function to work with new blocko names
/**
 * Place the selected block in the building box
 */
function placeBlock(){

    //depending on which step it is, calculate the offset to place the piece correctly
    let offset;
    switch(buildingStep){
        case 0: //base
            offset = {
                x: 0,
                y: -0.51,
                z: 0
            };
            break;
        case 1: //second layer of wall
            offset = {
                x: 0,
                y: -0.17,
                z: 0
            };
            break;
        case 2: //third layer of wall
            offset = {
                x: 0,
                y: 0.17,
                z: 0
            };
            break;
        case 3: //third layer of wall
            offset = {
                x: 0,
                y: 0.51,
                z: 0
            };
            break;
        case 4: //door
            offset = {
                x: -0.17,
                y: 0.08,
                z: 0.71
            };
            break;
        case 5: //flat roof piece
            offset = {
                x: 0.855,
                y: 0.765,
                z: -0.085
            };
            break;
        case 6: //roof
            offset = {
                x: -0.17,
                y: 1.02,
                z: 0.08
            };
            break;
    }

    //place the block inside inside of the box
    currentObject.position.set(box.position.x + offset.x, box.position.y + offset.y, box.position.z + offset.z);
    currentObject.placed = true;
    currentObject = null;
    buildingStep += 1;
}

//TODO: update score for building instead of coloring
/**
 * Updates player score when building.
 */
function updateBuildingScore() {
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
    controls.target = new THREE.Vector3(-13, 0, 1);
    controls.enabled = true; //set to false to turn off controls

    //TODO: find initial camera position
    //initial camera position
    camera.position.set(-13, 4.5, 11.6);

    //TODO: remove box helper when done
    box = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 3), new THREE.MeshBasicMaterial({color:0xdddddd, visible:false}));
    box.name = "buildingBox";
    box.position.set(-13, 1, 6.5);
    intersectableObjects.push(box);
    scene.add(box);
    scene.add(new THREE.BoxHelper(box));

    //
    // LOADING
    //

    //load the bedroom
    loadWorldFBX('Newest.2.26.18.fbx',
        function(object){
            console.log(object);
            for(let i in object.children){
                let child = object.children[i];

                //center the geometries for the blockos in the room
                if(child.name.includes("Blockos") && child.geometry){
                    //generate the bounding box for it and find the center point
                    child.geometry.computeBoundingBox();
                    let box = child.geometry.boundingBox;
                    let boxPos = {
                        x: 0.5 * (box.max.x + box.min.x),
                        y: 0.5 * (box.max.y + box.min.y),
                        z: 0.5 * (box.max.z + box.min.z)
                    };

                    //center the geometry and move it back to its original location
                    child.geometry.center();
                    child.position.set(boxPos.x, boxPos.y, boxPos.z);

                    //add a boolean field that tells whther the piece has been placed or not
                    child.placed = false;

                    let clone = child.clone();
                    intersectableObjects.push(clone);
                    clone.placed = false;
                    scene.add(clone);
                }
            }
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
        else if(String.fromCharCode(event.keyCode) === "p"){
            currentObject.position.y -= .01;
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

    window.addEventListener("mousemove", function(){
        if(controlsEnabled){
            onMouseMove(event);
        }
    });

    //TODO: update these for the bedroom situations
    window.addEventListener("mousedown", () => {
        if(controlsEnabled) {
            buildBlock();
            logger.logEvent("mousedown", mouse.x, mouse.y);
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