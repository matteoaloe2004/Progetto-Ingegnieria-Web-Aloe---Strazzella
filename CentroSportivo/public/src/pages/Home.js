const Home = {
    template: `
      <div class="container mt-5">
          <!-- Titolo principale -->
          <div class="row">
              <div class="col-12 text-center">
                  <h1 class="title">Benvenuto al Centro Sportivo Unibo</h1>
              </div>
          </div>
          
          <!-- Blocco descrittivo con immagine -->
          <div class="row mt-5">
              <div class="col-12 col-md-6 offset-md-3 text-center">
                  <div class="image-container mb-4"></div>
                  <p>
                      <i class="fas fa-heartbeat icon"></i>
                      Il nostro centro sportivo nasce da una grande passione per lo sport, al fine di assicurare la salute fisica e mentale.
                  </p>
                  <p>
                      <i class="fas fa-users icon"></i>
                      Offriamo un servizio di noleggio campi sportivi unico ed esclusivo, gestito da personale altamente qualificato e pronto a soddisfare le tue esigenze. Disponiamo dei migliori campi sportivi della zona, garantendo la massima sicurezza e comfort per te e per i tuoi compagni di squadra.
                  </p>
                  <p>
                      <i class="fas fa-handshake icon"></i>
                      Speriamo di vederti presto al nostro centro sportivo!
                  </p>
              </div>
          </div>
  
          <!-- Sezione aggiuntiva (informazioni sui corsi e servizi) -->
          <div class="row mt-5">
              <div class="col-12 col-md-8 offset-md-2 text-center">
                  <h3 class="mb-4">I nostri campi e le nostre offerte</h3>
                  <p class="description mb-3">
                      Disponiamo di una vasta gamma di campi sportivi, accessibili per quasi tutti gli sport, disponibili durante tutto l'anno. Ogni campo è progettato per soddisfare le esigenze di ogni atleta, garantendo qualità e sicurezza in ogni stagione.
                  </p>
                  <p class="description mb-3">
                      Siamo sempre al passo con le novità sportive e offriamo un servizio personalizzato e personalizzato, garantendo la massima sicurezza e comfort per tutti gli sportisti.
                  </p>
                  <p class="description mb-4">
                     Sottostante puoi vedere alcuni dei nostri campi!
                  </p>
              </div>
          </div>
    
          <!-- Carosello -->
          <div class="row mt-5">
              <div class="col-12 text-center">
                  <div id="imageCarousel" class="carousel slide mx-auto" data-bs-ride="carousel" style="max-width: 600px;">
                      <div class="carousel-inner">
                          <div class="carousel-item active">
                              <img src="/png/CampoBasketHome.jpg" class="d-block w-100 rounded" style="height: 300px; object-fit: cover;" alt="Campo da Basket">
                              <div class="carousel-caption d-none d-md-block">
                                  <h5>Campo da Basket</h5>
                                  <p>Campo da basket indoor con pavimento in gomma</p>
                              </div>
                          </div>
                          <div class="carousel-item">
                              <img src="/png/CampoCalcioHome.jpg" class="d-block w-100 rounded" style="height: 300px; object-fit: cover;" alt="Campo da Calcio">
                              <div class="carousel-caption d-none d-md-block">
                                  <h5>Campo da Calcio</h5>
                                  <p>Campo da calcio da 7 a 9 giocatori in erba sintetica</p>
                              </div>
                          </div>
                          <div class="carousel-item">
                              <img src="/png/CampoTennisHome.jpg" class="d-block w-100 rounded" style="height: 300px; object-fit: cover;" alt="Campo da Tennis">
                              <div class="carousel-caption d-none d-md-block">
                                  <h5>Campo da Tennis</h5>
                                   <p>Campo da Tennis outdoor disponibile sia in cemento che in sabbia rossa</p>
                              </div>
                          </div>
                          <div class="carousel-item">
                              <img src="/png/CampoPallavoloHome.jpg" class="d-block w-100 rounded" style="height: 300px; object-fit: cover;" alt="Campo da Pallavolo">
                              <div class="carousel-caption d-none d-md-block">
                                  <h5>Campo da Pallavolo</h5>
                                  <p>Classico campo da pallavolo con pavimento in gomma al chiuso</p>
                              </div>
                          </div>
                      </div>
                      <!-- Controlli del carosello -->
                      <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Previous</span>
                      </button>
                      <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                          <span class="carousel-control-next-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Next</span>
                      </button>
                  </div>
              </div>
          </div>
      </div>
    `
  };
  
  export default Home;
  