// 0. Bandeau
const token = localStorage.getItem("token");

if (token) {
  document.getElementById("admin-banner").style.display = "block";

  // Transformer login → logout
  const loginLink = document.getElementById("login-link");
  loginLink.textContent = "logout";
  loginLink.href = "#";

  loginLink.addEventListener("click", () => {
    // Supprimer le token
    localStorage.removeItem("token");

    // Cacher le bouton modifier
    document.getElementById("edit-gallery").style.display = "none";

    window.location.href = "index.html";
  });

  // Cacher les filtres
  const removefilters = document.getElementById("filters");
  removefilters.classList.add("hidden");

  // Afficher Bouton Modifier
  document.getElementById("edit-gallery").style.display = "inline-block";
}

// 1. Récupérer les works API
async function apiWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      console.warn(
        "Une erreure est survenue lors de la récupération des travaux. Status: ${response.status}",
        JSON.stringify(response, null, 2),
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "une erreure est survenue lors de la récupération des travaux ",
      JSON.stringify(error, null, 2),
    );
  }
}
// 2. Récuperer les catégories API
async function apiCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");

    if (!response.ok) {
      console.warn(
        `Erreur lors de la récupération des catégories. Status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la récupération des catégories",
      error,
    );
  }
}
// 3. Générer la galerie en dynamique
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
}

// 4. gestion des catégories
function createFilterBtn(category, works) {
  const btn = document.createElement("button");
  btn.classList.add("filter-btn");
  btn.textContent = category.name;
  btn.addEventListener("click", () => {
    const filtered = works.filter((w) => w.categoryId === category.id);
    displayWorks(filtered);
  });
  return btn;
}

// 5. Ajout des filtrres
function setupFilters(works, categories) {
  const filtersContainer = document.getElementById("filters");

  // bouton
  const btnAll = document.createElement("button");
  btnAll.classList.add("filter-btn", "active");
  btnAll.textContent = "Tous";
  btnAll.addEventListener("click", () => displayWorks(works));
  filtersContainer.appendChild(btnAll);

  categories.forEach((category) => {
    const btn = createFilterBtn(category, works);
    filtersContainer.appendChild(btn);
  });

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

// 6. Lancer l'affichage
async function init() {
  const works = await apiWorks();
  const categories = await apiCategories();

  displayWorks(works);
  // Ne créer les filtres que si on est pas en mode admin
  if (!token) {
    setupFilters(works, categories);
  }
}
window.addEventListener("DOMContentLoaded", init);
