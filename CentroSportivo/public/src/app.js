import Home from './pages/Home.js';
import Aboutus from './pages/Aboutus.js';
import Campi from './pages/campi.js';
import Login from './pages/login.js';
import Prenota from './pages/prenota.js';
import register from './pages/register.js';
import utente from './pages/utente.js';

const auth = {
    isLoggedIn: () => !!localStorage.getItem('username'),
    userRole: () => localStorage.getItem('role'), 
}; //valori per computed 


 // oppure createWebHistory
 const routes = [
    { path: '/', component: Home },
    { path: '/campi', component: Campi },
    { path: '/prenota', component: Prenota },
    { path: '/Login', component: Login },
    { path: '/Aboutus', component: Aboutus },
    { path: '/register', component: register },
    { path: '/utente', component: utente },
  ];

  const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
  });



const app = Vue.createApp({
    data() {
      return {};
    },
    computed: {
      isLoggedIn() {
        return auth.isLoggedIn();
      },
      userRole() {
        return auth.userRole();
      }
    }
  });
  
  app.use(router);
  app.mount('#app');
  console.log('Vue app mounted');