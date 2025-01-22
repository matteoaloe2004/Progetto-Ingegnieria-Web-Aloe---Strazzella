const express = require('express');
const cors = require('cors'); //middleware
const bodyParser = require('body-parser');
const path = require('path');
const campiRoutes = require('./routes/campiRoutes');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const prenotaRoutes = require('./routes/PrenotaRoutes');

const app = express();
const PORT = 3000;


//creazione del middleware
app.use(cors());
app.use(bodyParser.json()); //richieste come json


app.use(express.static(path.join(__dirname, '../', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});



app.use('/api/campi', campiRoutes);
app.use('/api', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/prenota', prenotaRoutes);
; //api/user

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});