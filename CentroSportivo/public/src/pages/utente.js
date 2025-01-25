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

          <button type="button" class="btn btn-danger btn-sm me-2" @click="logout">Logout</button>
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
            <!-- Mostra il form di modifica o i dati statici -->
            <template v-if="prenotazione.id === prenotazioneInModifica">
              <td>
                <input type="date" v-model="modificaData" class="form-control" />
              </td>
              <td>
                <input type="time" v-model="modificaOrarioInizio" class="form-control" />
              </td>
              <td>
                <input type="time" v-model="modificaOrarioFine" class="form-control" />
              </td>
              <td>
                <!-- Rimuoviamo il campo modificabile e lo lasciamo statico -->
                <input type="text" :value="modificaCampo" class="form-control" disabled />
              </td>
              <td>
                <button class="btn btn-success btn-sm me-2" @click="salvaModifiche(prenotazione.id)">Salva</button>
                <button class="btn btn-secondary btn-sm" @click="annullaModifiche">Annulla</button>
              </td>
            </template>

            <template v-else>
              <td>{{ formatData(prenotazione.data_prenotazione) }}</td>
              <td>{{ prenotazione.orario_inizio }}</td>
              <td>{{ prenotazione.orario_fine }}</td>
              <td>{{ prenotazione.campo }}</td>
              <td>
                <button class="btn btn-danger btn-sm me-2" @click="eliminaPrenotazione(prenotazione)">Elimina</button>
                <button class="btn btn-primary btn-sm" @click="apriModifica(prenotazione)">Modifica</button>
              </td>
            </template>
          </tr>
          <tr v-if="prenotazioni.length === 0">
            <td colspan="5" class="text-center">Nessuna prenotazione trovata.</td>
          </tr>
        </tbody>
      </table>

      <h2 class="my-4">Storico Prenotazioni</h2>

      <table class="table table-striped">
        <thead>
          <tr>
            <th>Data</th>
            <th>Orario Inizio</th>
            <th>Orario Fine</th>
            <th>Campo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prenotazioneStorica in prenotazioniStoriche" :key="prenotazioneStorica.id">
            <td>{{ formatData(prenotazioneStorica.data_prenotazione) }}</td>
            <td>{{ prenotazioneStorica.orario_inizio }}</td>
            <td>{{ prenotazioneStorica.orario_fine }}</td>
            <td>{{ prenotazioneStorica.campo }}</td>
          </tr>
          <tr v-if="prenotazioniStoriche.length === 0">
            <td colspan="4" class="text-center">Nessuna prenotazione storica trovata.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  
  data() {
    return {
      username: '',
      prenotazioni: [], // Prenotazioni attive
      prenotazioniStoriche: [],
      message: null, // Messaggio da visualizzare
      prenotazioneInModifica: null, // ID della prenotazione in modifica
      modificaData: '',
      modificaOrarioInizio: '',
      modificaOrarioFine: '',
      modificaCampo: '',
    };
  },

  created() {
    this.username = localStorage.getItem('username') || 'Utente';
    this.caricaPrenotazioni(); // Carica le prenotazioni attive
    this.recuperaPrenotazioniStoriche(); // Carica le prenotazioni storiche
  },

  methods: {
    // Mostra il form di modifica per una prenotazione
    apriModifica(prenotazione) {
      this.prenotazioneInModifica = prenotazione.id;
      this.modificaData = prenotazione.data_prenotazione;
      this.modificaOrarioInizio = prenotazione.orario_inizio;
      this.modificaOrarioFine = prenotazione.orario_fine;
      this.modificaCampo = prenotazione.campo;
    },

    // Salva le modifiche della prenotazione
    salvaModifiche(id) {
      const nuovaData = this.modificaData;
      const nuovoOrarioInizio = this.modificaOrarioInizio;
      const nuovoOrarioFine = this.modificaOrarioFine;
    
      // Verifica che la nuova data non sia nel passato
      const oggi = new Date();
      const dataPrenotazione = new Date(nuovaData);
      oggi.setHours(0, 0, 0, 0); // Reset dell'orario per confronto solo sulla data
    
      if (dataPrenotazione < oggi) {
        this.showMessage('Non puoi modificare una prenotazione per una data passata.', 'alert-danger');
        return;
      }
    
      // Verifica che la durata non superi le 2 ore
      const orarioInizio = new Date(`1970-01-01T${nuovoOrarioInizio}:00`);
      const orarioFine = new Date(`1970-01-01T${nuovoOrarioFine}:00`);
      const durata = (orarioFine - orarioInizio) / (1000 * 60 * 60); // Calcolo in ore
    
      if (durata > 2) {
        this.showMessage('La durata della prenotazione non può superare le 2 ore.', 'alert-danger');
        return;
      }
    
      // Se i controlli passano, salva le modifiche
      const updatedPrenotazione = {
        id,
        data_prenotazione: nuovaData,
        orario_inizio: nuovoOrarioInizio,
        orario_fine: nuovoOrarioFine,
      };
    
      axios.put(`/api/prenota/${id}`, updatedPrenotazione)
        .then(() => {
          this.caricaPrenotazioni(); // Aggiorna la lista delle prenotazioni
          this.showMessage('Prenotazione aggiornata con successo.', 'alert-success');
          this.annullaModifiche(); // Resetta lo stato del form
        })
        .catch((error) => {
          if (error.response && error.response.data.error === 'Il campo è già prenotato per l\'orario selezionato.') {
            this.showMessage('Prenotazione già occupata.', 'alert-warning');
          } else {
            console.error('Errore durante l\'aggiornamento della prenotazione:', error);
            this.showMessage('Non è stato possibile aggiornare la prenotazione.', 'alert-danger');
          }
        });
    },

    // Annulla le modifiche e chiude il form
    annullaModifiche() {
      this.prenotazioneInModifica = null;
      this.modificaData = '';
      this.modificaOrarioInizio = '';
      this.modificaOrarioFine = '';
      this.modificaCampo = '';
    },

    // Carica le prenotazioni attive
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

    // Elimina una prenotazione
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

    // Logout
    logout() {
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      this.showMessage('Logout effettuato con successo.', 'alert-success'); // Mostra il messaggio
      
      // Aspetta 3 secondi (ad esempio) prima di fare il reindirizzamento
      setTimeout(() => {
        this.$router.push('/login'); // Reindirizza alla pagina di login
      }, 3000); // 3000 millisecondi (3 secondi)
    },

    // Formatta la data
    formatData(data) {
      const date = new Date(data);
      return date.toLocaleDateString('it-IT');
    },

    // Mostra messaggio di stato
    showMessage(text, type) {
      this.message = { text, type }; // Aggiunge il messaggio alla proprietà 'message'
      setTimeout(() => { this.message = null; }, 5000); // Rimuove il messaggio dopo 5 secondi
    },

    // Recupera le prenotazioni storiche
    recuperaPrenotazioniStoriche() {
      const urlStorico = `/api/prenota/utente/prenotazioni/storico?username=${this.username}`;
      axios
        .get(urlStorico)
        .then((response) => {
          this.prenotazioniStoriche = response.data;
        })
        .catch((error) => {
          console.error('Errore durante il recupero delle prenotazioni storiche:', error);
          this.showMessage('Errore durante il recupero delle prenotazioni storiche.', 'alert-danger');
        });
    }
  },
};

export default Utente;
