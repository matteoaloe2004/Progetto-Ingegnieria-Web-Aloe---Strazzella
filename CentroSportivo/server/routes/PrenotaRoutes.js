const express = require('express');
const router = express.Router();
const prenotazioniController = require('../controllers/PrenotaController');

// Ottieni tutte le prenotazioni
router.get('/', prenotazioniController.getAllPrenotazioni);

// Ottieni una prenotazione per ID
router.get('/:id', prenotazioniController.getPrenotazioneById);

// Aggiungi una nuova prenotazione
router.post('/', prenotazioniController.addPrenotazione);

// Elimina una prenotazione per ID
router.delete('/:id', prenotazioniController.deletePrenotazione);

// Aggiorna una prenotazione esistente
router.put('/:id', prenotazioniController.updatePrenotazione);

// Ottieni tutte le prenotazioni di un utente tramite username
router.get('/utente/prenotazioni', prenotazioniController.getPrenotazioniByUsername);

module.exports = router;
