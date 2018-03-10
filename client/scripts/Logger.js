/**
 * The Logger class create a a JSON object containing player data for a specific level.
 * 
 *  Template for JSON object:
 *  {
 *    playerId: uuid for player,
 *    levelId: int representing level,
 *    date: date player started level,
 *    levelDuration: time in milliseconds player took to complete level,
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
        userId: window.sessionStorage.getItem('userId'),
        levelId: levelId,
        date: date,
        startTime: date.getTime(),
        levelDuration: 0.0
      };
      this.taskStartTime = 0;
  }

  /**
   * Records the start time of the current task.
   * 
   */
  recordTaskStartTime() {
    this.taskStartTime = new Date().getTime();
  }

  /**
   * Adds task to log.
   * 
   * @param {String} name - The name of the task.
   * @param {Number} grade - The amount of success achieved by the player in doing the task.
   * @param {Array} additional - Any additional info to be logged.
   */
  logTask(name, grade, additional) {
    let task = {
      userId: window.sessionStorage.getItem('userId'),
      levelId: 1,
      name: name,
      duration: new Date().getTime() - this.taskStartTime,
      grade: grade,
      additional: additional
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText);
      }
    };
    xhttp.open("POST", "/logger/createTask", true);
    xhttp.send(JSON.stringify(task));
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
        let response = JSON.parse(this.responseText);
      }
    };
    xhttp.open("POST", "/logger/createLog", true);
    xhttp.send(JSON.stringify(this.log));
  }

  /**
   * Receives all document in the 'Log' collection of in the DB.
   */
  getLogs() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(JSON.parse(this.responseText));
      }
    };
    xhttp.open("GET", "/logger", true);
    xhttp.send();
  }

  /**
   * Retrieves logs for a specific level.
   * 
   * @param {Number} levelId - Number representing the requested level (e.g. 1, 2, 3...)
   */
  getLevelLogs(levelId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(JSON.parse(this.responseText));
      }
    };
    xhttp.open("GET", `/logger/levels/${levelId}`, true);
    xhttp.send();
  }

  /**
   * Retrieves logs for a specific player
   * 
   * @param {String} playerId - UUID representing a specific palyer
   */
  getPlayerLogs(playerId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(JSON.parse(this.responseText));
      }
    };
    xhttp.open("GET", `/logger/players/${playerId}`, true);
    xhttp.send();
  }

  /** 
   * Sends current log to client.
  */
  getCurrentLog() {
    return this.log;
  }

  /**
   * Prints the current Log to the console.
   */
  printLog() {
    console.log(this.log);
  }
}

// module.exports = Logger;