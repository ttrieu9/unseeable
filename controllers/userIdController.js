var uuidv4 = require('uuid/v4')
let userId;

// Generate random User ID
exports.generate_user_id = (req, res) => {
  req.on('data', (data) => {
  });

  req.on('end', (data) => {
    userId = uuidv4();
    console.log(userId)
    res.send(userId).end();
  });
  console.log('Read all logs.');
};
