const Register = {
  template: `
    <div class="login-container container-fluid mt-4 mb-4">
      <form @submit.prevent="registerUser" class="login-form">
        <label class="form-label" for="nome">Nome</label>
        <input type="text" id="nome" v-model="nome" placeholder="Inserisci il tuo nome" required />

        <label class="form-label" for="cognome">Cognome</label>
        <input type="text" id="cognome" v-model="cognome" placeholder="Inserisci il tuo cognome" required />

        <label class="form-label" for="username">Username</label>
        <input type="text" id="username" v-model="username" placeholder="Inserisci il tuo username" required />

        <label class="form-label" for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Inserisci la tua email" required />

        <label class="form-label" for="password">Password</label>
        <input 
          class="input" 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="Inserisci la tua password" 
          minlength="8" 
          required 
        />
        <small class="form-text text-muted">La password deve contenere almeno 8 caratteri.</small>

        <div class="tabs">
          <button type="submit" class="tab">REGISTRATI</button>
        </div>

        <p class="separator mt-4">Oppure</p>

        <div class="text-center">
          <router-link to="/login">
            <button type="button" class="btn btn-outline-primary">Torna indietro</button>
          </router-link>
        </div>

        <!-- Messaggi di feedback -->
        <div v-if="feedbackMessage" :class="feedbackClass" class="feedback-message mt-4">
          {{ feedbackMessage }}
        </div>
      </form>
    </div>
  `,

  data() {
    return {
      email: '',
      username: '',
      password: '',
      nome: '',
      cognome: '',
      feedbackMessage: '', // Messaggio di feedback
      feedbackClass: '' // Classe per il tipo di messaggio
    };
  },

  methods: {
    async registerUser() {
      try {
        const response = await axios.post('http://localhost:3000/api/register', {
          email: this.email,
          username: this.username,
          password: this.password,
          nome: this.nome,
          cognome: this.cognome
        });

        // Mostra un messaggio di successo
        this.feedbackMessage = 'Registrazione avvenuta con successo!';
        this.feedbackClass = 'alert alert-success';
        setTimeout(() => this.$router.push('/login'), 2000); // Reindirizza dopo 2 secondi
      } catch (error) {
        // Mostra il messaggio di errore
        this.feedbackMessage = error.response?.data?.message || 'Errore durante la registrazione. Riprova!';
        this.feedbackClass = 'alert alert-danger';
      }
    }
  }
};

export default Register;
