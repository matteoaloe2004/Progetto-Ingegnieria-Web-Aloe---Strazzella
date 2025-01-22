const Login = {
  template: `
    <div class="login-container">
    <div class="header">
      <h1>Ti Aspettiamo!</h1>
    </div>
    <form class="login-form" @submit.prevent="loginUser">
      <div class="form-group">
        <label for="email">
          <i class="fas fa-user"></i> Email
        </label>
        <input type="email" id="email" v-model="email" placeholder="Inserisci la tua email" required />
      </div>
      <div class="form-group">
        <label for="password">
          <i class="fas fa-lock"></i> Password
        </label>
        <input type="password" id="password" v-model="password" placeholder="Inserisci la tua password" required />
      </div>
      <div class="remember-me">
        <input type="checkbox" id="remember" />
        <label for="remember">Ricordami</label>
      </div>
      <button type="submit" class="btn-login">Accedi</button>
      <div class="tabs">
        <router-link to="/register" class="tab">
          <button>Registrati</button>
        </router-link>
      </div>
    </form>
  </div>
  `,
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post('http://localhost:3000/api/Login', {
          email: this.email,
          password: this.password
        });

        if (response.data.success) {
          console.log(response.data);  // Verifica la risposta del server
          const username = response.data.username;
          const role = response.data.role;
          localStorage.setItem('username', username);
          localStorage.setItem('role', role);

          this.$router.push(role === 'admin' ? '/admin' : '/utente');
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Errore durante il login:', error);
        alert('Email o Password errata');
      }
    }
  }
};
export default Login;
