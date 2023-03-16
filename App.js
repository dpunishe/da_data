class CompanyLookup extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    this.attachShadow({ mode: 'open' });

    // Create the HTML for the component
    const template = `
    <div class="wrapper">
  
  <section class="result">
  <div class="row">
    <p class="heading"><strong>Компания или ИП</strong></p>
    <input class="input-field" id="party" name="party" type="text" placeholder="Введите название, ИНН, ОГРН или адрес организации">
   </div>
    <div class="row">
      <input class="input-field" id="name_short" placeholder="Краткое наименование">
    </div>
    <div class="row">
      <input class="input-field" id="name_full" placeholder="Полное наименование">
    </div>
    <div class="row">
      <input class="input-field" id="inn_kpp" placeholder="ИНН / КПП">
    </div>
    <div class="row">
      <input class="input-field" id="address" placeholder="Адрес">
    </div>
  </section> 
  </div>


  <style>
  body {
    padding: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #e8e8e8;
    width: fit-content(300px);
    height: fit-content(100px);
  }

  .wrapper {
    width: 50%;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-radius: 30px;
    background: #e0e0e0;
    box-shadow: 15px 15px 30px #bebebe,
               -15px -15px 30px #ffffff;
  }
  
  .input-field {
    border: none;
    padding: 1rem;
    border-radius: 1rem;
    background: #e8e8e8;
    transition: 0.3s;
   }
   
   .input-field:focus {
    outline-color: #e8e8e8;
    background: #e8e8e8;
    box-shadow: inset 20px 20px 60px #c5c5c5,
       inset -20px -20px 60px #ffffff;
    transition: 0.3s;
   }
  
  .result {
    width: 95%;
    min-width: 300px;
  }
  
  .row {
    margin-top: 1em;
  }
  
  .label {
    min-width: 10em;
    margin-left: 1em;
  }
  
  .row input, .row textarea {
    width: 100%;
  }  
  
  </style>
    
    `;

    // Insert the HTML into the shadow root
    this.shadowRoot.innerHTML = template;

    const apiUrl = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
    const apiKey = "${API_KEY}";
    const query = "";
    
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Token ${apiKey}`
      },
      body: JSON.stringify({ query })
    };
    
    fetch(apiUrl, options)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log("error", error));
    
    

    // A function that concatenates an array with a separator string
    const join = (arr, separator = ', ') => arr.filter(Boolean).join(separator);

    // A function that returns a description for a given type
    const getTypeDescription = (type) => {
      const TYPES = {
        INDIVIDUAL: 'Индивидуальный предприниматель',
        LEGAL: 'Организация',
      };
      return TYPES[type];
    };

    // A function that displays a suggestion to the user
    const showSuggestion = (suggestion) => {
      console.log(suggestion);
      const { data } = suggestion;
      if (!data) {
        return;
      }

      const { type, name, inn, kpp, address } = data;

      // Display the type of the entity
      $("#type").text(`${getTypeDescription(type)} (${type})`);

      // Display the name of the entity
      if (name) {
        $("#name_short").val(name.short_with_opf ?? '');
        $("#name_full").val(name.full_with_opf ?? '');
      }

      // Display the INN and KPP of the entity
      $("#inn_kpp").val(join([inn, kpp], ' / '));

      // Display the address of the entity
      if (address) {
        const { qc, postal_code, value, source } = address.data;
        const addr = qc === '0' ? join([postal_code, value]) : source;
        $("#address").val(addr);
      }
    };

    // Initialize the "suggestions" plugin for the "party" input field
    $("#party").suggestions({
      token,
      type: 'PARTY',
      count: 5,
      // Callback function that is called when a suggestion is selected by the user
      onSelect: showSuggestion,
    });
  }
}

// Register the custom element
customElements.define('company-lookup', CompanyLookup);