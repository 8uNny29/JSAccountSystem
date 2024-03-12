const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');

router.get('/database', (req, res) => {
    const sql = 'SELECT * FROM accounts';

    db.query(sql, (err, data) => {
        if (err) throw err;
        res.render('tableData', { session: req.session, userData: data });
    });
});

module.exports = router;