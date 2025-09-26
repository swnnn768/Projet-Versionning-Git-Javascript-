const API_KEY = "2bc2ec422c4cd5dcf50da062"; // ta clé API
const BASE_URL = "https://v6.exchangerate-api.com/v6";

const fromCurrencySelect = document.getElementById("fromCurrency");
const toCurrencySelect = document.getElementById("toCurrency");
const resultEl = document.getElementById("result");
const historyList = document.getElementById("historyList");  // Assure-toi que cet élément existe dans ton HTML

// Affiche les erreurs dans l'élément résultat
const displayError = (message) => {
  resultEl.textContent = message;
  resultEl.style.color = "red";
};

// Charge les devises dans les listes déroulantes
const loadCurrencies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/latest/USD`);
    const data = await response.json();

    if (data.result !== "success") {
      displayError("Impossible de charger les devises");
      return;
    }

    const currencies = Object.keys(data.conversion_rates);

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

    fromCurrencySelect.value = "EUR";
    toCurrencySelect.value = "USD";
  } catch (error) {
    console.error(error);
    displayError("Erreur lors du chargement des devises");
  }
};

// Sauvegarde la requête de conversion dans le localStorage et met à jour l'historique affiché


// Récupère l'historique depuis le localStorage
const getHistoryFromStorage = () => {
  const data = localStorage.getItem("searchHistory");
  return data ? JSON.parse(data) : [];
};

// Charge et affiche l'historique dans le HTML


// Fonction utilitaire pour obtenir une chaîne de temps relatif
const getTimeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `il y a ${seconds} secondes`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} heures`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} jour${days > 1 ? "s" : ""}`;
};

// Convertit une devise et sauvegarde la requête dans l'historique
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

    // Sauvegarde la requête sous la forme "montant DE à À"
const sh = new SearchHistory();
const query = `${amount} ${fromCurrency} = ${converted} ${toCurrency}`;
sh.saveToHistory(query);
sh.loadHistory();
  } catch (error) {
    console.error(error);
    displayError("Conversion impossible");
  }
};

// Initialise tout lorsque le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
  loadCurrencies();


  document.getElementById("converterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = document.getElementById("amount").value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    if (amount && !isNaN(amount)) {
      convert(amount, fromCurrency, toCurrency);
    } else {
      displayError("Veuillez entrer un montant valide");
    }
  });
});




class SearchHistory {
  saveToHistory(query) {
    let history = this.getHistoryFromStorage();

    const existingIndex = history.findIndex(item => item.query.toLowerCase() === query.toLowerCase());

    if (existingIndex > -1) {
      history[existingIndex].count++;
      history[existingIndex].lastSearched = new Date().toISOString();

      // Déplace l'élément mis à jour en début de liste
      const updatedItem = history.splice(existingIndex, 1)[0];
      history.unshift(updatedItem);
    } else {
      const newSearch = {
        query: query,
        count: 1,
        firstSearched: new Date().toISOString(),
        lastSearched: new Date().toISOString()
      };
      history.unshift(newSearch);
    }

    if (history.length > 100) {
      history = history.slice(0, 100);
    }

    localStorage.setItem('searchHistory', JSON.stringify(history));
  }

  getHistoryFromStorage() {
    const historyData = localStorage.getItem('searchHistory');
    return historyData ? JSON.parse(historyData) : [];
  }

  loadHistory() {
    const history = this.getHistoryFromStorage();
    const historyList = document.getElementById('historyList');

    if (history.length === 0) {
      historyList.innerHTML = '<div class="no-history">Aucun historique de recherche pour le moment.</div>';
      return;
    }

const historyHTML = history.map(item => {
  const lastSearched = new Date(item.lastSearched);
  const timeAgo = this.getTimeAgo(lastSearched);
  
  const displayQuery = item.query.replace(/\sto\s/, " = ");
  const dateFormatted = `Date : ${timeAgo}`;
  return `
    <div class="history-item" data-query="${item.query}">
      <span class="search-date">${dateFormatted} :</span>
      <span class="search-query">${displayQuery}</span>
      
    </div>
  `;
}).join('');


    historyList.innerHTML = historyHTML;
  }

  // Fonction utilitaire pour formater le "il y a" (simple)
getTimeAgo(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

}


// Sauvegarde une recherche et met à jour l'affichage de l'historique
function performSearch(query) {
  const sh = new SearchHistory();
  sh.saveToHistory(query);
  sh.loadHistory();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  const sh = new SearchHistory();
  sh.loadHistory();


});
