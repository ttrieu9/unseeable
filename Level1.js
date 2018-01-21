if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, controls;
var camera, scene, renderer, light;
var teacher = {};

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
splineTargets.push({x: 2.45540189743042, y: 1.3381956815719604, z: 1.428936243057251});
splineTargets.push({x: 8.0117347240448, y: 1.3381956815719604, z: 2.7985452115535736});
splineTargets.push({x: 8.132792711257935, y: 1.3381957411766052, z: 8.569308996200562});
splineTargets.push({x: 2.9254701137542725, y: 1.3381956815719604, z: 11.149720668792725});
var currentTable = null;

var lookatPosition = {x: 5, y: 2, z: 6};
var lookatRotation;

var camPosIndex;

init();

function disableControls() {
    controlsEnabled = false;
    document.body.style.cursor = 'none';
}

function enableControls() {
    controlsEnabled = true;
    document.body.style.cursor = 'default';
}

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

            playSound("Click.mp3");
        }
        else if(intersected.name.includes('Paper') && coloredObjects.includes(intersected.name) && !intersected.name.includes("Outline") && currentObject) {
            intersected.material = currentObject.material[0];
            var paperIndex = coloredObjects.findIndex((object) => {
                return object.includes(intersected.name)
            });
            coloredObjects.splice(paperIndex, 1);

            playSound('Writing.wav');

            if(coloredObjects.length === 2) {
                startCutScene();
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
        new TWEEN.Tween(camera.position).to({x: 6.962359430337607, y: 2.121043760351845, z: 4.453431362994369}, 2000).onComplete(function(){
            lookAtTeacher();
            playSound('HowToDraw.ogg');
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
            //TODO: find a less ugly of selecting which spline to traverse besides all these ifs
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
                setTimeout(function () {

                    //move them to the correct table
                    if (attempts === 2) {
                        playSound('ShowToSeat.ogg');
                        nextPosition();
                    }

                    attempts++;
                    if (attempts === 1) {
                        playSound('NotSeatOne.ogg');
                    } else if (attempts === 2) {
                        playSound('NotSeatTwo.ogg');
                    }

                }, 3500);
            }
            else{
                nextPosition();
            }

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
                zoomOut.onComplete(() => {
                    playSound('HackJob.ogg');
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
    }, 1000);
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
    if(name !== null){
        //search the array of sounds for a sound with the given name and play it
        for(let i in sounds){
            if(sounds[i].name === name){
                sounds[i].play();
                return;
            }
        }
    }
}

function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

    }

};

function onError( xhr ) {

    console.error( xhr );

};

function init() {
    startCutScene();
    //create the scene
    scene = new THREE.Scene();

    //create camera that will be used
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 2000 );
    camera.rotation.reorder( "YXZ" );
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //camera controls, mostly for debugging purposes
    controls = new THREE.OrbitControls( camera );
    controls.enabled = false; //set to false to turn off controls

    //initial camera position
    camera.position.set(-6.342057562830126, 2.340890947024859, 6.883271833415659);
    camera.rotation.set(-0.09963408823470919, -1.5005061696940256, 2.0920433907298925e-17);

    //
    // LOADING
    //

    //load the classroom
    loadWorldFBX('Progress_1.11.2018.fbx',
        function(object){
            for(let i in object.children) {
                let child = object.children[i];
                if (child.name.includes("MainPaper")) {
                    paperGroup.push(child);

                    if (!child.name.includes("Outline")) {
                        coloredObjects.push(child.name);
                    }
                }
            }
        }, onProgress, onError);

    //load and place the teacher
    loadAnimationFBX('Idle.fbx',
        function(object){
            teacher = object;
            teacher.position.set(4, -.05, -1);
            let scale = 2.2;
            teacher.scale.set(scale, scale, scale);
        }, onProgress, onError);

    //load sounds

    //kids playing in background
    loadSound('kids-playing-1.mp3', 0.025, true, true);

    //click sound
    loadSound('Click.mp3', 0.15);

    //drawing sound
    loadSound('Writing.wav', 0.15);

    //teacher dialogue to sit
    loadSound('TakeSeats.ogg', 0.4, false, false, () => {
        endCutScene();
    });

    //TODO: add onEnd() functions to these, which will turn camera to look at the rest of the tables
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
            moveAlongSpline(5, -1, 3);
        }
        else if(currentTable === "Yellow"){
            currentTable = "Red";
            moveAlongSpline(6, -1, 2.5);
        }
        else if(currentTable === "Blue"){
            currentTable = "Red";
            moveAlongSpline(4, -1, 3);

        }
    });

    //teacher dialogue about coloring
    loadSound('HowToDraw.ogg', 0.4, false, false, function(){
        new TWEEN.Tween(camera.rotation).to({x: -1.0581080584316573, y: -0.5617291507874522, z: 0}, 1300).start();
        endCutScene();
    });

    //teacher dialogue when coloring is finished
    loadSound('FinishColoring.ogg', 0.3, false, false, () => {
        // fade to view of whiteboard after audio ends
        fade();
        setTimeout(() => {
            camera.position.set(0.11333127647429019, 1.5369136371003131, -2.028078509213737);
            camera.rotation.set(0.490486809597034, 0.0016298261023861107, 0);
        }, 1000)

        setTimeout(() => {
            endCutScene();
        }, 2000);
    });

    //kids mocking the bad painting
    loadSound('HackJob.ogg', 0.4);

    //create raycaster for object selection
    raycaster = new THREE.Raycaster();
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

    var element = document.body;


    element.addEventListener("keypress", function(event){
        if(String.fromCharCode(event.keyCode) === "c"){
            console.log(camera);
        }
        else if(String.fromCharCode(event.keyCode) === "f"){
            fade();
        }
        else if(String.fromCharCode(event.keyCode) === "t"){
            startCutScene();
        }
        else{
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

    light = new THREE.PointLight(0xd6d498, 1, 50, 1);
    light.position.set(-4, 9, -1);
    light.castShadow = true;
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    scene.add(light);

    light = new THREE.PointLight(0xd6d498, 1, 50, 1);
    light.position.set(4, 9, -1);
    light.castShadow = true;
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    scene.add(light);

    light = new THREE.PointLight(0xd6d498, 1, 50, .7);
    light.position.set(-4, 9, 10);
    // light.castShadow = true;
    // light.shadowMapWidth = 1024;
    // light.shadowMapHeight = 1024;
    scene.add(light);

    light = new THREE.PointLight(0xd6d498, 1, 50, .7);
    light.position.set(4, 9, 10);
    // light.castShadow = true;
    // light.shadowMapWidth = 1024;
    // light.shadowMapHeight = 1024;
    scene.add(light);

    // light = new THREE.AmbientLight( 0x656565 ); // soft white light
    // scene.add( light );

    var spotLight = new THREE.SpotLight( 0x222222 );
    spotLight.position.set( 100, 1000, 100 );

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add( spotLight );

    light = new THREE.AmbientLight(0xd6d498, .1);
    // /scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(0, 10, -50);
    light.rotation.x = Math.PI / 2;
    // scene.add(light);

    animate();
    startCutScene();
    setTimeout(() => {
        playSound('TakeSeats.ogg');
    }, 3000)
}

window.onload = changeColorVision();

function nextPosition(){
    switch(cameraPosition){
        case 1:
            cameraPosition = 2;
            //TODO make the following the onEnded function of the above spline
            // setTimeout(function(){
            //     rotSteps = [];
            //     walkSteps = [];
            //     addStep({x: 6.962359430337607, y: 2.121043760351845, z: 4.453431362994369}, {x: -1.0581080584316573, y: -0.5617291507874522, z: 0}, 2000);
            //     beginWalk();
            // }, 4000);
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
                playSound('FinishColoring.ogg');
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