/**
 * The Logger class create a a JSON object containing player data for a specific level.
 * 
 *  Template for JSON object:
 *  {
 *    playerId: uuid for player,
 *    levelId: int representing level,
 *    date: date player started level,
 *    levelDuration: time in milliseconds player took to complete level,
 *    events: [
 *      {
 *        type: e.g. mouseclick, mouseover, etc.,
 *        time: time relative to start of level where event occured,
 *        mouseCoordinate: {
 *          x: x-coordinate of mouse during event,
 *          y: y coordinate of mouse during event
 *        }
 *      },
 *      ...
 *    ],
 *    tasks: [
 *      {
 *        name: name of task,
 *        duration: time in milliseconds relative to the start of the level when task was completed,
 *        grade: float indicating the amount of success achieved for this task by the user
 *      },
 *      ...
 *    ]
 *  }
 */
class Logger {
  /**
   * Creates initial log.
   * 
   * @param {String} playerId - GUID representing the player.
   * @param {Number} levelId - An integer representing the level being played.
   */
  constructor(playerId, levelId) {
    var date = new Date();
    this.log = {
      playerId: playerId,
      levelId: levelId,
      date: date,
      startTime: date.getTime(),
      levelDuration: 0.0,
      events: [],
      tasks: []
    };
    this.taskStartTime = 0;
  }

  /**
   * Adds event to log.
   * 
   * @param {String} type - The type of event that occurred (e.g. mouseclick, mouseover, etc.).
   * @param {Number} x - The x-coordinate of the event.
   * @param {Number} y - The y-coordiante of the event.
   */
  logEvent(type, x, y) {
    this.log.events.push(
      {
        type: type,
        time: new Date().getTime() - this.log.date.getTime(),
        mouseCoordinate: {
          x: x,
          y: y
        }
      });
  }

  /**
   * Records the start time of the current task.
   * 
   * @param {Number} taskStartTime - The time that the task started (in milliseconds).
   */
  recordTaskStartTime() {
    this.taskStartTime = new Date().getTime();
  }

  /**
   * Adds task to log.
   * 
   * @param {String} name - The name of the task.
   * @param {Number} grade - The amount of success achieved by the player in doing the task.
   */
  logTask(name, grade) {
    this.log.tasks.push(
      {
        name: name,
        duration: new Date().getTime() - this.log.date.getTime(),
        grade: grade
      });
  }

  /**
   * Calculates the level duration and uploads log to DB.
   * 
   */
  endLog() {
    this.log.levelDuration = new Date().getTime() - this.log.date.getTime();

    // log is sent to DB
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(JSON.parse(this.responseText));
      }
    };
    xhttp.open("POST", "/logger/create", true);
    xhttp.send(JSON.stringify(this.log));
  }

  /**
   * Prints the current Log to the console.
   */
  printLog() {
    console.log(this.log);
  }
}

// module.exports = Logger;