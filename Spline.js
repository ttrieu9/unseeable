//clock used for keeping track of time moved along spline
var splineClock = new THREE.Clock();
var splines = []; //array of all of the splines in the level
var activeSpline = null; // active spline that the camera is moving along
var splineDuration = 0; // the amount of time that the camera will take to move along the spline

//TODO: should the spline be given by its index or something else?
/**
 * Move the camera along the given spline for the given amount of time
 * @param spline Spline to move the camera along
 * @param direction Direction to move along the spline
 * @param duration How many seconds to take to move along the spline
 */
function moveAlongSpline2(spline, direction, duration){
    activeSpline = spline;
    splineDuration = duration;
    splineClock.start();
}

/**
 * Function to update the position of the camera along the currently active spline
 */
function updateSpline(){
    //TODO: make it work with time instead of frames, use a clock
    if(activeSpline !== null){
        let elapsed = splineClock.getElapsedTime();
        console.log(elapsed);
        if(elapsed >= splineDuration) {
            console.log(activeSpline + " splined");
            activeSpline = null;
        }
    }

}