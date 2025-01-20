const Utente = {
  template: `
    <div class="utente-container container container-fluid my-5">
      <h1>Bentornato, <span class="username">{{ username }}</span>!</h1>
      <h3>Cosa vuoi fare?</h3>

      <div class="text-center mx-2 my-3">
        <router-link to="/prenota">
          <button type="button" class="btn btn-primary btn-sm">Prenota il tuo Campo</button>
        </router-link>

        <router-link to="/login">
          <button type="button" class="btn btn-danger btn-sm me-2" @click="logout">Logout</button>
        </router-link>
      </div>

      <h2 class="my-4">Le tue prenotazioni</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Data</th>
            <th>Orario Inizio</th>
            <th>Orario Fine</th>
            <th>Campo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prenotazione in prenotazioni" :key="prenotazione.id">
            <td>{{ formatData(prenotazione.data_prenotazione) }}</td>
            <td>{{ prenotazione.orario_inizio }}</td>
            <td>{{ prenotazione.orario_fine }}</td>
            <td>{{ prenotazione.campo }}</td>
            <td>
              <button 
                class="btn btn-danger btn-sm me-2"
                @click="eliminaPrenotazione(prenotazione.id)"
              >
                Elimina
              </button>
              <button 
                class="btn btn-primary btn-sm"
                @click="aggiornaPrenotazione(prenotazione)"
              >
                Modifica
              </button>
            </td>
          </tr>
          <tr v-if="prenotazioni.length === 0">
            <td colspan="5" class="text-center">Nessuna prenotazione trovata.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() {
    return {
      username: '',
      prenotazioni: [] // Array per le prenotazioni dell'utente
    };
  },
  created() {
    this.username = localStorage.getItem('username') || 'Utente';
    this.caricaPrenotazioni(); // Carica le prenotazioni al caricamento del componente
  },
  methods: {
    // Carica le prenotazioni dell'utente
    caricaPrenotazioni() {
      const url = `/api/prenota/utente/prenotazioni?username=${this.username}`;
      axios
        .get(url)
        .then((response) => {
          this.prenotazioni = response.data;
        })
        .catch((error) => {
          console.error('Errore durante il recupero delle prenotazioni:', error);
          alert('Non è stato possibile caricare le prenotazioni.');
        });
    },

    // Funzione per formattare la data in formato italiano
    formatData(data) {
      const date = new Date(data); // Converte la data in un oggetto Date
      return date.toLocaleDateString('it-IT'); // Formato italiano
    },

    // Effettua il logout
    logout() {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('prenotazione');
      alert('Logout effettuato con successo!');
      this.$router.push('/login');
    },

    // Elimina una prenotazione
    eliminaPrenotazione(id) {
      if (confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
        axios
          .delete(`/api/prenota/${id}`)
          .then(() => {
            alert('Prenotazione eliminata con successo.');
            this.caricaPrenotazioni(); // Ricarica la lista delle prenotazioni
          })
          .catch((error) => {
            console.error('Errore durante l\'eliminazione della prenotazione:', error);
            alert('Non è stato possibile eliminare la prenotazione.');
          });
      }
    },

    // Aggiorna una prenotazione
    aggiornaPrenotazione(prenotazione) {
      const nuovaData = prompt('Inserisci la nuova data della prenotazione (YYYY/MM/DD):', prenotazione.data_prenotazione);
      const nuovoOrarioInizio = prompt('Inserisci il nuovo orario di inizio (HH:MM):', prenotazione.orario_inizio);
      const nuovoOrarioFine = prompt('Inserisci il nuovo orario di fine (HH:MM):', prenotazione.orario_fine);
      
      // Verifica che tutti i campi siano stati inseriti
      if (nuovaData && nuovoOrarioInizio && nuovoOrarioFine) {
        const updatedPrenotazione = {
          id: prenotazione.id,
          data_prenotazione: nuovaData, 
          orario_inizio: nuovoOrarioInizio,
          orario_fine: nuovoOrarioFine
        };
    
        console.log('Dati inviati per l\'aggiornamento della prenotazione:', updatedPrenotazione);
    
        axios
        axios.put(`/api/prenota/${prenotazione.id}`, updatedPrenotazione)
          .then(() => {
            alert('Prenotazione aggiornata con successo.');
            this.caricaPrenotazioni(); // Ricarica la lista delle prenotazioni
          })
          .catch((error) => {
            console.error('Errore durante l\'aggiornamento della prenotazione:', error);
            
            // Aggiungi un controllo per verificare se l'errore riguarda la risposta del server
            if (error.response && error.response.data) {
              alert(`Errore: ${error.response.data.error}`);
            } else {
              alert('Non è stato possibile aggiornare la prenotazione.');
            }
          });
      }
    },
  },
};

export default Utente;

