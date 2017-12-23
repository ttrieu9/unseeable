const fbxloader = new THREE.FBXLoader();

/**
 * Load Static FBX asset and add it to the scene
 * @param fileName String name of the file to be loaded
 * @param onLoad function to be executed on file load
 * @param onProgress function to be executed on load progress
 * @param onError function to be executed on error
 */
function loadStaticFBX(fileName, onLoad, onProgress, onError){
    console.log("something");
}

/**
 * Load animated FBX asset and add it to the scene
 * @param fileName String name of the file to be loaded
 * @param onLoad function to be executed on file load. It can take the loaded object as a parameter.
 * @param onProgress function to be executed on load progress
 * @param onError function to be executed on error
 */
function loadAnimationFBX(fileName, onLoad, onProgress, onError){
    fbxloader.load(fileName, function( object ) {
        //execute onLoad function if there is one
        if(onLoad !== null){
            onLoad(object);
        }

        //add the object's animation mixer
        object.mixer = new THREE.AnimationMixer( object );
        mixers.push( object.mixer );

        //play the animation
        let action = object.mixer.clipAction(object.animations[0]);
        action.play();

        scene.add( object );

    }, onProgress, onError );
}

/**
 * Load Fbx file that contains the world
 * @param fileName String name of the file to be loaded
 * @param onLoad optional function to be executed on file load instead of default
 * @param onProgress optional function to be executed on load progress instead of default
 * @param onError optional function to be executed on error instead of default
 */
function loadWorldFBX(fileName, onLoad, onProgress, onError){

    fbxloader.load( 'PreSchool_New12.12.1.fbx', function( object ) {
        //add shadow casting and receiving for all of the child objects loaded
        for(let i in object.children){
            // object.children[i].castShadow = true;
            // object.children[i].receiveShadow = true;
            if(object.children[i].name.includes("Path")) {
                paths.push(object.children[i]);
                let points = object.children[i].geometry.attributes.position.array;
                let vectors = [];
                for(let j = 0; j < points.length; j += 3){
                    vectors.push(new THREE.Vector3(points[j], points[j+1], points[j+2]));
                }
                splines.push(new THREE.CatmullRomCurve3(vectors));
            }
            else {
                intersectableObjects.push(object.children[i]);

                if(object.children[i].name.includes("MainPaper")) {
                    paperGroup.push(object.children[i]);

                    if(!object.children[i].name.includes("Outline")) {
                        coloredObjects.push(object.children[i].name);
                    }
                }
            }
        }
        object.castShadow = true;
        object.receiveShadow = true;
        scene.add( object );


    }, onProgress, onError );
}
