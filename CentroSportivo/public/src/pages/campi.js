const campi = {
    data() {
        return {
            activities: []
        };
    },
    template: `
        <div class="container">
            <h1 class="text-center mt-5">I nostri Campi</h1>
            <div v-if="activities.length" class="row mt-5">
                <div v-for="activity in activities" :key="activity.id" class="col-12 col-md-6 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ activity.nome }}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">{{ activity.tipo }}</h6>
                            <p class="card-text">{{ activity.descrizione }}</p>
                            <p class="card-text"><strong>Costo per ora:</strong> €{{ activity.costo_ora }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center mt-5">
                <p>Nessun campo disponibile al momento.</p>
            </div>
        </div>
    `,
    created() {
        this.fetchActivities();
    },
    methods: {
        fetchActivities() {
            axios.get('/api/campi')
                .then(response => {
                    console.log('Dati ricevuti dal server:', response.data);
                    this.activities = response.data;
                })
                .catch(error => {
                    console.error('Errore nel caricamento dei campi:', error);
                    if (error.response) {
                        console.error('Errore nella risposta del server:', error.response.data);
                        console.error('Codice di stato:', error.response.status);
                        console.error('Headers:', error.response.headers);
                    } else if (error.request) {
                        console.error('Nessuna risposta ricevuta dal server. Request:', error.request);
                    } else {
                        console.error('Errore nella configurazione della richiesta:', error.message);
                    }
                });
        }
    }
};

export default campi;

