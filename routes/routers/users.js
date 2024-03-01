const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');
const path = require('path')

router.get('/user-list', (req, res) => {
  const sqlGetRole = 'SELECT * FROM accounts WHERE username = ?';
  const sql = 'SELECT * FROM accounts';
  const roleUsername = req.session.username;

    db.query(sqlGetRole, [roleUsername], (err, results) => {
        if (err) throw err;

        if (req.session.loggedin) {
            if (req.session.admin) {
              res.render('user-list');
            } else {
              res.redirect('/404');
            }
        } else {
            res.redirect('/login');
        }
    });

  db.query(sql, (err, data) => {
    if (err) throw err;
    
  });
});

module.exports = router;