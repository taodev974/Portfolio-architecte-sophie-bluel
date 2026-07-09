async function apiUsersLogin(email, password) {
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
      console.warn(
        `Identifiant incorrecte ou erreur serveur, Status: ${response.status}`,
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

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      alert("Identifiants incorrects");
      return;
    }

    const data = await response.json();

    // Stocker le token pour le mode admin
    localStorage.setItem("token", data.token);

    // Redirection vers index.html
    window.location.href = "index.html";
  } catch (error) {
    console.error("Erreur :", error);
  }
});
