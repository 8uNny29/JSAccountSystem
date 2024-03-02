const mysql = require('mysql');
const dbconfig = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jsaccsys'
});
  dbconfig.connect(function(err) {
    if (err) throw err;
    console.log('Database berhasil terkoneksi dengan baik!');
});



module.exports = dbconfig;