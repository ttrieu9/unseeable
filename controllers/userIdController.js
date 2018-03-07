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

// Retrive generated User ID
exports.get_user_id = (req, res) => {
  req.on('data', (data) => {
  });

  req.on('end', (data) => {
    console.log(userId)
    res.send(userId).end();
  });
  console.log('Read all logs.');
};
