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
 * @param onEnded Optional function to execute once, the spline is fully traversed
 */
function moveAlongSpline2(spline, direction, duration, onEnded){
    activeSpline = spline;
    splineDuration = duration;
    splineClock.start();
    if(onEnded){
        splines[activeSpline].onEnded = onEnded;
        console.log(splines[activeSpline].onEnded);
    }
}

/**
 * Function to update the position of the camera along the currently active spline
 */
function updateSpline(){
    if(activeSpline !== null){
        //get elapsed time in seconds
        let elapsed = splineClock.getElapsedTime();

        //get the point along the spline that the camera should be at
        let newPos;
        if(elapsed <= splineDuration){
            newPos = splines[activeSpline].getPoint(1-elapsed/splineDuration);
            camera.position.set(newPos.x, 2.3, newPos.z);
        }
        //end the spline and place the camera at the end of it
        else{
            newPos = splines[activeSpline].getPoint(0);
            camera.position.set(newPos.x, 2.3, newPos.z);

            console.log(activeSpline + " splined");
            //execute the onEnded function once the spline is finished
            if(splines[activeSpline].onEnded){
                splines[activeSpline].onEnded();
            }
            activeSpline = null;
        }
    }

}