const db = require('../db');  
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');  

const JWT_SECRET = 'foo';  


exports.registerUser = (req, res) => {
    const { email, username, password, nome, cognome } = req.body;

  
    if (!email || !username || !password || !nome || !cognome) {
        return res.status(400).json({ success: false, message: 'Tutti i campi sono obbligatori' });
    }

 
    db.query('SELECT * FROM utenti WHERE email = ? OR username = ?', [email, username], (err, results) => { 
        if (err) {
            console.error('Errore nella verifica dell\'email e dell\'username:', err);
            return res.status(500).json({ success: false, message: 'Errore nel server durante la verifica dell\'email e dell\'username' });
        }

        if (results.length > 0) {
            if (results[0].email === email) {
                return res.status(400).json({ success: false, message: 'Email già registrata. Usa un\'altra email.' });
            } else {
                return res.status(400).json({ success: false, message: 'Username già in uso. Scegli un\'altro.' });
            }
        }

        
        bcrypt.hash(password, 10, (err, hashedPassword) => { //hashing della password
            if (err) {
                console.error('Errore durante l\'hashing della password:', err);
                return res.status(500).json({ success: false, message: 'Errore nel server durante la registrazione' });
            }

           
            db.query(
                'INSERT INTO utenti (email, username, password, nome, cognome) VALUES (?, ?, ?, ?, ?)',
                [email, username, hashedPassword, nome, cognome],
                (err, results) => {
                    if (err) {
                        console.error('Errore nella query di registrazione:', err);
                        return res.status(500).json({ success: false, message: 'Errore nel server durante la registrazione' });
                    }

                    
                    const token = jwt.sign(
                        { email, username },  
                        JWT_SECRET,         
                        { expiresIn: '1 day' } 
                    );

                 
                    res.cookie('authToken', token, {
                        httpOnly: true,  
                        secure: true,    
                        maxAge: 86400000 
                    });

                   
                    res.status(201).json({ 
                        success: true, 
                        message: 'Registrazione completata con successo!',
                        username,
                        token,  
                        payload: { email, username } 
                    });
                }
            );
        });
    });
};