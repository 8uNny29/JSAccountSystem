// Modules
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./routes/config/dbconfig');
const coookieParser = require('cookie-parser');
const sessions = require('express-session');
const path = require('path')
const users = require('./routes/routers/users');
const timeDate = require('./routes/routers/timeDate');

// Middleware
const app = express();
const port = 3000;
app.use(coookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'routes')));
app.set('view engine', 'ejs');
app.set('trust proxy', 1) // trust first proxy
app.use(sessions({
    secret: 'amay151123',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use('/', users);
app.use('/', timeDate);

app.get('/', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(__dirname + 'index.html');
    }
});

app.get('/register', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(__dirname + '/routes/html/register.html');
    }
});

app.get('/registerFailed', (req, res, next) => {
    res.sendFile(__dirname + '/routes/html/registerFailed.html');
});

app.get('/404', (req, res, next) => {
    res.sendFile(__dirname + '/routes/html/error404.html');
});

app.get('/login', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(__dirname + '/routes/html/login.html');
    }
});

app.get('/loginFailed', (req, res, next) => {
    res.sendFile(__dirname + '/routes/html/loginFailed.html');
});

app.get('/dashboard', (req, res, next) => {
    const sqlGetRole = 'SELECT * FROM accounts WHERE username = ?';
    const roleUsername = req.session.username;

    db.query(sqlGetRole, [roleUsername], (err, results) => {
        if (err) throw err;

        if (req.session.loggedin) {
            if (req.session.admin) {
                res.render('adminDashBoard', { session: req.session });
            } else {
                res.render('dashBoard', { session: req.session });
            }
        } else {
            res.redirect('/login');
        }
    });
});

app.post('/register', (req, res, next) => {
    const { firstname, lastname, email, username, password } = req.body;
    const role = 'member';
    const sqlInsert = 'INSERT INTO accounts (firstname, lastname, email, username, password, role) VALUES (?,?,?,?,?,?)';
    const sqlCheck = 'SELECT * FROM accounts WHERE username = ?';

    db.query(sqlCheck, [username], (err, result, rows) => {
        if (err) throw err;
        if (result.length === 0) {
            db.query(sqlInsert, [firstname, lastname, email, username, password, role], (err, result) => {
                if (err) throw err;
            });
            console.log(`${username} Telah berhasil daftar`);
            res.redirect('/login');
        } else {
            res.redirect('/registerFailed');
        }
    });
});

app.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    const sqlGet = 'SELECT * FROM accounts WHERE username = ? AND password = ?';

    db.query(sqlGet, [username, password], (err, result) => {
        if(err) throw err;

        if (result.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            req.session.admin = result[0].role === 'admin';
            res.redirect('/dashboard');
        } else {
            res.redirect('/loginFailed');
        }
    });
});

app.post('/logout', (req, res, next) => {
    if (req.session.loggedin) {
      req.session.user = null;
      req.session.save(function (err) {
        if (err) next(err);
  
        req.session.regenerate(function (err) {
          if (err) next(err);
          res.redirect('/');
        });
      });
    }
});

app.listen(port, () => {
    console.log('Program berhasil dijalankan (http://localhost:3000/)');
});

module.exports = {app, sessions, req: app.request, res: app.response};