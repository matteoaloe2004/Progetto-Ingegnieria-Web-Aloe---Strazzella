const Prenota = {
    template: `
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mt-5">
            <h1>Prenota un'attività</h1>
            <p>Scegli l'attività sportiva che preferisci e prenota il tuo posto.</p>
          </div>
        </div>
        <div class="row mt-5">
          <!-- Parte sinistra: Modulo di prenotazione -->
          <div class="col-md-5">
            <form @submit.prevent="prenotaAttivita" class="form.prenota">
              <div class="mb-3">
                <label for="activity" class="form-label">Attività</label>
                <select id="activity" v-model="prenotazione.campo_id" class="form-select" required>
                  <option value="">Seleziona un'attività</option>
                  <option v-for="campo in campi" :key="campo.id" :value="campo.id">{{ campo.nome }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="date" class="form-label">Data</label>
                <input type="date" v-model="prenotazione.data_prenotazione" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="startTime" class="form-label">Orario Inizio</label>
                <input type="time" v-model="prenotazione.orario_inizio" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="endTime" class="form-label">Orario Fine</label>
                <input type="time" v-model="prenotazione.orario_fine" class="form-control" required>
              </div>

              <!-- Messaggi di errore o successo -->
              <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>

              <div class="d-flex justify-content-between">
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  <span v-if="isSubmitting">Caricamento...</span>
                  <span v-else>Prenota</span>
                </button>
                <router-link to="/utente">
                  <button type="button" class="btn btn-danger" @click="logout">Logout</button>
                </router-link>
              </div>
            </form>
          </div>

          <!-- Parte destra: Prenotazioni esistenti -->
          <div class="col-md-6">
            <h2 class="text-center">Prenotazioni esistenti</h2>
            <div v-if="prenotazioni.length === 0" class="text-center mt-3">
              <p>Nessuna prenotazione trovata.</p>
            </div>
            <div v-else class="list-group">
              <li v-for="prenotazione in prenotazioni" :key="prenotazione.id" class="list-group-item">
                <p><strong>Utente:</strong> {{ prenotazione.username }}</p>
                <p><strong>Campo:</strong> {{ prenotazione.campo }}</p>
                <p><strong>Data:</strong> {{ formatDate(prenotazione.data_prenotazione) }}</p>
                <p><strong>Orario:</strong> {{ prenotazione.orario_inizio }} - {{ prenotazione.orario_fine }}</p>
              </li>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        prenotazione: {
          campo_id: '',
          data_prenotazione: '',
          orario_inizio: '',
          orario_fine: '',
        },
        campi: [], // Lista delle attività dal database
        prenotazioni: [], // Lista delle prenotazioni dal database
        successMessage: '',
        errorMessage: '',
        isSubmitting: false,
      };
    },
    methods: {
        async prenotaAttivita() {
          this.successMessage = '';
          this.errorMessage = '';
          this.isSubmitting = true;
      
          // Verifica se l'utente è loggato controllando l'username nel localStorage
          const username = localStorage.getItem('username');  // Recupero l'username dal localStorage
      
          if (!username) {
            this.errorMessage = 'Devi essere loggato per effettuare una prenotazione.';
            this.isSubmitting = false;
            return;
          }
      
          // Aggiungi l'username alla prenotazione
          const prenotazioneConUtente = {
            ...this.prenotazione,
            username, // Usa l'username invece dell'utente_id
          };
      
          try {
            const response = await fetch('/api/prenota', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(prenotazioneConUtente),
            });
      
            if (response.ok) {
              const data = await response.json();
              this.successMessage = `Prenotazione effettuata con successo! ID Prenotazione: ${data.id}`;
              this.fetchPrenotazioni();
            } else {
              const error = await response.json();
              this.errorMessage = 'Errore: ' + error.error;
            }
          } catch (error) {
            this.errorMessage = 'Errore nella comunicazione con il server. Riprova più tardi.';
          } finally {
            this.isSubmitting = false;
          }
        },
        async fetchPrenotazioni() {
          try {
            const response = await fetch('/api/prenota');
            if (response.ok) {
              const prenotazioni = await response.json();
              console.log('Prenotazioni ricevute:', prenotazioni); // Log per verificare i dati ricevuti
              this.prenotazioni = prenotazioni;
            } else {
              console.log('Nessuna prenotazione trovata');
              this.prenotazioni = [];
            }
          } catch (error) {
            console.error('Errore nel recupero delle prenotazioni:', error);
            this.prenotazioni = [];
          }
        },
        async fetchCampi() {
          try {
            const response = await fetch('/api/attivita');
            if (response.ok) {
              this.campi = await response.json();
            } else {
              this.campi = [];
            }
          } catch (error) {
            console.error('Errore nel recupero dei campi:', error);
            this.campi = [];
          }
        },
        formatDate(dateString) {
          const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
          return new Date(dateString).toLocaleDateString('it-IT', options);
        },
      },
      mounted() {
        this.fetchPrenotazioni();
        this.fetchCampi();
        // Verifica se l'utente è loggato controllando l'username nel localStorage
        const username = localStorage.getItem('username');
        if (!username) {
          this.$router.push('/login'); // Se non è loggato, rimanda alla pagina di login
        }
      },

};

export default Prenota;
