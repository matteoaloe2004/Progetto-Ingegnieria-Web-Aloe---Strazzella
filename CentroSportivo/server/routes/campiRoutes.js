const express = require('express');
const { getAllActivity } = require('../controllers/campicontroller');
const router = express.Router();

router.get('/', getAllActivity); // Usa '/' per indicare la root del percorso

module.exports = router;