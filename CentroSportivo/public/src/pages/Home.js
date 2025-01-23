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
          <div id="carouselExample" 
               class="carousel slide" 
               data-bs-ride="carousel" 
               data-bs-interval="2500" 
               data-bs-pause="false" 
               style="pointer-events: none;">
            <div class="carousel-inner" style="width: 100%; height: 400px;">
              <div class="carousel-item active">
                <img src="/png/CentroSportivo.jpg" class="d-block w-100" style="height: 100%; object-fit: cover;" alt="Centro Sportivo">
              </div>
              <div class="carousel-item">
                <img src="/png/CentroSportivo2.jpg" class="d-block w-100" style="height: 100%; object-fit: cover;" alt="Centro Sportivo 2">
              </div>
              <div class="carousel-item">
                <img src="/png/CampoCalcioCarosello.jpg" class="d-block w-100" style="height: 100%; object-fit: cover;" alt="Campo da Calcio">
              </div>
              <div class="carousel-item">
                <img src="/png/CampoPallavoloCarosello.jpg" class="d-block w-100" style="height: 100%; object-fit: cover;" alt="Campo da Pallavolo">
              </div>
            </div>
          </div>
          <p>
            Il nostro centro sportivo nasce da una grande passione per lo sport, al fine di assicurare la salute fisica e mentale.
          </p>
          <p>
            Offriamo un servizio di noleggio campi sportivi unico ed esclusivo, gestito da personale altamente qualificato e pronto a soddisfare le tue esigenze. Disponiamo dei migliori campi sportivi della zona, garantendo la massima sicurezza e comfort per te e per i tuoi compagni di squadra.
          </p>
          <p>
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
      <!-- Esposizione dei campi -->
      <div class="row mt-5">
        <div class="col-12 col-md-6 mb-4 text-center">
          <img src="/png/CampoBasketHome.jpg" class="d-block w-100 rounded" style="height: 300px; object-fit: cover;" alt="Campo da Basket">
          <h5>Campo da Basket</h5>
          <p>Campo da basket indoor con pavimento in gomma</p>
        </div>
        <div class="col-12 col-md-6 mb-4 text-center">
          <img src="/png/CampoCalcioHome.jpg" class="d-block w-100 rounded" style="height: 300px; object-fit: cover;" alt="Campo da Calcio">
          <h5>Campo da Calcio</h5>
          <p>Campo da calcio da 7 a 9 giocatori in erba sintetica</p>
        </div>
        <div class="col-12 col-md-6 mb-4 text-center">
          <img src="/png/CampoTennisHome.jpg" class="d-block w-100 rounded" style="height: 300px; object-fit: cover;" alt="Campo da Tennis">
          <h5>Campo da Tennis</h5>
          <p>Campo da Tennis outdoor disponibile sia in cemento che in sabbia rossa</p>
        </div>
        <div class="col-12 col-md-6 mb-4 text-center">
          <img src="/png/CampoPallavoloHome.jpg" class="d-block w-100 rounded" style="height: 300px; object-fit: cover;" alt="Campo da Pallavolo">
          <h5>Campo da Pallavolo</h5>
          <p>Classico campo da pallavolo con pavimento in gomma al chiuso</p>
        </div>
      </div>
    </div>
  `
};

export default Home;
