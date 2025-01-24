const Prenota = {
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12 text-center mt-5">
          <h1>Prenota un Campo</h1>
          <p>Scegli il Campo sportivo che preferisci e prenota il tuo posto.</p>
        </div>
      </div>
      <div class="row mt-5">
        <!-- Parte sinistra: Modulo di prenotazione -->
        <div class="col-md-5">
          <form @submit.prevent="prenotaAttivita" class="form.prenota">
            <div class="mb-3">
              <label for="activity" class="form-label">Campi Disponibili</label>
              <select id="activity" v-model="prenotazione.campo_id" class="form-select" required>
                <option value="">Seleziona un Campo</option>
                <option v-for="campo in campi" :key="campo.id" :value="campo.id">{{ campo.nome }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="date" class="form-label">Data</label>
              <input type="date" v-model="prenotazione.data_prenotazione" @change="checkDisponibilita" class="form-control" :min="minDate" required>
            </div>
            <div v-if="disponibilita.length > 0" class="mb-3">
              <h5>Fascie Orarie Occupate per il {{ prenotazione.data_prenotazione }}</h5>
              <ul class="list-group">
                <li v-for="slot in disponibilita" :key="slot.id" class="list-group-item">
                  <strong>Orario:</strong> {{ slot.orario_inizio }} - {{ slot.orario_fine }}
                </li>
              </ul>
            </div>
            <div v-else-if="prenotazione.campo_id && prenotazione.data_prenotazione" class="mb-3">
              <p class="text-success">Il campo è disponibile per l'intera giornata.</p>
            </div>
            <div class="mb-3">
              <label for="startTime" class="form-label">Orario Inizio</label>
              <input type="time" v-model="prenotazione.orario_inizio" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="endTime" class="form-label">Orario Fine</label>
              <input type="time" v-model="prenotazione.orario_fine" class="form-control" required>
            </div>

            <!-- Messaggi di notifica -->
            <div v-if="notification.message" :class="['alert', notification.type === 'success' ? 'alert-success' : 'alert-danger']">
              {{ notification.message }}
            </div>

            <div class="d-flex justify-content-between">
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting">Caricamento...</span>
                <span v-else>Prenota</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Parte destra: Prenotazioni esistenti -->
        <div class="col-md-6">
          <h2 class="text-center">Prenotazioni esistenti</h2>

          <!-- Filtro per campo -->
          <div class="mb-3">
            <label for="campoFiltro" class="form-label">Filtra per Campo</label>
            <select id="campoFiltro" v-model="campoFiltro" class="form-select">
              <option value="">Tutte le attività</option>
              <option v-for="campo in campi" :key="campo.id" :value="campo.id">{{ campo.nome }}</option>
            </select>
          </div>

          <div v-if="filteredPrenotazioni.length === 0" class="text-center mt-3">
            <p>Nessuna prenotazione trovata.</p>
          </div>
          <div v-else class="list-group">
            <li v-for="prenotazione in filteredPrenotazioni" :key="prenotazione.id" class="list-group-item">
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
      disponibilita: [], // Orari occupati per il campo selezionato e la data
      campoFiltro: '', // Nuova variabile per il filtro
      notification: { message: '', type: '' }, // Nuovo oggetto per notifiche
      isSubmitting: false,
      minDate: '', // Variabile per la data minima
    };
  },
  methods: {
    async prenotaAttivita() {
      this.notification = { message: '', type: '' }; // Resetta la notifica
      this.isSubmitting = true;

      // Verifica se la data selezionata è nel passato
      const selectedDate = new Date(this.prenotazione.data_prenotazione);
      const today = new Date();
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        this.notification = { message: 'Non puoi prenotare per una data passata.', type: 'error' };
        this.isSubmitting = false;
        return;
      }

      // Verifica che la durata della prenotazione non superi le 3 ore
      const startTime = new Date(`1970-01-01T${this.prenotazione.orario_inizio}:00`);
      const endTime = new Date(`1970-01-01T${this.prenotazione.orario_fine}:00`);
      const duration = (endTime - startTime) / (1000 * 60 * 60); // Calcola la durata in ore

      if (duration > 3) {
        this.notification = { message: 'Non puoi prenotare per più di 3 ore consecutive.', type: 'error' };
        this.isSubmitting = false;
        return;
      }

      const username = localStorage.getItem('username'); // Recupera username
      if (!username) {
        this.notification = { message: 'Devi essere loggato per effettuare una prenotazione.', type: 'error' };
        this.isSubmitting = false;
        return;
      }

      const prenotazioneConUtente = { ...this.prenotazione, username };
      try {
        const response = await fetch('/api/prenota', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prenotazioneConUtente),
        });

        if (response.ok) {
          const data = await response.json();
          this.notification = { message: `Prenotazione effettuata con successo! ID Prenotazione: ${data.id}`, type: 'success' };
          this.fetchPrenotazioni();
        } else {
          const error = await response.json();
          this.notification = { message: 'Errore: ' + error.error, type: 'error' };
        }
      } catch (error) {
        this.notification = { message: 'Errore nella comunicazione con il server. Riprova più tardi.', type: 'error' };
      } finally {
        this.isSubmitting = false;
      }
    },
    async fetchPrenotazioni() {
      try {
        const response = await fetch('/api/prenota');
        if (response.ok) {
          this.prenotazioni = await response.json();
        } else {
          this.prenotazioni = [];
        }
      } catch {
        this.prenotazioni = [];
      }
    },
    async fetchCampi() {
      try {
        const response = await fetch('/api/campi');
        if (response.ok) {
          this.campi = await response.json();
        } else {
          this.campi = [];
        }
      } catch {
        this.campi = [];
      }
    },
    async checkDisponibilita() {
      // Reset della lista disponibilità
      this.disponibilita = [];
    
      // Verifica che i campi richiesti siano stati selezionati
      if (!this.prenotazione.campo_id || !this.prenotazione.data_prenotazione) {
        console.log('Campo o data non selezionati.');
        return;
      }
    
      console.log(`Verifica disponibilità per campo: ${this.prenotazione.campo_id} e data: ${this.prenotazione.data_prenotazione}`);
    
      try {
        const response = await fetch(`/api/prenota?disponibilita&campo_id=${this.prenotazione.campo_id}&data_prenotazione=${this.prenotazione.data_prenotazione}`);
        console.log('Risposta dal server:', response);
    
        if (response.ok) {
          const data = await response.json();
          console.log('Dati di disponibilità ricevuti:', data);
          this.disponibilita = data;
        } else {
          console.error("Errore nel recuperare la disponibilità: risposta non ok.");
          console.error('Status Code:', response.status);
          const errorData = await response.json();
          console.error('Dettagli errore:', errorData);
        }
      } catch (error) {
        console.error("Errore nella comunicazione con il server:", error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('it-IT', options);
    },
  },
  computed: {
    filteredPrenotazioni() {
      if (!this.campoFiltro) {
        return this.prenotazioni;
      }
      return this.prenotazioni.filter(
        (prenotazione) => prenotazione.campo_id === this.campoFiltro
      );
    },
  },
  mounted() {
    this.fetchPrenotazioni();
    this.fetchCampi();

    // Imposta la data minima alla data odierna
    const today = new Date().toISOString().split('T')[0];
    this.minDate = today;

    const username = localStorage.getItem('username');
    if (!username) this.$router.push('/login');
  },
};

export default Prenota;