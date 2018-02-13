const fbxloader = new THREE.FBXLoader();
const audioLoader = new THREE.AudioLoader();
var USERID;

generateUserId();

/**
 * Generates User ID
 */
function generateUserId() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        USERID = this.responseText;
      }
    };
    xhttp.open("GET", "/userId", true);
    xhttp.send();
}

/**
 * Loads JSON file by name.
 * 
 * @param {*} fileName - name of JSON file.
 * @param {*} callback - function to execute after JSON file is returned.
 */
function loadJSON(fileName, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", "json/" + fileName + ".json", true);
    xhttp.send();
}

/**
 * Prints percentage that the file has been loaded
 * @param xhr
 */
function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

    }

}

/**
 * Prints out error message if there is an error loading
 * @param xhr
 */
function onError( xhr ) {

    console.error( xhr );

}

/**
 * Load Static FBX asset and add it to the scene
 * @param fileName String name of the file to be loaded
 * @param onLoad function to be executed on file load
 */
function loadStaticFBX(fileName, onLoad){
}

/**
 * Load animated FBX asset and add it to the scene
 * @param fileName String name of the file to be loaded
 * @param onLoad function to be executed on file load. It can take the loaded object as a parameter.
 */
function loadAnimationFBX(fileName, onLoad){
    fbxloader.load(
        "3dmodels/" + fileName,
        function( object ) {
            //execute onLoad function if there is one
            if(onLoad){
                onLoad(object);
            }

            //add the object's animation mixer
            object.mixer = new THREE.AnimationMixer( object );
            mixers.push( object.mixer );

            //play the animation
            let action = object.mixer.clipAction(object.animations[0]);
            action.play();

            scene.add( object );
        },
        null, onError
    );
}

/**
 * Load T-Pose fbx with animation fbx
 * @param filename name of the T-Pose model file
 * @param animations filenames of the animations that the model will have
 * @param onLoad function to perform once the model is loaded
 */
function loadAnimationFBX2(filename, animations, onLoad){
    //load the T-Pose model
    fbxloader.load(
        "3dmodels/" + filename,
        function(object){

            //load in the animations and add them to the object
            let animationsLoaded = 0;
            for(let i in animations){
                fbxloader.load(
                    "3dmodels/animations/" + animations[i],
                    function(animation){
                        animation.animations[0].name = animations[i];
                        object.animations.push(animation.animations[0]);

                        //perform the onLoad function when the last of the animations has been loaded
                        animationsLoaded += 1;
                        if(animationsLoaded === animations.length && onLoad){
                            onLoad(object);
                        }
                    },
                    null, onError
                );
            }

            object.currentAnimation = 0;

            //add the object's animation mixer to the global list of mixers
            object.mixer = new THREE.AnimationMixer( object );
            mixers.push( object.mixer );

            scene.add(object);
        },
        null, onError
    );
}

/**
 * Load Fbx file that contains the world
 * @param fileName String name of the file to be loaded
 * @param onLoad optional function to be executed on all children of the scene
 */
function loadWorldFBX(fileName, onLoad){

    fbxloader.load(
        fileName,
        function( object ) {
            //add shadow casting and receiving for all of the child objects loaded
            for(let i in object.children){
                //set shadows for the objects
                // object.children[i].castShadow = true;
                // object.children[i].receiveShadow = true;

                //convert the paths in the scene into splines
                if(object.children[i].name.includes("Path")) {
                    object.children[i].visible = false;
                    paths.push(object.children[i]);
                    let points = object.children[i].geometry.attributes.position.array;
                    let vectors = [];
                    for(let j = 0; j < points.length; j += 3){
                        vectors.push(new THREE.Vector3(points[j], points[j+1], points[j+2]));
                    }
                    splines.push(new THREE.CatmullRomCurve3(vectors));
                }

                //add objects for raycasting
                else {
                    intersectableObjects.push(object.children[i]);
                }
            }

            //perform the onLoad function, if one is specified
            if(onLoad) {
                onLoad(object);
            }

            //set shadows for the objects
            object.castShadow = true;
            object.receiveShadow = true;

            scene.add( object );
        },
        null, onError
    );
}

/**
 * Load audio file
 * @param filename name of the audio file to be loaded
 * @param volume volume that the audio should be set to
 * @param playImmediately boolean whether or not to play the audio immediately after loading
 * @param loop boolean whether or not the audio should loop
 * @param onEnded function to be performed once the audio finishes playing
 */
function loadSound(filename, volume, playImmediately, loop, onEnded){
    audioLoader.load(
        "audio/" + filename,
        (audioBuffer) => {
            let song = new THREE.Audio(audioListener);
            scene.add(song);
            sounds.push(song);
            song.setBuffer(audioBuffer);
            if(volume !== null){
                song.setVolume(volume);
            }
            if(loop === true){
                song.setLoop(true);
            }
            if(playImmediately === true){
                song.play();
            }
            if(onEnded){
                song.onEnded = onEnded;
            }
            song.name = filename;
        },
        null, onError
    );
}