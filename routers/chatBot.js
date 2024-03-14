const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');

router.get('/chatbot', (req, res) => {
  res.render('chatBot', { message: '', session: req.session });
});

router.post('/chatbot', (req, res) => {
  const message = req.body.message;
  const response = generateResponse(message);
  
  res.render('chatbot', { session: req.session, message: response });
});

function generateResponse(message) {
  if (message === 'hi') {
    return 'Hello, how can I help you?';
  } else if (message === 'bye') {
    return 'Goodbye! Have a great day!';
  } else {
    return 'I\'m sorry, I didn\'t understand that.';
  }
}

module.exports = router;