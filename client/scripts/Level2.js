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
var attempts = 1;
var colormode = 1;
var intersectableObjects = [];
var controlsEnabled = true;

var blocks = [];
var base;

var paths = [];
var splineTargets = [];

var subtitles;

var logger = new Logger('player id', 1);

//TODO: not necessary any more, delete
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

/**
 * Called during building puzzle, used to control blocks
 */
function onMouseMove(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y =  - ( event.clientY / window.innerHeight ) * 2 + 1;


    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(intersectableObjects);

    if(intersects.length > 0) {
        var intersected = intersects[0].object;

        //if mouse is over a block
        if(blocks.includes(intersected) && intersected.placed === false) {
            document.body.style.cursor = 'pointer';

            //if there is no already hovering piece
            if(!currentHover){
                currentHover = intersected;

                //move the piece up slightly
                currentHover.position.set(currentHover.ghost.position.x, currentHover.ghost.position.y+.1, currentHover.ghost.position.z);
            }
            //if mouse hovers over a new piece
            else if(currentHover.name !== intersected.name){
                //return the previous piece back and select the new one
                currentHover.position.set(currentHover.ghost.position.x, currentHover.ghost.position.y, currentHover.ghost.position.z);
                currentHover = intersected;

                //make the piece hover if mouse is on it
                currentHover.position.set(currentHover.ghost.position.x, currentHover.ghost.position.y+.1, currentHover.ghost.position.z);
            }


        }
        //if not hovering over a piece, return the hover piece to its original position
        else if(currentHover){
            document.body.style.cursor = 'default';
            currentHover.position.set(currentHover.ghost.position.x, currentHover.ghost.position.y, currentHover.ghost.position.z);
            currentHover = null;
        }

        //if there is a selected piece, make it follow the mouse on the rug
        //TODO: it might be cleaner using the point the raycaster is at, looking at blocks as well as the rug
        if(currentObject){
            //find the point of intersection that isn't the current object or the building box
            let rayPoint = intersects.find(function(element){
                return currentObject !== element.object;
            }).point;

            //position that is 90% along the ray cast
            let point = {
                x: camera.position.x + (rayPoint.x - camera.position.x)*.9,
                y: camera.position.y + (rayPoint.y - camera.position.y)*.9,
                z: camera.position.z + (rayPoint.z - camera.position.z)*.9
            }

            currentObject.position.set(point.x, point.y, point.z);

            //make the ghost appear if the block is close to the original position
            if(currentObject.position.distanceTo(currentObject.ghost.position) < 1){
                currentObject.ghost.visible = true;
            }
            else{
                currentObject.ghost.visible = false;
            }

        }
    }
}

/**
 * Returns whether or not the bounding boxes of 2 objects intersect.
 * Bounding box dimensions are stored relative to object's origin, so have to take their positions into account.
 * @param object1 First object to check intersection
 * @param object2 Second object to check intersection
 */
function doesIntersect(object1, object2){

    //calculate the actual bounding boxes using the positional offsets
    let obj1box = {
        min:{
            x: object1.position.x + object1.geometry.boundingBox.min.x,
            y: object1.position.y + object1.geometry.boundingBox.min.y,
            z: object1.position.z + object1.geometry.boundingBox.min.z
        },
        max:{
            x: object1.position.x + object1.geometry.boundingBox.max.x,
            y: object1.position.y + object1.geometry.boundingBox.max.y,
            z: object1.position.z + object1.geometry.boundingBox.max.z
        }
    };

    let obj2box = {
        min:{
            x: object2.position.x + object2.geometry.boundingBox.min.x,
            y: object2.position.y + object2.geometry.boundingBox.min.y,
            z: object2.position.z + object2.geometry.boundingBox.min.z
        },
        max:{
            x: object2.position.x + object2.geometry.boundingBox.max.x,
            y: object2.position.y + object2.geometry.boundingBox.max.y,
            z: object2.position.z + object2.geometry.boundingBox.max.z
        }
    };

    //check intersection by checking if not intersecting
    return !(obj1box.min.x > obj2box.max.x || obj1box.max.x < obj2box.min.x
          || obj1box.min.y > obj2box.max.y || obj1box.max.y < obj2box.min.y
          || obj1box.min.z > obj2box.max.z || obj1box.max.z < obj2box.min.z);
}

/**
 * Called when selecting and placing pieces in the block puzzle.
 */
function buildBlock() {
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(intersectableObjects);

    if(intersects.length > 0) {
        var intersected = intersects.find(function(element){
            return currentObject !== element.object;
        }).object;
        console.log(intersected);

        //if clicking on a block
        if(blocks.includes(intersected) && intersected.placed === false){
            //select the block
            currentObject = intersected;
        }
        //place the block in the same position as its ghost
        else if(currentObject && currentObject.ghost.visible === true){
            currentObject.position.copy(currentObject.ghost.position);
            currentObject.ghost.visible = false;
            currentObject = null;
        }
    }
}

//TODO: update function to work with the building of the house
/**
 * Place the selected block on the building
 */
function placeBlock(){

}


function getAngry(){
    playSound("anger " + attempts);
    attempts += 1;
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

    //TODO: make subtitles for the level
    //add subtitles
    // let subs = subtitles.audio.find(function(element){
    //     return element.name.includes(name);
    // });
    //
    // if(subs){
    //     for(let i in subs.lines){
    //         setTimeout(function(){
    //             let subtitle = document.getElementById("subs");
    //             subtitle.innerText = subs.lines[i].text;
    //         }, subs.lines[i].offset);
    //     }
    // }

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
    camera.position.set(-13.1, 6.8, 10.3);

    //
    // LOADING
    //

    //load the bedroom
    loadWorldFBX('Newest.3.15.18.fbx',
        function(object){
            console.log(object);

            for(let i in object.children){
                let child = object.children[i];

                //center the geometries for the blockos in the room
                //TODO ask Isaiah to include "Blockos" or something in the names of the blocks
                if((child.name.includes("Foundation") ||
                    child.name.includes("Door_") ||
                    child.name.includes("Stairs") ||
                    child.name.includes("Window_") ||
                    child.name.includes("Chimney") ||
                    child.name.includes("Roof")) && child.geometry){

                    //add the blocks to the array of blocks
                    blocks.push(child);

                    //TODO: add random rotation to puzzle pieces

                    //generate the bounding box for it and find the center point, using the position as the offset
                    child.geometry.computeBoundingBox();
                    let box = child.geometry.boundingBox;
                    let resetPos = {
                        x: 0.5 * (box.max.x + box.min.x) + child.position.x,
                        y: 0.5 * (box.max.y + box.min.y) + child.position.y,
                        z: 0.5 * (box.max.z + box.min.z) + child.position.z
                    };

                    //center the geometry and move it back to its original location
                    child.geometry.center();
                    child.position.copy(resetPos);

                    //boolean field that tells whther the piece has been placed or not
                    child.placed = false;

                    //create the ghosts that will be displayed in the original
                    let ghost = child.clone();

                    //copy the materials and make them transparent
                    //some blocks have multiple materials
                    if(ghost.material.length){
                        //for some reason, this is the only way that works, and not material[i] = material[i].clone()
                        ghost.material = [];
                        for(let i in child.material){
                            ghost.material.push(child.material[i].clone());
                            ghost.material[i].transparent = true;
                            ghost.material[i].opacity = 0.3;
                        }
                    }
                    //otherwise there is one material
                    else{
                        ghost.material = child.material.clone();
                        ghost.material.transparent = true;
                        ghost.material.opacity = 0.3;
                    }
                    ghost.visible = false;

                    //give block a reference to its ghost
                    child.ghost = ghost;

                    scene.add(ghost);




                }
                //add the parts of the house to the house object for later
                else if(child.name.includes("polySurface124") || //chimney
                        child.name.includes("polySurface72") || //roof
                        child.name.includes("polySurface183")|| //smaller roof
                        child.name.includes("polySurface87") || //back window
                        child.name.includes("polySurface116") || //side window
                        child.name.includes("polySurface122") || //front window
                        child.name.includes("polySurface83") || //door
                        child.name.includes("polySurface109") || //walls
                        child.name.includes("polySurface92") || //step
                        child.name.includes("polySurface189")){ //base

                    if(child.name === "polySurface189"){
                        base = child;
                    }

                    child.geometry.computeBoundingBox();
                    let box = child.geometry.boundingBox;
                    let resetPos = {
                        x: 0.5 * (box.max.x + box.min.x) + child.position.x,
                        y: 0.5 * (box.max.y + box.min.y) + child.position.y,
                        z: 0.5 * (box.max.z + box.min.z) + child.position.z
                    };

                    //center the geometry and move it back to its original location
                    child.geometry.center();
                    child.position.copy(resetPos);
                    console.log(child.name);

                    //move the pieces into the building area
                    child.position.x -= 1.5;
                    child.position.y += 1.5;
                    child.position.z -= 26;
                }
            }
        });

    //load audio

    loadSound('anger 1.m4a');
    loadSound('anger 2.m4a');
    loadSound('anger 3.m4a');
    loadSound('anger 4.m4a');
    loadSound('anger 5.m4a');

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
        else if(String.fromCharCode(event.keyCode) === "o"){
            controls.enabled = !controls.enabled;
        }
        else if(String.fromCharCode(event.keyCode) === "p"){
            console.log(base.position);
        }
        else if(String.fromCharCode(event.keyCode) === "x"){
            base.position.x -= .1;
        }
        else if(String.fromCharCode(event.keyCode) === "z"){
            base.position.z -= .1;
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

    window.addEventListener("mousedown", () => {
        if(controlsEnabled) {
            buildBlock();
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