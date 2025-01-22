const Utente = {
  template: `
    <div class="utente-container container container-fluid my-5">
      <h1>Bentornato, <span class="username">{{ username }}</span>!</h1>
      <h3>Cosa vuoi fare?</h3>

      <!-- Messaggio di stato -->
      <div v-if="message" class="alert" :class="message.type">
        {{ message.text }}
      </div>

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
          <tr
            v-for="prenotazione in prenotazioni"
            :key="prenotazione.id"
          >
            <td>{{ formatData(prenotazione.data_prenotazione) }}</td>
            <td>{{ prenotazione.orario_inizio }}</td>
            <td>{{ prenotazione.orario_fine }}</td>
            <td>{{ prenotazione.campo }}</td>
            <td>
              <button
                class="btn btn-danger btn-sm me-2"
                @click="eliminaPrenotazione(prenotazione)"
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
            <td colspan="5" class="text-center">
              Nessuna prenotazione trovata.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() {
    return {
      username: '',
      prenotazioni: [], // Prenotazioni attive
      message: null, // Messaggio da visualizzare
    };
  },
  created() {
    this.username = localStorage.getItem('username') || 'Utente';
    this.caricaPrenotazioni(); // Carica le prenotazioni attive
  },
  methods: {
    caricaPrenotazioni() {
      const urlAttive = `/api/prenota/utente/prenotazioni?username=${this.username}&stato=attive`;

      axios
        .get(urlAttive)
        .then((response) => {
          this.prenotazioni = response.data;
        })
        .catch((error) => {
          console.error('Errore durante il recupero delle prenotazioni attive:', error);
          this.showMessage('Errore durante il recupero delle prenotazioni attive.', 'alert-danger');
        });
    },
    eliminaPrenotazione(prenotazione) {
      axios
        .delete(`/api/prenota/${prenotazione.id}`)
        .then(() => {
          this.caricaPrenotazioni(); // Aggiorna le prenotazioni attive
          this.showMessage('Prenotazione eliminata con successo.', 'alert-success');
        })
        .catch((error) => {
          console.error('Errore durante l\'eliminazione della prenotazione:', error);
          this.showMessage('Non è stato possibile eliminare la prenotazione.', 'alert-danger');
        });
    },
    logout() {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      this.$router.push('/login');
    },
    formatData(data) {
      const date = new Date(data);
      return date.toLocaleDateString('it-IT');
    },
    aggiornaPrenotazione(prenotazione) {
      const nuovaData = prompt('Inserisci la nuova data della prenotazione (YYYY/MM/DD):', prenotazione.data_prenotazione);
      const nuovoOrarioInizio = prompt('Inserisci il nuovo orario di inizio (HH:MM):', prenotazione.orario_inizio);
      const nuovoOrarioFine = prompt('Inserisci il nuovo orario di fine (HH:MM):', prenotazione.orario_fine);
      
      if (nuovaData && nuovoOrarioInizio && nuovoOrarioFine) {
        const updatedPrenotazione = {
          id: prenotazione.id,
          data_prenotazione: nuovaData, 
          orario_inizio: nuovoOrarioInizio,
          orario_fine: nuovoOrarioFine
        };
        axios.put(`/api/prenota/${prenotazione.id}`, updatedPrenotazione)
          .then(() => {
            this.caricaPrenotazioni(); // Ricarica la lista delle prenotazioni
            this.showMessage('Prenotazione aggiornata con successo.', 'alert-success');
          })
          .catch((error) => {
            console.error('Errore durante l\'aggiornamento della prenotazione:', error);
            this.showMessage('Non è stato possibile aggiornare la prenotazione.', 'alert-danger');
          });
      }
    },
    showMessage(text, type) {
      this.message = { text, type }; // Aggiunge il messaggio alla proprietà 'message'
      setTimeout(() => { this.message = null; }, 5000); // Rimuove il messaggio dopo 5 secondi
    }
  },
};

export default Utente;

