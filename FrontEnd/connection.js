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
        "Identifiant incorrecte ou erreur serveur, Status: ${response.status}",
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erreure lors de la connexion :", error);
    return null;
  }
}
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = await apiUsersLogin(email, password);

  if (!data) {
    alert("Erreur : email ou mot de passe incorrect");
    return;
  }

  // Stocker le token
  localStorage.setItem("token", data.token);

  // Redirection vers l’index
  window.location.href = "index.html";
});
