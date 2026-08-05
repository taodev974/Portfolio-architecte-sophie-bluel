// Chemin
const API_URL = "http://localhost:5678/api";

async function apiUsersLogin(email, password) {
  // Ctrl avant l'appel API
  if (!email.trim() || !password.trim()) {
    showModal(
      "Veuillez entrer un email et un mot de passe pour vous connectez !",
    );
    return null;
  }
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("STATUS =", response.status);

    if (!response.ok) {
      showModal("Identifiant ou mot de pass incorrect !");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erreure lors de la connexion :", error);
    return null;
  }
}

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault(); // empêche le submit classique

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }

  if (!passwordInput.checkValidity()) {
    passwordInput.reportValidity();
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const data = await apiUsersLogin(email, password);

  if (!data) {
    return;
  }

  // Stocker le token pour le mode admin
  localStorage.setItem("token", data.token);

  // Redirection vers index.html
  window.location.href = "index.html";
});

// Modale message
function showModal(message) {
  document.getElementById("modal-text").textContent = message;
  document.getElementById("modal-msg").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal-msg").classList.add("hidden");
}

document
  .getElementById("close-modal-msg")
  .addEventListener("click", closeModal);
