// Constante 'apiUser' pour stocker URL de l'API du serveur où la requete de connexion va être envoyée.
const apiUser = "http://localhost:5678/api/users/login";

const logForm = document.querySelector("#login form");

logForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const response = await fetch(apiUser, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  console.log(response);

  if (response.status === 404) {
    alert("L'utilisateur n'est pas reconnu");
  }
  if (response.status === 401) {
    alert("Mot de passe incorrect");
  }
  if (response.status === 200) {
    const responseData = await response.json();
    const token = responseData.token;
    localStorage.setItem("token", token);
    window.location = "index.html";
  }
});
