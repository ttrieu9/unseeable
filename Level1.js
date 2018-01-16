if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, controls;
var camera, scene, renderer, light;
var teacher = {};

var audioListener;
var sounds = [];

var cameraPosition = 1;

//TODO: remove these as they will no longer be necessary
var walkSteps;
var rotSteps;

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

var paths = [];
var splineTargets = [];
splineTargets.push({x: 2.45540189743042, y: 1.3381956815719604, z: 1.428936243057251});
splineTargets.push({x: 8.0117347240448, y: 1.3381956815719604, z: 2.7985452115535736});
splineTargets.push({x: 8.132792711257935, y: 1.3381957411766052, z: 8.569308996200562});
splineTargets.push({x: 2.9254701137542725, y: 1.3381956815719604, z: 11.149720668792725});

var camPosIndex;
var direction;

init();

function onMouseMove() {
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
                setTimeout(() => {
                    // create paper group
                    for(var i in paperGroup) {
                        paper.add(paperGroup[i])
                    }
                    paper.rotateX(Math.PI/2);
                    paper.rotateY(Math.PI/4);
                    scene.add(paper);
                    nextPosition()
                }, 1000)
            }
        }
    }
}

function selectTable() {
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(intersectableObjects);

    if(intersects.length > 0) {
        var intersected = intersects[0].object;
        if(intersected.name.includes("Table") && !intersected.name.includes("Path")){
            console.log(intersected);
            if(intersected.name.includes("Table_Red")) {
                if(currentHover) {
                    currentHover.material = previousMaterial;
                    currentHover = null
                }
                nextPosition()
            }
            else {
                //get what table you selected
                var table;
                if(intersected.name.includes("Table_Green")){
                    table = 0;
                }
                else if(intersected.name.includes("Table_Yellow")){
                    table = 2;
                }
                else if(intersected.name.includes("Table_Blue")){
                    table = 3;
                }
                moveAlongSpline(table, -1);

                setTimeout(function(){

                    if(attempts === 2) {
                        playSound('ShowToSeat.ogg');
                        nextPosition()
                    }

                    attempts++;
                    if(attempts === 1){
                        playSound('NotSeatOne.ogg');
                    } else if(attempts === 2){
                        playSound('NotSeatTwo.ogg');
                    }

                }, 3500)

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
            posted = true
        }
    }
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
    //create the scene
    scene = new THREE.Scene();

    //create camera that will be used
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 2000 );
    camera.rotation.reorder( "YXZ" );
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);

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
    loadSound('TakeSeats.ogg', 0.4, true);

    //TODO: add onEnd() functions to these, which will turn camera to look at the rest of the tables
    //teacher dialogue with first wrong attempt
    loadSound('NotSeatOne.ogg', 0.4);

    //teacher dialogue with second wrong attempt
    loadSound('NotSeatTwo.ogg', 0.4);

    //teacher dialogue showing to right table
    loadSound('ShowToSeat.ogg', 0.4);

    //teacher dialogue about coloring
    loadSound('HowToDraw.ogg', 0.4);

    //teacher dialogue when coloring is finished
    loadSound('FinishColoring.ogg', 0.3, false, false, () => {
        // fade to view of whiteboard after audio ends
        fade();
        setTimeout(() => {
            camera.position.set(0.11333127647429019, 1.5369136371003131, -2.028078509213737);
            camera.rotation.set(0.490486809597034, 0.0016298261023861107, 0);
        }, 1000)
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

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //controls, camera
    // controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.update();

    // set the initial camera position
    camera.position.set(-6.342057562830126, 2.340890947024859, 6.883271833415659);
    camera.rotation.set(-0.09963408823470919, -1.5005061696940256, 2.0920433907298925e-17);

    var element = document.body;


    element.addEventListener("keypress", function(event){
        if(String.fromCharCode(event.keyCode) === "c"){
            console.log(camera);
        }
        else if(String.fromCharCode(event.keyCode) === "f"){
            fade();
        }
        else if(String.fromCharCode(event.keyCode) === "t"){

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
}

window.onload = changeColorVision();

function nextPosition(){
    switch(cameraPosition){
        case 1:
            cameraPosition = 2;
            moveAlongSpline2(1, -1, 2.500);
            // moveAlongSpline(1, -1);
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

//TODO: tweens won't be used as often as planned so this method should be removed
/**
 * Begin the walk specified in the walkSteps variable
 */
function beginWalk(){
    walkSteps[0].start();
    rotSteps[0].start();

    //TODO: move this audio somewhere else so that this function can be removed
    walkSteps[0].onComplete(() => {
        playSound('HowToDraw.ogg');
    })
}

//TODO: remove this function
/**
 * Add step to the list of tweens
 * /@argument position position to go to
 * /@argument rotation rotation to go to
 * /@argument time how long to transition
 **/
function addStep(position, rotation, time){
    //add tweens to lists of tweens
    let walkLen = walkSteps.push(new TWEEN.Tween(camera.position).to(position, time));
    let rotLen = rotSteps.push(new TWEEN.Tween(camera.rotation).to(rotation, time));

    //chain the tweens so that they happen consecutively
    if(walkLen > 1){
        walkSteps[walkLen-2].chain(walkSteps[walkLen-1]);
    }
    if(rotLen > 1){
        rotSteps[rotLen-2].chain(rotSteps[rotLen-1]);
    }

}

/**
 * Function to move the camera along the designated spline
 * /@argument spline spline to move along
 * /@argument dir 1 is forward, -1 is backwards
 **/
function moveAlongSpline(spline, dir){
    //go in direction of spline
    if(dir === 1){
        direction = 1;
        camPosIndex = 0;
    }
    else{
        direction = -1;
        camPosIndex = 200;
    }
    activeSpline = spline;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

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

    render();

}
function render() {
    TWEEN.update();
    updateSpline();

    renderer.render( scene, camera );
}