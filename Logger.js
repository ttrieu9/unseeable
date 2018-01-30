/**
 * The Logger class create a a JSON object containing player data for a specific level.
 * 
 *  Template for JSON object:
 *  {
 *    playerId: uuid for player,
 *    levelId: int representing level,
 *    date: date player played level,
 *    startTime: time player started level,
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
 *        gradingCriteria: how to measure how well the user did on this task,
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
   * @param {Object} date - Date object representing the start of the level.
   */
  constructor(playerId, levelId, date) {
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
   * @param {Number} time - The time the event occurred (in milliseconds).
   * @param {Number} x - The x-coordinate of the event.
   * @param {Number} y - The y-coordiante of the event.
   */
  logEvent(type, time, x, y) {
    this.log.events.push(
      {
        type: type,
        time: time,
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
  recordTaskStartTime(taskStartTime) {
    this.taskStartTime = taskStartTime;
  }

  /**
   * Adds task to log.
   * 
   * @param {String} name - The name of the task.
   * @param {Milliseconds} duration - The time it took to complete the task (in milliseconds).
   * @param {String} gradingCriteria - The criteria success is based on.
   * @param {Number} grade - The amount of success achieved by the player in doing the task.
   */
  logTask(name, taskEndTime, gradingCriteria, grade) {
    this.log.tasks.push(
      {
        name: name,
        duration: taskEndTime - this.taskStartTime,
        grade: grade
      });
  }

  /**
   * Calculates the level duration and uploads log to DB.
   * 
   * @param {Number} endTime - The time the level was completed (in milliseconds).
   */
  endLog(endTime) {
    this.log.levelDuration = endTime - this.log.startTime;

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