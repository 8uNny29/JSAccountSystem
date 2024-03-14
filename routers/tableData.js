const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');

router.get('/database', (req, res) => {
    const sql = 'SELECT * FROM accounts';
    const sqlGetRole = 'SELECT * FROM accounts WHERE username = ?';
    const roleUsername = req.session.username;
    const counter = 'SELECT COUNT(*) FROM accounts';

    db.query(sqlGetRole, [roleUsername], (err, results) => {
        if (err) throw err;

        db.query(counter, (err, results) => {
            if (err) throw err;

            db.query(sql, (err, data, result) => {
                if (err) throw err;
            
                if (req.session.loggedin) {
                    if (req.session.admin) {
                        res.render('tableData', { session: req.session, userData: data, count: results[0]['COUNT(*)'] });
                    } else {
                        res.render('error403');
                    }
                } else {
                    res.redirect('/login');
                }
            });
        });
    });
});

module.exports = router;