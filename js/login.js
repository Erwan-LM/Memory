// Modal Connexion
let modalConnexion = document.getElementById("modal-connexion");
let btnConnexion = document.getElementById("btn-connexion");
let closeConnexion = document.getElementById("close-connexion");
let formConnexion = document.querySelector('#modal-connexion form');

// Fonction pour gérer la connexion
formConnexion.onsubmit = function(event) {
    event.preventDefault();

    let username = formConnexion.login.value;
    let password = formConnexion['password-login'].value;

    let user = loginUser(username, password);

    if (user) {
        localStorage.setItem('connectedUser', JSON.stringify(user));
        showMessage("Connexion réussie !");
        modalConnexion.style.display = "none";
        checkUserConnection();
    } else {
        showMessage("Login ou mot de passe incorrect.");
    }
}

// Fonction pour afficher un message temporaire
function showMessage(message) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 2000);
}

// Ouvrir le modal de connexion
btnConnexion.onclick = function() {
    modalConnexion.style.display = "block";
}

// Fermer le modal si on clique en dehors de la zone du modal
window.onclick = function(event) {
    if (event.target == modalConnexion) {
        modalConnexion.style.display = "none";
    }
}

// Fonction pour récupérer l'utilisateur
function loginUser(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.login === username && user.password === password);
}

// Vérifier la connexion utilisateur au chargement de la page
function checkUserConnection() {
    let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    if (connectedUser) {
        // Mettre à jour le profil utilisateur et afficher le bouton de déconnexion
        document.getElementById('profile-section').innerHTML = `${connectedUser.login} (Connecté)`;
        document.getElementById('btn-connexion').style.display = 'none';
        document.getElementById('btn-logout').style.display = 'inline-block';
    } else {
        document.getElementById('profile-section').innerHTML = '';
        document.getElementById('btn-connexion').style.display = 'inline-block';
        document.getElementById('btn-logout').style.display = 'none';
    }
}

// Déconnexion
document.getElementById('btn-logout').onclick = function() {
    localStorage.removeItem('connectedUser');
    showMessage("Vous êtes déconnecté.");
    checkUserConnection();
}

// Vérifier si l'utilisateur est déjà connecté au chargement
window.onload = function() {
    checkUserConnection();
}
