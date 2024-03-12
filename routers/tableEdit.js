const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');

router.get('/database/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM accounts';
    const q = `SELECT * FROM accounts WHERE id = ${id}`;

    db.query(sql, (err, data) => {
        if (err) throw err;

        db.query(q, function(err, results) {
          if (err) throw err;

          res.render('tableEdit', { session: req.session, userData: data, user: results[0] });
        });
    });
});

router.post('/database/:id', (req, res) => {
    const id = req.params.id;
    const { username, email, password, firstname, lastname, role } = req.body;
    const q = `UPDATE accounts SET ? WHERE id = ${id}`;

    db.query(q, [{ username: username, email: email, password: password, firstname: firstname, lastname: lastname, role: role }], function(err, results) {
      if (err) throw err;
      res.redirect('/');
    });
});

module.exports = router;