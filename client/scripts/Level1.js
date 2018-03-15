if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, controls;
var camera, scene, renderer, light;
var teacher = {};
var child;
var controlsUsed = false;

var audioListener;
var sounds = [];

var cameraPosition = 1;
var cameraDirection = null;

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
var colorPaperAnswers;
var colorPaperScore = 0;
var colorsUsed = [];
var extraPapers = []

var paths = [];
var splineTargets = [];
splineTargets.push({x: 2.45540189743042, y: 1.3381956815719604, z: 1.428936243057251});
splineTargets.push({x: 8.0117347240448, y: 1.3381956815719604, z: 2.7985452115535736});
splineTargets.push({x: 8.132792711257935, y: 1.3381957411766052, z: 8.569308996200562});
splineTargets.push({x: 2.9254701137542725, y: 1.3381956815719604, z: 11.149720668792725});
var currentTable = null;

var lookatPosition = {x: 5, y: 2, z: 6};
var lookatRotation;

var subtitles;

var logger = new Logger('player id', 1);

init();

loadJSON("colorPaperAnswers", (result) => { 
    colorPaperAnswers = result
});

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

function onMouseMove() {
    if(controlsEnabled) {
        event.preventDefault();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y =  - ( event.clientY / window.innerHeight ) * 2 + 1;


        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(intersectableObjects);

        if(intersects.length > 0) {
            //grab the first object that is no the current object
            var intersected = intersects.find(function(element){
                return currentObject !== element.object;
            }).object;

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
                        if(currentObject) {
                            document.body.style.cursor = 'none';
                            currentObject.ghost.visible = true;
                        }
                        else {
                            document.body.style.cursor = 'pointer';
                        }

                        if(currentHover && currentHover.name.includes('Paper')) {
                            currentHover.material = previousMaterial;
                            currentHover = null;
                        }

                        if(!intersected.name.includes('Box')) {
                            if(!currentHover) {
                                currentHover = intersected;
                                currentHover.position.set(currentHover.originalPosition.x + 0.015, currentHover.originalPosition.y, currentHover.originalPosition.z - 0.025);
                            }
                            else if(currentHover.name !== intersected.name) {
                                currentHover.position.set(currentHover.originalPosition.x, currentHover.originalPosition.y, currentHover.originalPosition.z);
                                currentHover = intersected;
                                currentHover.position.set(currentHover.originalPosition.x + 0.015, currentHover.originalPosition.y, currentHover.originalPosition.z - 0.025);
                            }
                        }
                        else if(currentHover) {
                            currentHover.position.set(currentHover.originalPosition.x, currentHover.originalPosition.y, currentHover.originalPosition.z);
                            currentHover = null
                        }
                    }
                    else if(intersected.name.includes('Paper')) {
                        if(!currentObject) {
                            document.body.style.cursor = 'default';
                        }
                        else {
                            document.body.style.cursor = 'none';
                        }

                        if(currentHover && currentHover.name.includes('Crayon')) {
                            currentHover.position.set(currentHover.originalPosition.x, currentHover.originalPosition.y, currentHover.originalPosition.z);
                            currentHover = null
                        }
                        else if(!intersected.name.includes('Outline')) {
                            if(currentObject) {
                                if(coloredObjects.includes(intersected.name)) {
                                    if(!currentHover) {
                                        currentHover = intersected;
                                        newMaterial = currentHover.material.clone();
                                        newMaterial.color = currentObject.material[0].color;
                                        previousMaterial = currentHover.material.clone();
                                        currentHover.material = newMaterial;
                                    }
                                    else {
                                        currentHover.material = previousMaterial;
                                        currentHover = intersected;
                                        newMaterial = currentHover.material.clone();
                                        newMaterial.color = currentObject.material[0].color;
                                        previousMaterial = currentHover.material.clone();
                                        currentHover.material = newMaterial;
                                    }
                                }
                                else if(currentHover) {
                                    if(coloredObjects.includes(currentHover.name)) {
                                        currentHover.material = previousMaterial;
                                    }
                                    currentHover = null;
                                }
                            }
                        }
                        else {
                            if(currentHover) {
                                if(coloredObjects.includes(currentHover.name)) {
                                    currentHover.material = previousMaterial;
                                }
                                currentHover = null;
                            }
                        }
                    }
                    else {
                        
                        if(!currentObject) {
                            document.body.style.cursor = 'default';
                        }
                        else {
                            document.body.style.cursor = 'none';
                            currentObject.ghost.visible = false;
                        }

                        if(currentHover && currentHover.name.includes('Crayon')) {
                            currentHover.position.set(currentHover.originalPosition.x, currentHover.originalPosition.y, currentHover.originalPosition.z);
                            currentHover = null
                        }
                        else if(currentHover && currentHover.name.includes('Paper')) {
                            currentHover.material = previousMaterial;
                            currentHover = null;
                        }
                    }

                    moveCrayon(intersects);
                    break;
                case 3:
                    if(posted === false) {
                        document.body.style.cursor = 'pointer'
                        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
                        vector.unproject(camera);
                        var dir = vector.sub( camera.position ).normalize();
                        var distance = - camera.position.z / dir.z;
                        var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
                        pos.set(-2.15*(pos.x + 2.75), -2.25*(pos.y - 1.4), pos.z - 7.65);
                        paper.position.copy(pos);
                    }
                    break;
            }
        }
    }
}

function moveCrayon(intersects) {
    //if there is a currently selected crayon, make it hover over the mouse position
    if(currentObject){
        //the hover point is the first object in the intersection array
        let hoverPoint = intersects.find(function(element){
            return currentObject.name !== element.object.name;
        }).point;

        //find the point that is 90% of the way along the ray cast
        let crayonPos = {
            x: camera.position.x + (hoverPoint.x - camera.position.x)*.9,
            y: camera.position.y + (hoverPoint.y - camera.position.y)*.9,
            z: camera.position.z + (hoverPoint.z - camera.position.z)*.9
        };

        //place the crayon at that position, plus some offset to place the tip at the mouse pointer
        currentObject.position.set(crayonPos.x+.07, crayonPos.y+.025, crayonPos.z-.04);

    }
}

function colorPaper() {
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(intersectableObjects);

    if(intersects.length > 0) {
        var intersected = intersects.find(function(element){
            return currentObject !== element.object;
        }).object;

        //if clicking on crayons or the box
        if (intersected.name.includes('Crayon')) {
            //if clicking on the box, put the crayon away
            if(intersected.name.includes('Crayon_Box')){
                currentObject.rotation.set(0, 0, 0);
                currentObject.position.set(currentObject.originalPosition.x, currentObject.originalPosition.y, currentObject.originalPosition.z);
                currentObject = null;
            }
            //else pick up the crayon
            else {
                //reset the current crayon if there is one
                if(currentObject) {
                    currentObject.rotation.set(0, 0, 0);
                    currentObject.position.set(currentObject.originalPosition.x, currentObject.originalPosition.y, currentObject.originalPosition.z);
                }

                //pick up the crayon
                currentObject = intersected;
                currentObject.rotation.set(0, Math.PI*5/6, Math.PI*11/6);
                moveCrayon(intersects)
            }

            playSound("Click");
        }
        else if(intersected.name.includes('Paper') && coloredObjects.includes(intersected.name) && !intersected.name.includes("Outline") && currentObject) {
            intersected.material.color = currentObject.material[0].color;
            updatePaperScore(intersected.name, currentObject.material[0].name)
            var paperIndex = coloredObjects.findIndex((object) => {
                return object.includes(intersected.name)
            });
            coloredObjects.splice(paperIndex, 1);

            playSound("Writing");

            if(coloredObjects.length === 0) {
                startCutScene();
                logger.logTask("Color paper", colorPaperScore / 14, colorsUsed);
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
                    paper.scale.multiplyScalar(0.8)
                    scene.add(paper);
                }, 8000);

                // setTimeout(() => {
                //     for(var i in extraPapers) {
                //         extraPapers[i].visible = true;
                //     }
                // }, 5000)
            }
        }
    }
}

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

    colorsUsed.push({
        name: piece.name,
        colorUsed: crayonColor
    })
}

/**
 * function to be called whenever the camera needs to look at the center of all of the tables
 */
function lookAtCenter(){
    let originalRot = {x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z};
    camera.lookAt(lookatPosition.x, lookatPosition.y, lookatPosition.z);
    lookatRotation = {x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z};
    camera.rotation.x = originalRot.x;
    camera.rotation.y = originalRot.y;
    camera.rotation.z = originalRot.z;
    new TWEEN.Tween(camera.rotation).to(lookatRotation, 1500).interpolation( TWEEN.Interpolation.CatmullRom ).start();
}

function lookAtTeacher(){
    // grab camera rotation on view of teacher
    let rot = {x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z};
    camera.lookAt(new THREE.Vector3(4, 3.55, -1));
    var teacherView = {
        x: camera.rotation.x,
        y: camera.rotation.y,
        z: camera.rotation.z
    };
    camera.rotation.set(rot.x, rot.y, rot.z);
    //-1.0581080584316573, -0.5617291507874522, 0

    // Tween camera to view teacher
    var lookAtTeacher = new TWEEN.Tween(camera.rotation).to(teacherView, 2000);
    lookAtTeacher.start();

}

/**
 * makes the camera appear to sit down at the table
 */
function sitAtTable(){
    setTimeout(function(){
        new TWEEN.Tween(camera.position).to({x: 6.962359430337607, y: 2.121043760351845, z: 4.453431362994369}, 1000).onComplete(function(){
            lookAtTeacher();
            playSound("HowToDraw");
        }).start();
    }, 500);
    // {x: 6.962359430337607, y: 2.121043760351845, z: 4.453431362994369}
    // {x: -1.0581080584316573, y: -0.5617291507874522, z: 0}, 2000
}

function selectTable() {
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(intersectableObjects);

    if(intersects.length > 0) {
        var intersected = intersects[0].object;
        if(intersected.name.includes("Table") && !intersected.name.includes("Path")){
            startCutScene();
            console.log(intersected);
            if(currentHover) {
                currentHover.material = previousMaterial;
                currentHover = null
            }
            //select the correct spline to move along, depending on the current table you are at
            //starting position
            if(currentTable === null){
                if(intersected.name.includes("Green")){
                    currentTable = "Green";
                    console.log(currentTable);
                    moveAlongSpline(0, -1, 3);
                }
                else if(intersected.name.includes("Red")){
                    currentTable = "Red";
                    moveAlongSpline(1, -1, 4, function(){
                        sitAtTable();
                    });
                }
                else if(intersected.name.includes("Yellow")){
                    currentTable = "Yellow";
                    moveAlongSpline(2, -1, 4);
                }
                else if(intersected.name.includes("Blue")){
                    currentTable = "Blue";
                    moveAlongSpline(3, -1, 3);
                }
            }
            //green table
            else if(currentTable === "Green"){
                if(intersected.name.includes("Red")){
                    currentTable = "Red";
                    moveAlongSpline(5, -1, 3, function(){
                        sitAtTable();
                    });
                }
                else if(intersected.name.includes("Yellow")){
                    currentTable = "Yellow";
                    moveAlongSpline(8, -1, 4);
                }
                else if(intersected.name.includes("Blue")){
                    currentTable = "Blue";
                    moveAlongSpline(9, 1, 3);
                }
            }
            //yellow table
            else if(currentTable === "Yellow"){
                if(intersected.name.includes("Green")){
                    currentTable = "Green";
                    moveAlongSpline(8, 1, 4);
                }
                else if(intersected.name.includes("Red")){
                    currentTable = "Red";
                    moveAlongSpline(6, -1, 2, function(){
                        sitAtTable();
                    });
                }
                else if(intersected.name.includes("Blue")){
                    currentTable = "Blue";
                    moveAlongSpline(7, 1, 3);
                }
            }
            //blue table
            else if(currentTable === "Blue"){
                if(intersected.name.includes("Green")){
                    currentTable = "Green";
                    moveAlongSpline(9, -1, 3);
                }
                else if(intersected.name.includes("Red")){
                    currentTable = "Red";
                    moveAlongSpline(4, -1, 3, function(){
                        sitAtTable();
                    });
                }
                else if(intersected.name.includes("Yellow")){
                    currentTable = "Yellow";
                    moveAlongSpline(7, -1, 3);
                }
            }

            //tell the player that they selected the wrong table
            if(currentTable !== "Red") {
                attempts++;

                setTimeout(function () {

                    //move them to the correct table
                    if (attempts === 3) {
                        attempts++;
                        logger.logTask("Select Table", attempts)
                        playSound("ShowToSeat");
                        nextPosition();
                    }
                    if (attempts === 1) {
                        playSound("NotSeatOne");
                    } else if (attempts === 2) {
                        playSound("NotSeatTwo");
                    }

                }, 3500);
            }
            else{
                attempts++;
                logger.logTask("Select Table", attempts)
                nextPosition();
            }

        }
    }
}

/**
 * Function that is used to turn the camera when looking at the tables around the classroom
 */
function lookAround(){
    if(controlsEnabled === true && cameraPosition === 1){
        if(cameraDirection === "right"){
            camera.rotation.y -= .005;
        }
        else if(cameraDirection === "left"){
            camera.rotation.y += .005;
        }
    }
}

function postPaper() { 
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(intersectableObjects);

    if(intersects.length > 0) {
        var whiteBoardIndex = intersects.findIndex((intersected) => {
            return intersected.object.name.includes("WhiteBoard")
        });

        if(whiteBoardIndex >= 0) {
            if(!posted) {
                var currentZoom = {
                    value: camera.zoom
                };

                var nextZoom = {
                    value: camera.zoom * 0.65
                };

                var zoomOut = new TWEEN.Tween(currentZoom).to(nextZoom, 750);
                zoomOut.onUpdate(() => {
                    camera.zoom = currentZoom.value
                });
                zoomOut.start();

                //mock the player and display their results
                zoomOut.onComplete(() => {
                    playSound("HackJob");
                    setTimeout(function(){
                        showEndScreen();
                    },10000);
                })
            }
            posted = true;
            startCutScene();
        }
    }
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

/**
 * Show camera controls when looking around the classroom
 * @param which Optional "left" or "right" to only show one of the controls on the left or right.
 */
function showCameraControls(which){
    var leftBar = document.getElementById("left_bar");
    var rightBar = document.getElementById("right_bar");

    if(which === "left") {
        leftBar.classList.remove("controls-fade-out");
        leftBar.classList.add("controls-fade-in");
    }
    else if(which === "right") {
        rightBar.classList.remove("controls-fade-out");
        rightBar.classList.add("controls-fade-in");
    }
    else{
        leftBar.classList.remove("controls-fade-out");
        rightBar.classList.remove("controls-fade-out");
        leftBar.classList.add("controls-fade-in");
        rightBar.classList.add("controls-fade-in");
    }

    setTimeout(() => {
        if(which != "right") {
            leftBar.style.opacity = 0.5;
        }
        if(which != "left") {
            rightBar.style.opacity = 0.5;
        }
    }, 950);
}

/**
 * Hide camera controls when looking around the classroom
 * @param which Optional "left" or "right" to only hide one of the controls on the left or right.
 */
function hideCameraControls(which){
    var leftBar = document.getElementById("left_bar");
    var rightBar = document.getElementById("right_bar");

    if(which === "left"){
        leftBar.classList.remove("controls-fade-in");
        leftBar.classList.add("controls-fade-out");
    }
    else if(which === "right"){
        rightBar.classList.remove("controls-fade-in");
        rightBar.classList.add("controls-fade-out");
    }
    else {
        leftBar.classList.remove("controls-fade-in");
        rightBar.classList.remove("controls-fade-in");
        leftBar.classList.add("controls-fade-out");
        rightBar.classList.add("controls-fade-out");
    }

    setTimeout(() => {
        if(which != "right") {
            leftBar.style.opacity = 0;
        }
        if(which != "left") {
            rightBar.style.opacity = 0;
        }
    }, 950);
}

function fade() {
    var curtain = document.getElementById("curtain");
    curtain.classList.remove("screen-change");
    curtain.offsetWidth;
    curtain.classList.add("screen-change");
}

/**
 * Shows the end screen with the player's results and gives them the ability to continue or return to the main menu
 */
function showEndScreen(){
    let canvas = document.getElementById("canvas");
    let endScreen = document.getElementById("endgame");
    endScreen.style.display = 'block'
    let blur = {blur: 0};

    //slowly blur the screen
    let blurTween = new TWEEN.Tween(blur).to({blur: 5}, 2000);
    blurTween.onUpdate(function(object){
        canvas.style.filter = "blur(" + blur.blur + "px)";
        endScreen.style.opacity = ""+blur.blur/5;
    });
    //make the mouse visible again
    blurTween.onComplete(function(){
        document.body.style.cursor = "default";
    })
    blurTween.start();
    console.log("level over");
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

function nextPage() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText)
        document.location.href = response.redirect;
      }
    };
    xhttp.open("GET", "/unseeable/nextPage", true);
    xhttp.send();
}

function init() {
    startCutScene();

    let cont = document.getElementById('continue')
    cont.addEventListener('click', nextPage)

    //create the scene
    scene = new THREE.Scene();

    //create camera that will be used
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 2000 );
    camera.rotation.reorder( "YXZ" );
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById("canvas")});
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    //camera controls, mostly for debugging purposes
    controls = new THREE.OrbitControls( camera );
    controls.target = new THREE.Vector3(3, 1, 5);
    controls.enabled = false; //set to false to turn off controls

    //initial camera position
    camera.position.set(-6.342057562830126, 2.340890947024859, 6.883271833415659);
    camera.rotation.set(-0.09963408823470919, -1.5005061696940256, 2.0920433907298925e-17);

    //
    // LOADING
    //

    //load the classroom
    loadWorldFBX('Preschool_New3.9.18.fbx',
        function(object){
        console.log(object);
            for(let i in object.children) {
                let child = object.children[i];

                //save the parts of the paper to the appropriate sections
                if (child.name.includes("MainPaper")) {
                    paperGroup.push(child);

                    if (!child.name.includes("Outline")) {
                        coloredObjects.push(child.name);
                    }
                }

                //turn off shadow casting/receiving for the appropriate objects
                if(child.name.includes("Paper")){
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
                else if(child.name.includes("Crayon")){
                    child.receiveShadow = false;

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

                    //store the original position of the crayon for when placing it back in the box
                    child.originalPosition = boxPos;

                    if(child.name.includes('Main') && !child.name.includes('Box')) {
                        let currentObjectClone = child.clone();
                        currentObjectClone.material = [child.material[0].clone(),child.material[1].clone()];
                        currentObjectClone.material[0].opacity = 0.3;
                        currentObjectClone.material[1].opacity = 0.3;
                        currentObjectClone.material[0].transparent = true;
                        currentObjectClone.material[1].transparent = true;
                        currentObjectClone.position.set(child.originalPosition.x, child.originalPosition.y, child.originalPosition.z);
                        currentObjectClone.rotation.set(0,0,0);
                        currentObjectClone.visible = false;
                        scene.add(currentObjectClone);
                        child.ghost = currentObjectClone;
                    }
                }
                //sky sphere
                else if(child.name.includes("pSphere10")){
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            
            }

            var loadingScreen = document.getElementById("loading");
            var progressBar = document.getElementById("myProgress")
            var loadingBar = document.getElementById("myBar");
            if(loadingBar.innerText === "100%"){
                loadingScreen.offsetWidth;
                loadingBar.offsetWidth;
                progressBar.offsetWidth;
                loadingScreen.classList.add("fade-out-loading");
                loadingBar.classList.add("fade-out-loading");
                progressBar.classList.add("face-out-loading");
            
                setTimeout(() => {
                    loadingScreen.style.opacity = 0;
                    loadingBar.style.opacity = 0;
                    progressBar.style.opacity = 0;
                    playSound("TakeSeats");
                }, 950);
            }
        });

    loadStaticFBX('Colored Papers.fbx', (object) => {
        for(i in object.children) {
            let child = object.children[i];

            child.position.set(child.position.x + 0.5, child.position.y, child.position.z - 3.3);
            child.visible = false;
            extraPapers.push(child);
        }
    })

    //load and place the teacher
    loadAnimationFBX('Idle.fbx',
        function(object){
            teacher = object;
            teacher.position.set(6, -.05, -3);
            let scale = 2.2;
            teacher.scale.set(scale, scale, scale);
        });

    //load and place the children GREEN TABLE
    loadAnimationFBX2("T-Pose (1).fbx",
        ["Sitting (1).fbx"],
        function(object){
            child = object;
            let scale = 2.4;
            object.scale.set(scale, scale, scale);
            object.position.set(3.2, .5, -0.4);
            object.rotation.y = -Math.PI/8;
            playAnimation(object, "Sitting (1)");
        });

    //load and place the children RED TABLE
    loadAnimationFBX2("T-Pose (1).fbx",
        ["Sitting Idle (1).fbx"],
        function(object){
            child = object;
            let scale = 2.4;
            object.scale.set(scale, scale, scale);
            object.position.set(9.4, .5, 1);
            object.rotation.y = -Math.PI/4;
            playAnimation(object, "Sitting Idle (1)");
        });

    //load and place the children YELLOW TABLE
    loadAnimationFBX2("T-Pose (1).fbx",
        ["Sitting Talking.fbx"],
        function(object){
            child = object;
            let scale = 2.4;
            object.scale.set(scale, scale, scale);
            object.position.set(7.8, .5, 10.8);
            object.rotation.y = Math.PI*7/8;
            playAnimation(object, "Sitting Talking");
        });

    //load and place the children BLUE TABLE
    loadAnimationFBX2("T-Pose (1).fbx",
        ["Sitting2.fbx"],
        function(object){
            child = object;
            let scale = 2.4;
            object.scale.set(scale, scale, scale);
            object.position.set(.6, .5, 11);
            object.rotation.y = Math.PI/2;
            playAnimation(object, "Sitting2");
        });

    //load audio

    // load subtitles
    loadJSON("level1subs", function(json){
        subtitles = json;
    });

    //kids playing in background
    loadSound('kids-playing-1.mp3', 0.025, true, true);

    //click sound
    loadSound('Click.mp3', 0.15);

    //drawing sound
    loadSound('Writing.wav', 0.15);

    //teacher dialogue to sit
    loadSound('TakeSeats.ogg', 0.4, false, false, () => {
        endCutScene();
        setTimeout(() => {
            logger.recordTaskStartTime();
        }, 950);
    });

    //teacher dialogue with first wrong attempt
    loadSound('NotSeatOne.ogg', 0.4, false, false, () => {
        lookAtCenter();
        endCutScene();
    });

    //teacher dialogue with second wrong attempt
    loadSound('NotSeatTwo.ogg', 0.4, false, false, () => {
        lookAtCenter();
        endCutScene();
    });

    //teacher dialogue showing to right table
    loadSound('ShowToSeat.ogg', 0.4, false, false, function(){
        if(currentTable === "Green"){
            currentTable = "Red";
            moveAlongSpline(5, -1, 3, function(){
                sitAtTable();
            });
        }
        else if(currentTable === "Yellow"){
            currentTable = "Red";
            moveAlongSpline(6, -1, 2.5, function(){
                sitAtTable();
            });
        }
        else if(currentTable === "Blue"){
            currentTable = "Red";
            moveAlongSpline(4, -1, 3, function(){
                sitAtTable();
            });

        }
    });

    //teacher dialogue about coloring
    loadSound('HowToDraw.ogg', 0.4, false, false, function(){
        new TWEEN.Tween(camera.rotation).to({x: -1.0581080584316573, y: -0.5617291507874522, z: 0}, 1300).start();
        endCutScene();
        logger.recordTaskStartTime();
    });

    //teacher dialogue when coloring is finished
    loadSound('FinishColoring.ogg', 0.3, false, false, () => {
        // fade to view of whiteboard after audio ends
        fade();
        setTimeout(() => {
            camera.position.set(0.11333127647429019, 1.5369136371003131, -2.028078509213737);
            camera.rotation.set(0.490486809597034, 0.0016298261023861107, 0);
            
            for(var i in extraPapers) {
                extraPapers[i].visible = true;
            }
        }, 1000)

        setTimeout(() => {
            endCutScene();
        }, 2000);
    });

    //kids mocking the bad painting
    loadSound('HackJob.ogg', 0.4, false, false, () => {
        logger.endLog();
    });

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

    //event listeners for turning the camera left when looking at tables
    let leftBar = document.getElementById("left_bar");
    leftBar.addEventListener("mouseenter", function(){
        if(cameraPosition === 1) {
            cameraDirection = "left";
            showCameraControls("left");
            if (controlsUsed === false) {
                hideCameraControls("right");
                controlsUsed = true;
            }
        }
    });
    leftBar.addEventListener("mouseleave", function(){
        cameraDirection = null;
        hideCameraControls("left");
    });

    //event listeners for turning the camera right when looking at tables
    let rightBar = document.getElementById("right_bar");
    rightBar.addEventListener("mouseenter", function(){
        if(cameraPosition === 1) {
            cameraDirection = "right";
            showCameraControls("right");
            if (controlsUsed === false) {
                hideCameraControls("left");
                controlsUsed = true;
            }
        }
    });
    rightBar.addEventListener("mouseleave", function(){
        cameraDirection = null;
        hideCameraControls("right");
    });

    // element.addEventListener("keypress", function(event){
    //     if(String.fromCharCode(event.keyCode) === "c"){
    //         console.log(camera);
    //     }
    //     else if(String.fromCharCode(event.keyCode) === "f"){
    //         logger.printLog();
    //     }
    //     else if(String.fromCharCode(event.keyCode) === "t"){
    //         console.log(coloredObjects)
    //     }
    //     else if(String.fromCharCode(event.keyCode) === "o"){
    //         controls.enabled = !controls.enabled;
    //     }
    //     else if(String.fromCharCode(event.keyCode) === "m"){
    //         showEndScreen();
    //     }
    //     else if(String.fromCharCode(event.keyCode) === " "){
    //         nextPosition();
    //     }
    // }, false);

    // window.addEventListener("dblclick", () => {
    //     if(colormode === 1) {
    //         revertColors(document);
    //         for(var i in paths) {
    //             paths[i].visible = true;
    //         }
    //         colormode = 0
    //     }
    //     else {
    //         changeColorVision();
    //         for(var i in paths) {
    //             paths[i].visible = false;
    //         }
    //         colormode = 1
    //     }
    // });

    window.addEventListener("mousemove", onMouseMove);

    window.addEventListener("mousedown", () => {
        if(controlsEnabled) {
            switch(cameraPosition) {
                case 1:
                    selectTable();
                    playSound("Click.mp3");
                    break;
                case 2:
                    colorPaper();
                    break;
                case 3:
                    postPaper();
                    break;
            }
        }
    });

    window.addEventListener( 'resize', onWindowResize, false );

    animate();
    startCutScene();
}

window.onload = changeColorVision();

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
                //update the art score for the end menu
                document.getElementById("numCorrect").innerText = colorPaperScore;
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

    lookAround();

    renderer.render( scene, camera );
}