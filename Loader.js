var fbxloader = new THREE.FBXLoader();

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
 * @param onLoad function to be executed on file load
 * @param onProgress function to be executed on load progress
 * @param onError function to be executed on error
 * @param object optional object to save the asset to
 */
function loadAnimationFBX(fileName, onLoad, onProgress, onError, object){}

/**
 * Load Fbx file that contains the world
 * @param fileName String name of the file to be loaded
 * @param onLoad optional function to be executed on file load instead of default
 * @param onProgress optional function to be executed on load progress instead of default
 * @param onError optional function to be executed on error instead of default
 */
function loadWorldFBX(fileName, onLoad, onProgress, onError){}
