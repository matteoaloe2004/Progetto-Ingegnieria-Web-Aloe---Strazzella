const Aboutus = {
  template: `
<div class="container py-5">
  <h1 class="text-center mb-5 fw-bold">Domande Frequenti (FAQ)</h1>
  <div class="accordion" id="faqAccordion">
    <div v-for="(faq, index) in faqs" :key="index" class="accordion-item">
      <h2 class="accordion-header" :id="'heading' + index">
        <button class="accordion-button collapsed" type="button" 
                :data-bs-toggle="'collapse'" 
                :data-bs-target="'#collapse' + index" 
                aria-expanded="false" 
                :aria-controls="'collapse' + index">
          {{ faq.question }}
        </button>
      </h2>
      <div :id="'collapse' + index" 
           class="accordion-collapse collapse" 
           :aria-labelledby="'heading' + index" 
           data-bs-parent="#faqAccordion">
        <div class="accordion-body">
          {{ faq.answer }}
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  
  data() {
    return {
      faqs: [
        { question: "Come posso prenotare un campo?", answer: "Per prenotare un campo, accedi al menu 'Prenota' e seleziona il campo e le date che desideri. Inserisci le tue credenziali e segui le istruzioni." },
        { question: "Come posso cancellare una prenotazione?", answer: "Per cancellare una prenotazione, accedi al menu 'Le mie prenotazioni' e seleziona la prenotazione da cancellare. Inserisci le tue credenziali e segui le istruzioni." },
        { question: "Posso prenotare un campo per uso privato?", answer: "Sì, puoi prenotare un campo per uso privato." },
        { question: "Posso prenotare un campo per uso commerciale?", answer: "Sì, puoi prenotare un campo per uso commerciale." },
        { question: "Posso prenotare un campo per uso associativo?", answer: "Sì, puoi prenotare un campo per uso associativo." },
        { question: "Posso prenotare un campo per uso scolastico?", answer: "Sì, puoi prenotare un campo per uso scolastico. Inoltre, gli istituti scolastici possono prenotare il campo per piu di 3 ore se necessario" },
        { question: "Come possiamo contattarvi e ottenere aiuto?", answer: "Per ottenere aiuto, puoi contattarci tramite email o telefonando al numero di telefono fornito || CentroSportivoUnibo@example.com  || Telefono: 0543 0000000 . Puoi anche chiedere aiuto per la prenotazione di un campo." }
      ]
    };
  }
};

export default Aboutus;
