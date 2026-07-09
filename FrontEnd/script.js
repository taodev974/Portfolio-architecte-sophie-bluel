// 1. Récupérer les works / catégorie / delete / Ajout / refresh
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

async function deleteWork(id) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    console.log("Projet supprimé");
  } catch (error) {
    console.error(error);
  }
}

// Charger les catégories
async function loadCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();

  const select = document.getElementById("category");

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

// Fonction déclenchée quand on change la catégorie
function onCategoryChange(event) {
  const selectedId = event.target.value;
  console.log("Catégorie choisie :", selectedId);
}
// Ecouter le changement
document
  .getElementById("category")
  .addEventListener("change", onCategoryChange);
// Cahrger les catégories
loadCategories();

// Valider le formulaire
document
  .getElementById("modal-form")
  .addEventListener("submit", validateFormModal);

async function validateFormModal(e) {
  e.preventDefault();

  const category = document.getElementById("category").value;
  const title = document.getElementById("title").value.trim();
  const fileInput = document.getElementById("image");

  if (!category || !title) {
    alert("Veuillez remplir tous les champs.");
    return;
  }
  // construction du FormData
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", fileInput.files[0]);

  // Envoi à l'API
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (response.ok) {
    alert("Projet ajouté !");
    // fermeture modale
    modal.style.display = "none";
    // rafraîchir
    refreshGallery();
  } else {
    alert("Erreur lors de l'ajout.");
  }
  const result = await response.json();
  console.log(result);
}

async function refreshGallery() {
  const works = await apiWorks();

  displayWorks(works);
  displayModalWorks(works);
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

    // Création de l'icône corbeille
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.dataset.id = work.id;

    deleteBtn.addEventListener("click", async () => {
      // console.log(deleteBtn.dataset.id);
      await deleteWork(work.id);
      await refreshGallery();
    });

    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");

    deleteBtn.appendChild(trash);

    figure.appendChild(img);
    figure.appendChild(deleteBtn);

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
  // console.log(works);
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
