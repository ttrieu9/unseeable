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
   * @param {String} playerId 
   * @param {Number} levelId 
   * @param {*} date 
   * @param {Number} startTime 
   */
  constructor(playerId, levelId, startTime) {
    this.log = {
      playerId: playerId,
      levelId: levelId,
      date: date,
      startTime: startTime,
      levelDuration: 0.0,
      events: [],
      tasks: []
    };
    this.taskStartTime = 0;
  }

  /**
   * Adds event to log.
   * @param {String} type 
   * @param {Number} time 
   * @param {Number} x 
   * @param {Number} y 
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
   * @param {Number} taskStartTime 
   */
  recordTaskStartTime(taskStartTime) {
    this.taskStartTime = taskStartTime;
  }

  /**
   * Adds task to log.
   * @param {String} name 
   * @param {Milliseconds} duration 
   * @param {String} gradingCriteria 
   * @param {Number} grade 
   */
  logTask(name, taskEndTime, gradingCriteria, grade) {
    this.log.tasks.push(
      {
        name: name,
        duration: taskEndTime - this.taskStartTime,
        gradingCriteria: gradingCriteria,
        grade: grade
      });
  }

  /**
   * Calculates the level duration and uploads log to DB.
   * @param {Number} endTime 
   */
  endLog(endTime) {
    this.log.levelDuration = endTime - this.log.startTime;

    // log is send to DB
  }
}

module.exports = Logger;