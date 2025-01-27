const db = require('../db');

// Ottieni tutte le prenotazioni
const getAllPrenotazioni = (req, res) => {
    const { campo_id } = req.query; // Recupera il filtro da query string

    let query = `
        SELECT 
            prenotazioni.id, 
            prenotazioni.data_prenotazione, 
            prenotazioni.orario_inizio, 
            prenotazioni.orario_fine, 
            utenti.username, 
            campi.nome AS campo,
            prenotazioni.campo_id 
        FROM prenotazioni
        JOIN utenti ON prenotazioni.utente_id = utenti.id
        JOIN campi ON prenotazioni.campo_id = campi.id
    `;
    
    const params = [];

    // Applica il filtro se campo_id è presente
    if (campo_id) {
        query += ` WHERE prenotazioni.campo_id = ?`;
        params.push(campo_id);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Errore nella query per ottenere tutte le prenotazioni:', err);
            return res.status(500).json({ error: 'Errore nel server durante la lettura delle prenotazioni.' });
        }
        res.json(results);
    });
};

// Ottieni una singola prenotazione per ID
const getPrenotazioneById = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM prenotazioni WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Errore nella query per ottenere la prenotazione:', err);
            return res.status(500).json({ error: 'Errore nel server durante il recupero della prenotazione.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Prenotazione non trovata.' });
        }
        res.json(results[0]);
    });
};

// Aggiungi una nuova prenotazione
const addPrenotazione = (req, res) => {
    const { campo_id, data_prenotazione, orario_inizio, orario_fine, username } = req.body;

    if (!campo_id || !data_prenotazione || !orario_inizio || !orario_fine || !username) {
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori, incluso username.' });
    }

    // Verifica se l'utente esiste nel database
    const checkUserQuery = 'SELECT id FROM utenti WHERE username = ?';
    db.query(checkUserQuery, [username], (err, userResults) => {
        if (err) {
            console.error('Errore nella verifica dell\'utente:', err);
            return res.status(500).json({ error: 'Errore nel server durante il controllo dell\'utente.' });
        }

        if (userResults.length === 0) {
            return res.status(400).json({ error: 'L\'utente non esiste.' });
        }

        // Se l'utente esiste, prendi l'utente_id
        const utente_id = userResults[0].id;

        // Controlla la disponibilità del campo
        const checkQuery = `
            SELECT * FROM prenotazioni
            WHERE campo_id = ? AND data_prenotazione = ? 
            AND (
                (orario_inizio < ? AND orario_fine > ?) OR
                (orario_inizio < ? AND orario_fine > ?) OR
                (orario_inizio >= ? AND orario_fine <= ?)
            )
        `;
        db.query(checkQuery, [campo_id, data_prenotazione, orario_fine, orario_inizio, orario_fine, orario_inizio, orario_inizio, orario_fine], (err, results) => {
            if (err) {
                console.error('Errore durante il controllo della disponibilità del campo:', err);
                return res.status(500).json({ error: 'Errore nel server durante il controllo della disponibilità.' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Il campo è già prenotato per l\'orario selezionato.' });
            }

            if (orario_inizio >= orario_fine) {
                return res.status(400).json({ error: 'L\'orario di inizio deve essere precedente all\'orario di fine.' });
            }

            // Se il campo è disponibile, procedi con l'inserimento
            const insertQuery = `
                INSERT INTO prenotazioni (campo_id, data_prenotazione, orario_inizio, orario_fine, utente_id, username) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.query(insertQuery, [campo_id, data_prenotazione, orario_inizio, orario_fine, utente_id, username], (err, results) => {
                if (err) {
                    console.error('Errore durante l\'inserimento della prenotazione:', err);
                    return res.status(500).json({ error: 'Errore nel server durante l\'inserimento della prenotazione.' });
                }
                res.status(201).json({
                    message: 'Prenotazione aggiunta con successo',
                    id: results.insertId,
                });
            });
        });
    });
};

// Elimina una prenotazione per ID
const deletePrenotazione = (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM prenotazioni WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Errore durante l\'eliminazione della prenotazione:', err);
            return res.status(500).json({ error: 'Errore nel server durante l\'eliminazione della prenotazione.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Prenotazione non trovata.' });
        }
        res.json({ message: 'Prenotazione eliminata con successo.' });
    });
};

// Aggiorna una prenotazione esistente
const updatePrenotazione = (req, res) => {
    const id = req.params.id;
    
    const { data_prenotazione, orario_inizio, orario_fine } = req.body;

    // Verifica che tutti i campi siano presenti
    if (!data_prenotazione || !orario_inizio || !orario_fine) {
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
    }
   
    if (!/^\d{2}:\d{2}$/.test(orario_inizio) || !/^\d{2}:\d{2}$/.test(orario_fine)) {
        return res.status(400).json({ error: 'L\'orario deve essere nel formato HH:MM.' });
    }

    // Controlla se il campo è già prenotato per lo stesso orario nello stesso giorno (escludendo la prenotazione corrente)
    const checkQuery = `
        SELECT * FROM prenotazioni
        WHERE data_prenotazione = ? AND id != ? 
        AND (
            (orario_inizio < ? AND orario_fine > ?) OR
            (orario_inizio < ? AND orario_fine > ?) OR
            (orario_inizio >= ? AND orario_fine <= ?)
        )
    `;

    db.query(checkQuery, [data_prenotazione, id, orario_fine, orario_inizio, orario_fine, orario_inizio, orario_inizio, orario_fine], (err, results) => {
        if (err) {
            console.error('Errore durante il controllo della disponibilità del campo:', err);
            return res.status(500).json({ error: 'Errore nel server durante il controllo della disponibilità.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Il campo è già prenotato per l\'orario selezionato.' });
        }

        // Se il campo è disponibile, procedi con l'aggiornamento
        const updateQuery = `
            UPDATE prenotazioni
            SET data_prenotazione = ?, orario_inizio = ?, orario_fine = ?
            WHERE id = ?
        `;
        db.query(updateQuery, [data_prenotazione, orario_inizio, orario_fine, id], (err, results) => {
            if (err) {
                console.error('Errore durante l\'aggiornamento della prenotazione:', err);
                return res.status(500).json({ error: 'Errore nel server durante l\'aggiornamento della prenotazione.' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Prenotazione non trovata.' });
            }
            res.json({ message: 'Prenotazione aggiornata con successo.' });
        });
    });
};

const getPrenotazioniByUsername = (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ error: 'Il parametro username è obbligatorio.' });
    }

    const query = `
        SELECT 
            prenotazioni.id, 
            prenotazioni.data_prenotazione, 
            prenotazioni.orario_inizio, 
            prenotazioni.orario_fine, 
            campi.nome AS campo,
            prenotazioni.campo_id AS campo_id  
            FROM prenotazioni
            JOIN utenti ON prenotazioni.utente_id = utenti.id
            JOIN campi ON prenotazioni.campo_id = campi.id
            WHERE utenti.username = ?
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Errore durante il recupero delle prenotazioni:', err);
            return res.status(500).json({ error: 'Errore nel server durante il recupero delle prenotazioni.' });
        }

        res.json(results);
    });
};
const getPrenotazioniStoricheByUsername = (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ error: 'Username non fornito.' });
    }

    const query = `
      SELECT 
        prenotazioni_archivio.id, 
        prenotazioni_archivio.data_prenotazione, 
        prenotazioni_archivio.orario_inizio, 
        prenotazioni_archivio.orario_fine, 
        campi.nome AS campo
      FROM prenotazioni_archivio
      JOIN utenti ON prenotazioni_archivio.utente_id = utenti.id
      JOIN campi ON prenotazioni_archivio.campo_id = campi.id
      WHERE utenti.username = ?
    `;

    db.query(query, [username], (err, results) => {
      if (err) {
        console.error('Errore nella query per ottenere le prenotazioni storiche:', err);
        return res.status(500).json({ error: 'Errore nel server durante la lettura delle prenotazioni storiche.' });
      }
      res.json(results);
    });
};
// Aggiungi questo metodo al file PrenotaController.js
const getDisponibilita = (req, res) => {
    const { campo_id, data } = req.query;
  
    console.log("Parametro campo_id:", campo_id);
    console.log("Parametro data:", data);
  
    if (!campo_id) {
      return res.status(400).json({ error: 'Il parametro campo_id è obbligatorio.' });
    }
  
    // Query per filtrare per campo_id con controllo opzionale su data
    let query = `
      SELECT 
        prenotazioni.id, 
        prenotazioni.orario_inizio, 
        prenotazioni.orario_fine, 
        prenotazioni.data_prenotazione
      FROM prenotazioni
      WHERE prenotazioni.campo_id = ?
    `;

    // Se il parametro `data` è presente, aggiungilo come filtro alla query
    const queryParams = [campo_id];
    if (data) {
      query += " AND prenotazioni.data_prenotazione = ?";
      queryParams.push(data);
    }

    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error('Errore nella query per recuperare la disponibilità:', err);
        return res.status(500).json({ error: 'Errore nel server durante la lettura della disponibilità.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Nessuna disponibilità trovata per il campo selezionato.' });
      }
  
      res.json(results);
    });
};
  
module.exports = {
    getAllPrenotazioni,
    getPrenotazioneById,
    addPrenotazione,
    deletePrenotazione,
    updatePrenotazione,
    getPrenotazioniByUsername,
    getPrenotazioniStoricheByUsername,
    getDisponibilita, // Esportazione della funzione aggiunta
};