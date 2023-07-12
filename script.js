const API_KEY = "d8709e02715a408b880ba8c39d07031d";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("France"));

function reload() {
    window.location.reload();
}

async function fetchNews(query, sortByDate = false, sortByRelevancy = false, sortByPopularity = false) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    data.articles.sort((a, b) => {
      if (sortByDate) {
        // sort by date published
        if (new Date(b.publishedAt) - new Date(a.publishedAt) !== 0) {
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        }
      }
      if (sortByRelevancy) {
        // sort by relevancy to search keyword
        if (b.title.toLowerCase().includes(query.toLowerCase()) && !a.title.toLowerCase().includes(query.toLowerCase())) {
          return 1;
        } else if (!b.title.toLowerCase().includes(query.toLowerCase()) && a.title.toLowerCase().includes(query.toLowerCase())) {
          return -1;
        }
      }
      if (sortByPopularity) {
        // sort by popularity of source
        return b.source.totalResults - a.source.totalResults;
      }
      // default sort by date published
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
    bindData(data.articles);
  }

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");
    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if(!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Europe/Paris"
    });

    newsSource.innerHTML = `${article.source.name} . ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    })
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
