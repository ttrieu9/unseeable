var uuidv4 = require('uuid/v4')
let userId;

// Generate random User ID
exports.generate_user_id = (req, res) => {
  req.on('data', (data) => {
  });

  req.on('end', (data) => {
    userId = uuidv4();
    res.send(userId).end();
  });
  console.log('Read all logs.');
};

// Retrive generated User ID
exports.get_user_id = (req, res) => {
  req.on('data', (data) => {
  });

  req.on('end', (data) => {
    res.send(userId).end();
  });
  console.log('Read all logs.');
};
