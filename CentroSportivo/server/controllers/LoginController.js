const db = require('../db'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 

const JWT_SECRET = 'foo'; 

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email e password sono obbligatori' });
    }

    db.query('SELECT * FROM utenti WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Errore nella query:', err.message);
            return res.status(500).json({ success: false, message: 'Errore del server' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Email o password errati' });
        }

        const utenti = results[0];

        try {
            const correctPassword = await bcrypt.compare(password, utenti.password);

            if (!correctPassword) {
                return res.status(401).json({ success: false, message: 'Email o password errati' });
            }

            const token = jwt.sign(
                { email: utenti.email, role: 'utente' }, // Ruolo predefinito come "utente"
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                maxAge: 86400000, 
            });

            res.json({
                success: true,
                message: 'Login effettuato con successo',
                role: 'utente', // Ruolo predefinito
                username: utenti.username,
            });
        } catch (err) {
            console.error('Errore durante la verifica della password:', err.message);
            res.status(500).json({ success: false, message: 'Errore del server durante il login' });
        }
    });
};