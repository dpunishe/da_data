class CompanyLookup extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
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

    const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party';
    const token = '7fd18aaabd7d53ffa4846e4521c1f736c13490eb';
    const query = 'сбербанк';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ query })
    };
    fetch(url, options)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
    
// Define a function that joins an array of elements with a separator
const join = (arr, separator = ", ") => arr.filter(n => n).join(separator);

// Define an object that maps type codes to descriptions
const TYPES = {
  'INDIVIDUAL': 'Индивидуальный предприниматель',
    'LEGAL': 'Организация'
};

// Define a function that returns the description for a given type code
const typeDescription = type => TYPES[type];

// Define a function that displays a suggestion in the UI
const showSuggestion = suggestion => {
  console.log(suggestion);
  const { data } = suggestion;
  if (!data) {
    return;
  }

  $("#type").text(`${typeDescription(data.type)} (${data.type})`);

  if (data.name) {
    $("#name_short").val(data.name.short_with_opf || "");
    $("#name_full").val(data.name.full_with_opf || "");
  }

  $("#inn_kpp").val(join([data.inn, data.kpp], " / "));

  if (data.address) {
    let address = "";
    if (data.address.data.qc === "0") {
      address = join([data.address.data.postal_code, data.address.value]);
    } else {
      address = data.address.data.source;
    }
    $("#address").val(address);
  }
};

// Set up the UI component for displaying suggestions
$("#party").suggestions({
  token: token,
  type: "PARTY",
  count: 5,
  // Called when the user selects one of the suggestions
  onSelect: showSuggestion
});

  }
}
customElements.define('company-lookup', CompanyLookup);