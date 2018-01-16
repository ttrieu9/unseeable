//clock used for keeping track of time moved along spline
var splineClock = new THREE.Clock();
var splines = []; //array of all of the splines in the level
var activeSpline = null; // active spline that the camera is moving along
var splineDuration = 0; // the amount of time that the camera will take to move along the spline
var dir;

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
    dir = direction;
    splineDuration = duration;
    splineClock.start();
    if(onEnded){
        splines[activeSpline].onEnded = onEnded;
        console.log(splines[activeSpline].onEnded);
    }
}

/**
 * Function to update the position of the camera along the currently active spline, should be called within render()
 */
function updateSpline(){
    if(activeSpline !== null){
        let spline = splines[activeSpline];
        //get elapsed time in seconds
        let elapsed = splineClock.getElapsedTime();

        //get the point along the spline that the camera should be at
        let newPos;
        if(elapsed <= splineDuration){
            //get the point, depending on the direction of movement
            if(dir === 1){
                newPos = spline.getPointAt(elapsed/splineDuration);
            }
            else{
                newPos = spline.getPointAt(1-elapsed/splineDuration);
            }
            camera.position.set(newPos.x, 2.3, newPos.z);
        }
        //end the spline and place the camera at the end of it
        else{
            //get the endpoint, depending on the direction
            if(dir === 1){
                newPos = spline.getPointAt(1);
            }
            else{
                newPos = spline.getPointAt(0);
            }
            camera.position.set(newPos.x, 2.3, newPos.z);
            //execute the onEnded function once the spline is finished
            if(spline.onEnded){
                spline.onEnded();
            }
            activeSpline = null;
        }
    }

}