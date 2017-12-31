/**
 * The Logger class create a a JSON object containing player data for a specific level.
 * 
 *  Template for JSON object:
 *  {
 *    playerId: uuid for player,
 *    levelId: int representing level,
 *    date: date player played level,
 *    startTime: time player started level,
 *    levelDuration: time in seconds player took to complete level,
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
 *        duration: time in seconds relative to the start of the level when task was completed,
 *        gradingCriteria: how to measure how well the user did on this task,
 *        grade: float indicating the amount of success achieved for this task by the user
 *      },
 *      ...
 *    ]
 *  }
 */
class Logger {
  constructor(playerId, levelId, date, startTime, levelDuration) {

  }
}

module.exports = Logger;