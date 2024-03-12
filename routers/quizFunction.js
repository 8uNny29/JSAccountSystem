const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');

router.get('/quiz-manager', (req, res) => {
  const sql = 'SELECT * FROM quizzes';

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render('createQuizApp', { createquiz: result, session: req.session });
  });
});

router.get('/quizzes', (req, res) => {
  const id = '1'
  const q = `SELECT * FROM quizzes WHERE id = ${id}`;

  db.query(q, (err, results) => {
    if (err) throw err;
    res.render('quizzesAdmin', { quiz: results[0], session: req.session });
  });
});
  
  // Get a single quiz by id
router.get('/quizzes/:id', (req, res) => {
  const sql = `SELECT * FROM quizzes WHERE id = ${req.params.id}`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
  
  // Add a new quiz
router.post('/create-quiz', (req, res) => {
  const data = {
    quest: req.body.quest,
    opsi1: req.body.opsi1,
    opsi2: req.body.opsi2,
    opsi3: req.body.opsi3,
    opsi4: req.body.opsi4,
    answer: req.body.answer,
  };
  
  const sql = 'INSERT INTO quizzes SET ?';

  db.query(sql, data, (err, result) => {
    if (err) throw err;
    res.redirect('/quiz-manager');
  });
});
  
  // Update a quiz
router.put('/quizzes/:id', (req, res) => {
  const data = {
    quest: req.body.quest,
    opsi1: req.body.option1,
    opsi2: req.body.opsi2,
    opsi3: req.body.opsi3,
    opsi4: req.body.opsi4,
    answer: req.body.answer,
  };
  const sql = `UPDATE quizzes SET ? WHERE id = ${req.params.id}`;

  db.query(sql, data, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
  
  // Deconste a quiz
router.delete('/quizzes/:id', (req, res) => {
  const sql = `DELETE FROM quizzes WHERE id = ${req.params.id}`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;