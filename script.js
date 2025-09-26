const API_KEY = "2bc2ec422c4cd5dcf50da062"; // ta clé API
const BASE_URL = "https://v6.exchangerate-api.com/v6";

const fromCurrencySelect = document.getElementById("fromCurrency");
const toCurrencySelect = document.getElementById("toCurrency");
const resultEl = document.getElementById("result");

// Fonction d’affichage des erreurs
const displayError = (message) => {
  resultEl.textContent = message;
  resultEl.style.color = "red";
};

// Charger la liste des devises depuis l’API
const loadCurrencies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/latest/USD`);
    const data = await response.json();

    if (data.result !== "success") {
      displayError("Impossible de charger les devises");
      return;
    }

    // Récupère tous les codes de devises
    const currencies = Object.keys(data.conversion_rates);

    // Remplir les <select>
    currencies.forEach(currency => {
      const option1 = document.createElement("option");
      option1.value = currency;
      option1.textContent = currency;
      fromCurrencySelect.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = currency;
      option2.textContent = currency;
      toCurrencySelect.appendChild(option2);
    });

    // Valeurs par défaut
    fromCurrencySelect.value = "EUR";
    toCurrencySelect.value = "USD";
  } catch (error) {
    console.error(error);
    displayError("Erreur lors du chargement des devises");
  }
};

// Fonction de conversion
const convert = async (amount, fromCurrency, toCurrency) => {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${fromCurrency}`);
    const data = await response.json();

    if (data.result !== "success") {
      displayError("Erreur API");
      return;
    }

    const rate = data.conversion_rates[toCurrency];
    const converted = (amount * rate).toFixed(2);

    resultEl.textContent = `${amount} ${fromCurrency} = ${converted} ${toCurrency}`;
    resultEl.style.color = "black";
  } catch (error) {
    console.error(error);
    displayError("Conversion impossible");
  }
};

// Gestion du formulaire
document.addEventListener("DOMContentLoaded", () => {
  loadCurrencies();

  document.getElementById("converterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = document.getElementById("amount").value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    convert(amount, fromCurrency, toCurrency);
  });
});

//localstorage + historique
