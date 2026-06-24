// 1. Récupérer les works API
async function apiWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

//

// 2. Générer la galerie en dynamique
function displayWorks(works) {
  const gallery = document.getElementById("galleryDynamic");
  gallery.innerHTML = ""; // Nettoyer avant d'ajouter

  works.forEach((work) => {
    // Création des éléments
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    // Remplissage
    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    // Assemblage
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
  //   console.log("works reçus :", works);
  //   console.log("gallery :", galleryDynamic);
}

// 3. Ajout des filtrres
function setupFilters(works) {
  const filtersContainer = document.getElementById("filters");

  // bouton "Tous"
  const btnAll = document.createElement("button");
  btnAll.textContent = "Tous";
  btnAll.addEventListener("click", () => displayWorks(works));
  filtersContainer.appendChild(btnAll);

  // bouton "Objets"
  const btnObject = document.createElement("button");
  btnObject.textContent = "Objets";
  btnObject.addEventListener("click", () => {
    const filtered = works.filter((w) => w.categoryId === 1);
    displayWorks(filtered);
  });
  filtersContainer.appendChild(btnObject);

  // bouton appartements
  const btnApartment = document.createElement("button");
  btnApartment.textContent = "Appartements";
  btnApartment.addEventListener("click", () => {
    const filtered = works.filter((w) => w.categoryId === 2);
    displayWorks(filtered);
  });
  filtersContainer.appendChild(btnApartment);

  // bouton hotels & restaurants
  const btnHotelsAndRestautant = document.createElement("button");
  btnHotelsAndRestautant.textContent = "Hotels & restaurents";
  btnHotelsAndRestautant.addEventListener("click", () => {
    const filtered = works.filter((w) => w.categoryId === 3);
    displayWorks(filtered);
  });
  filtersContainer.appendChild(btnHotelsAndRestautant);

  // gestion bouton activé
  const buttons = filtersContainer.querySelectorAll("button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 1. Retirer la classe active de tous les boutons
      buttons.forEach((b) => b.classList.remove("active"));

      // 2. Ajouter la classe active au bouton cliqué
      btn.classList.add("active");
    });
  });
}

// 4. Lancer l'affichage
async function init() {
  const works = await apiWorks();
  displayWorks(works);
  setupFilters(works);
}

init();
