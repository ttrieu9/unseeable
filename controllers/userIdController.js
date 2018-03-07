var uuidv4 = require('uuid/v4')

// Generate random User ID
exports.generate_user_id = (req, res) => {
  req.on('data', (data) => {
  });

  req.on('end', (data) => {
    res.send(uuidv4()).end();
  });
};
