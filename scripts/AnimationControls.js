/**
 * Play an animation, given an object and animation index number
 * @param object Object that will perform the animation
 * @param animation Index number of animation to play.
 */
function playAnimation(object, animation){
    object.mixer.stopAllAction();
    object.mixer.clipAction(object.animations[animation]).play();
    object.currentAnimation = animation;
}

/**
 * Fade from the currently playing animation into the current one
 * @param object Object that will perform the animation
 * @param animation Index number of the animation to fade into
 */
function blendIntoAnimation(object, animation){
    let currentAction = object.mixer.clipAction(object.animations[object.currentAnimation]);
    currentAction.crossFadeTo(object.mixer.clipAction(object.animations[animation]), 1, false).play();
    let ass = object.currentAnimation;
    object.currentAnimation = animation;

    //the actual animation does not stop when it fades out, making transition to it weird
    setTimeout(function(){
        object.mixer.clipAction(object.animations[ass]).stop();
    }, 1000);
}