const express = require('express');
const router = express.Router();

router.get('/time-date', (req, res) => {
    if (req.session.loggedin) {
        res.render('time-date', { session: req.session });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;