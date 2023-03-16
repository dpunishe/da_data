class CompanyLookup extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    this.attachShadow({ mode: 'open' });

    // Create the HTML for the component
    const template = `
      <style>
        body {
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        input {
          font-size: 16px;
          padding: 4px;
        }

        .result {
          width: 50%;
          min-width: 300px;
        }

        .row {
          margin-top: 1em;
        }

        .row label {
          display: block;
          min-width: 10em;
        }

        .row input, .row textarea {
          width: 100%;
        }
      </style>
      <section class="container">
        <p><strong>Компания или ИП</strong></p>
        <input id="party" name="party" type="text" placeholder="Введите название, ИНН, ОГРН или адрес организации" />
      </section>

      <section class="result">
        <p id="type"></p>
        <div class="row">
          <label>Краткое наименование</label>
          <input id="name_short">
        </div>
        <div class="row">
          <label>Полное наименование</label>
          <input id="name_full">
        </div>
        <div class="row">
          <label>ИНН / КПП</label>
          <input id="inn_kpp">
        </div>
        <div class="row">
          <label>Адрес</label>
          <input id="address">
        </div>
      </section>
    `;

    // Insert the HTML into the shadow root
    this.shadowRoot.innerHTML = template;

    // Replace with your API key
    const token = "7fd18aaabd7d53ffa4846e4521c1f736c13490eb";

    const join = (arr, separator = ", ") => {
      return arr.filter(n => n).join(separator);
    };

    const typeDescription = (type) => {
      const TYPES = {
        INDIVIDUAL: "Индивидуальный предприниматель",
        LEGAL: "Организация"
      };

      return TYPES[type];
    };

    const showSuggestion = suggestion => {
      console.log(suggestion);
      const { data } = suggestion;
      if (!data) return;

      const type = typeDescription(data.type);
      this.shadowRoot.querySelector("#type").textContent = `${type} (${data.type})`;

      if (data.name) {
        this.shadowRoot.querySelector("#name_short").value = data.name.short_with_opf || "";
        this.shadowRoot.querySelector("#name_full").value = data.name.full_with_opf || "";
      }

      const innKpp = join([data.inn, data.kpp], " / ");
      this.shadowRoot.querySelector("#inn_kpp").value = innKpp;

      if (data.address) {
        let address = "";
        if (data.address.data.qc == "0") {
          address = join([data.address.data.postal_code, data.address.value]);
        } else {
          address = data.address.data.source;
        }
        this.shadowRoot.querySelector("#address").value = address;
      }
    };

    this.shadowRoot.querySelector
  }
}

// Register the custom element
customElements.define('company-lookup', CompanyLookup);