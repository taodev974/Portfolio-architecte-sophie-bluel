async function apiUsersLogin(email, password) {
  // Ctrl avant l'appel API
  if (!email.trim() || !password.trim()) {
    showModal(
      "Veuillez entrer un email et un mot de passe pour vous connectez !",
    );
    return null;
  }
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("STATUS =", response.status);

    if (!response.ok) {
      // console.warn(
      //   `Identifiant incorrecte ou erreur serveur, Status: ${response.status}`,
      // );
      showModal(
        "Identifiants incorrecte! Veuillez entrer un email et mot de passe valide pour vous connectez!",
      );
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

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const data = await apiUsersLogin(email, password);

  if (!data) {
    return;
  }

  // Stocker le token pour le mode admin
  localStorage.setItem("token", data.token);

  // Redirection vers index.html
  window.location.href = "index.html";
});

// Modale de connexion
function showModal(message) {
  document.getElementById("modal-text").textContent = message;
  document.getElementById("modal-conect").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal-conect").classList.add("hidden");
}
