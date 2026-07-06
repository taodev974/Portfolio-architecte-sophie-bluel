// 1. Récupérer les works / catégorie
async function apiWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      console.warn(
        `Une erreure est survenue lors de la récupération des travaux. Status: ${response.status}`,
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

// 2. Générer la galerie pricipale en dynamique et la galerie dans la modale
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

function displayModalWorks(works) {
  const gallery = document.getElementById("modal-gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    figure.appendChild(img);

    gallery.appendChild(figure);
  });
}
async function loadModalGallery() {
  const works = await apiWorks();
  displayModalWorks(works);
}

// 3. gestion des catégories
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

// 4. Ajout des filtrres
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

// 4. Lancer l'affichage
async function init() {
  const works = await apiWorks();
  console.log(works);
  const categories = await apiCategories();
  displayWorks(works);
  setupFilters(works, categories);
}

// 5. mode admin
const token = localStorage.getItem("token");

if (token) {
  // Afficher le bandeau
  document.getElementById("admin-banner").style.display = "block";
  // Transformer login → logout
  const loginLink = document.getElementById("login-link");
  loginLink.textContent = "logout";
  loginLink.href = "#";

  loginLink.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });
  document.getElementById("edit-gallery").style.display = "inline-block";
  document.getElementById("filters").style.display = "none";
}

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
const modalAddBtn = document.getElementById("modal-add-btn");
const modalBack = document.getElementById("modal-back");

const modalGalleryView = document.getElementById("modal-gallery-view");
const modalFormView = document.getElementById("modal-form-view");

// Ouvrir la modale
document.getElementById("edit-gallery").addEventListener("click", () => {
  modal.style.display = "flex";
  loadModalGallery(); // On charge les travaux dans la modale
});

// Fermer la modale
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fermer en cliquant en dehors
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

modalAddBtn.addEventListener("click", () => {
  modalGalleryView.classList.add("hidden");
  modalFormView.classList.remove("hidden");
});

modalBack.addEventListener("click", () => {
  modalFormView.classList.add("hidden");
  modalGalleryView.classList.remove("hidden");
});

window.addEventListener("DOMContentLoaded", init);
