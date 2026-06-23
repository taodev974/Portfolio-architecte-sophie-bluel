// 1. Récupérer les works API
async function apiWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

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
}

// 3. Lancer l'affichage
async function init() {
  const works = await apiWorks();
  displayWorks(works);
}

init();
