const db = require('../db'); // Assicurati che il file `db.js` sia configurato correttamente per connettersi al database

const getAllActivity = (req, res) => {
    console.log("Richiesta ricevuta su /api/campi"); // Debug
    const query = 'SELECT * FROM campi';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Errore durante il recupero dei dati:', err);
            res.status(500).json({ error: 'Errore durante il recupero dei campi.' });
        } else {
            console.log("Dati inviati:", results); // Debug
            res.json(results);
        }
    });
};


module.exports = {
    getAllActivity
};
