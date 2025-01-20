const Register = {
  template: `
    <div class="login-container container-fluid mt-4 mb-4">
      <form @submit.prevent="registerUser" class="login-form">
        <label for="nome">Nome</label>
        <input type="text" id="nome" v-model="nome" placeholder="Inserisci il tuo nome" required />

        <label for="cognome">Cognome</label>
        <input type="text" id="cognome" v-model="cognome" placeholder="Inserisci il tuo cognome" required />

        <label for="username">UserName</label>
        <input type="text" id="username" v-model="username" placeholder="Inserisci il tuo username" required />

        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Inserisci la tua email" required />

        <label for="password">Password</label>
        <input class="input" type="password" id="password" v-model="password" placeholder="Inserisci la tua password" required />

        <button type="submit" class="btn-register">REGISTRATI</button>

        <p class="separator mt-4">Oppure</p>

        <div class="text-center">
          <router-link to="/login">
            <button type="button" class="btn btn-outline-primary">Torna indietro</button>
          </router-link>
        </div>
      </form>
    </div>
  `,

  data() { //variabili vuote
    return {
      email: '',
      username: '',
      password: '',
      nome: '',
      cognome: ''
    };
  },

  methods: {
    async registerUser() {
      try {
        const response = await axios.post('http://localhost:3000/api/register', { //chiamata con axios all'api nel 'index.js che collega alla rotta e poi al controller
          email: this.email,
          username: this.username,
          password: this.password,
          nome: this.nome,
          cognome: this.cognome //dati passati
        });
        alert('Registrazione avvenuta con successo!');
        this.$router.push('/login'); //sposta in pagina di login
      } catch (error) {
        console.error('Errore durante la registrazione:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Errore durante la registrazione. Riprova!');
      }
    }
  }
};

export default Register;