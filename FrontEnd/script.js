// 1. Récupérer les works
async function apiWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      console.warn(
        `Une erreure est survenue lors de la récupération des travaux. Status: ${response.status}`,
        JSON.stringify(response, null, 2),
      );
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error(
      "une erreure est survenue lors de la récupération des travaux ",
      JSON.stringify(error, null, 2),
    );
    return [];
  }
}

// 2. Récupérer les catégories
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

// 3. Supprimer un work
async function deleteWork(id) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la suppression (status: ${response.status})`,
      );
    }

    console.log("Projet supprimé");
    return true;
  } catch (error) {
    console.error("Erreur deleteWork :", error);
    return false;
  }
}

// 4. Charger les catégories dans le <select>
async function loadCategories() {
  try {
    const categories = await apiCategories();
    const select = document.getElementById("category");

    if (!select) {
      console.error("Impossible de trouver l'élément #category");
      return;
    }

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
  }
}

const fileInput = document.getElementById("image");
const preview = document.getElementById("image-preview");
const labelBtn = document.getElementById("label-btn");
const imageInfo = document.getElementById("image-info");

// Ouvrir le sélecteur de fichier en cliquant sur l'image
preview.addEventListener("click", () => {
  fileInput.click();
});
// Ouvrir le selecteur de fichier en cliquant sur label
labelBtn.addEventListener("click", () => {
  fileInput.click();
});

// mettre à jour l'image quand un fichier est choisi
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.classList.remove("hidden");

    // cacher le bouton + le texte
    labelBtn.style.display = "none";
    imageInfo.style.display = "none";
    checkFormValidity();
  };
  reader.readAsDataURL(file);
});

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

  if (!category || !title || fileInput.files.length === 0) {
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
    resetModal();
    // rafraîchir
    refreshGallery();
  } else {
    alert("Erreur lors de l'ajout.");
  }
  const result = await response.json();
  console.log(result);
}

function checkFormValidity() {
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const fileInput = document.getElementById("image");
  const validateBtn = document.getElementById("modalBtn");

  const file = fileInput.files[0];

  // Vérification extension via le nom du fichier
  let validExtension = false;
  if (file) {
    const fileName = file.name.toLowerCase();
    validExtension =
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png");
  }

  const isValid = title.length > 0 && category !== "" && file && validExtension;

  if (isValid) {
    validateBtn.classList.add("valid");
    validateBtn.disabled = false;
  } else {
    validateBtn.classList.remove("valid");
    validateBtn.disabled = true;
  }
}

document.getElementById("title").addEventListener("input", checkFormValidity);
document
  .getElementById("category")
  .addEventListener("change", checkFormValidity);
document.getElementById("image").addEventListener("change", checkFormValidity);

async function refreshGallery() {
  const works = await apiWorks();

  displayWorks(works);
  displayModalWorks(works);
}

// Générer la galerie pricipale en dynamique et la galerie dans la modale
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

// gestion des catégories
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

// Ajout des filtrres
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

// Lancer l'affichage
async function init() {
  const works = await apiWorks();
  const categories = await apiCategories();
  displayWorks(works);
  setupFilters(works, categories);
}

// mode admin
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
  resetModal();
  modal.style.display = "flex";
  loadModalGallery(); // On charge les travaux dans la modale
});

// Fermer la modale
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
  resetModal();
});

// Fermer en cliquant en dehors
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    resetModal();
  }
});

function resetModal() {
  // 1. Revenir à la vue galerie
  modalFormView.classList.add("hidden");
  modalGalleryView.classList.remove("hidden");

  // 2. Réinitialiser le formulaire
  document.getElementById("modal-form").reset();

  // 3. Réinitialiser l’image preview
  const preview = document.getElementById("image-preview");
  preview.src = "./assets/icons/img.png"; // icône par défaut
  preview.classList.remove("hidden");

  // 4. Vider l’input file et réafficher img + btn
  const fileInput = document.getElementById("image");
  fileInput.value = "";
  labelBtn.style.display = "block";
  imageInfo.style.display = "block";
}

modalAddBtn.addEventListener("click", () => {
  modalGalleryView.classList.add("hidden");
  modalFormView.classList.remove("hidden");
});

modalBack.addEventListener("click", () => {
  modalFormView.classList.add("hidden");
  modalGalleryView.classList.remove("hidden");
});

window.addEventListener("DOMContentLoaded", init);
