const Register = {
  template: `
    <div class="login-container">
  <div class="header">
    <h1>Registrati e Prenota Subito!</h1>
  </div>
  <form @submit.prevent="registerUser" class="login-form">
    <div class="form-group">
      <label for="nome">
        <i class="fas fa-user"></i> Nome
      </label>
      <input type="text" id="nome" v-model="nome" placeholder="Inserisci il tuo nome" required />
    </div>
    <div class="form-group">
      <label for="cognome">
        <i class="fas fa-user"></i> Cognome
      </label>
      <input type="text" id="cognome" v-model="cognome" placeholder="Inserisci il tuo cognome" required />
    </div>
    <div class="form-group">
      <label for="username">
        <i class="fas fa-user"></i> Username
      </label>
      <input type="text" id="username" v-model="username" placeholder="Inserisci il tuo username" required />
    </div>
    <div class="form-group">
      <label for="email">
        <i class="fas fa-envelope"></i> Email
      </label>
      <input type="email" id="email" v-model="email" placeholder="Inserisci la tua email" required />
    </div>
    <div class="form-group">
      <label for="password">
        <i class="fas fa-lock"></i> Password
      </label>
      <input 
        type="password" 
        id="password" 
        v-model="password" 
        placeholder="Inserisci la tua password" 
        minlength="8" 
        required 
      />
      <small class="form-text text-muted">La password deve contenere almeno 8 caratteri.</small>
    </div>
    <button type="submit" class="btn-login">Registrati</button>
    <div class="tabs">
      <router-link to="/login" class="tab">
        <button type="button">Torna Indietro</button>
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
