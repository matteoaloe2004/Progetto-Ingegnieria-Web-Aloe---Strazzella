const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'centro_sportivo'
});

db.connect(err => {
    if (err) {
        console.error('Errore di connessione al database:', err);
    } else {
        console.log('Connesso al database MySQL!');
    }
});

module.exports = db;
