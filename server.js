// Modules
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/dbconfig');
const coookieParser = require('cookie-parser');
const sessions = require('express-session');
const path = require('path')

//Get Routers
const dashBoard = require('./routers/dashBoard');
const tableData = require('./routers/tableData');
const tableEdit = require('./routers/tableEdit');
const quizApp = require('./routers/quizFunction');

// Middleware
const app = express();
const port = 2902;
app.use(coookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
app.set('trust proxy', 1) // trust first proxy
app.use(sessions({
    secret: 'amay151123',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use('/user-data/', express.static(__dirname + '/views'));

//Routers
app.use('/', dashBoard);
app.use('/', tableData);
app.use('/', tableEdit);
app.use('/', quizApp);

app.get('/', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/dashboard');
    } else {
        res.render('index', { session: req.session });
    }
});

app.get('/register', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/dashboard');
    } else {
        res.render('register');
    }
});

app.get('/registerFailed', (req, res, next) => {
    res.render('registerFailed');
});

app.get('/404', (req, res, next) => {
    res.render('error404');
});

app.get('/login', (req, res, next) => {
    if (req.session.loggedin) {
        res.redirect('/dashboard');
    } else {
        res.render('login');
    }
});

app.get('/loginFailed', (req, res, next) => {
    res.render('loginFailed');
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
            req.session.role = result[0].role;
            res.redirect('/dashboard');
        } else {
            res.redirect('/loginFailed');
        }
    });
});

app.get('/logout', (req, res, next) => {
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
    console.log('Program berhasil dijalankan (http://localhost:2902/)');
});