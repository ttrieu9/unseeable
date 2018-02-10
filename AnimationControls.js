/**
 * Play an animation, given an object and animation index number
 * @param object Object that will perform the animation
 * @param animation Name of animation to play.
 */
function playAnimation(object, animation){
    object.mixer.stopAllAction();

    let action = object.animations.find(function(element){
        return element.name.includes(animation);
    });
    object.mixer.clipAction(action).play();
    object.currentAnimation = animation;
}

/**
 * Fade from the currently playing animation into the current one
 * @param object Object that will perform the animation
 * @param animation Name of the animation to fade into
 */
function blendIntoAnimation(object, animation){
    let currentAction = object.mixer.clipAction(object.animations[object.currentAnimation]);
    let nextAction = object.animations.find(function(element){
        return element.name.includes(animation);
    });

    currentAction.crossFadeTo(nextAction, 1, false).play();
    let currentIndex = object.currentAnimation;
    object.currentAnimation = animation;

    //the actual animation does not stop when it fades out, making transition to it weird
    setTimeout(function(){
        object.mixer.clipAction(object.animations[currentIndex]).stop();
    }, 1000);
}