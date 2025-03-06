// Sélection des éléments du DOM pour la gestion du modal de connexion
let modalConnexion = document.getElementById("modal-connexion");
let btnConnexion = document.getElementById("btn-connexion");
let closeConnexion = document.getElementById("close-connexion");
let formConnexion = document.querySelector('#modal-connexion form');

// Gestion de la soumission du formulaire de connexion
formConnexion.onsubmit = function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    let username = formConnexion.login.value;
    let password = formConnexion['password-login'].value;

    let user = loginUser(username, password); // Vérifie les informations de connexion

    if (user) {
        localStorage.setItem('connectedUser', JSON.stringify(user)); // Stocke l'utilisateur connecté
        showMessage("Connexion réussie !");
        modalConnexion.style.display = "none"; // Ferme le modal
        updateUserInterface(); // Met à jour l'affichage
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

// Fonction pour vérifier la connexion d'un utilisateur
function loginUser(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    let user = users.find(user => user.login === username);

    if (user) {
        // Déchiffrer le mot de passe stocké
        let decryptedPassword = CryptoJS.AES.decrypt(user.password, 'secret-key').toString(CryptoJS.enc.Utf8);

        if (decryptedPassword === password) {
            return user; // Retourne l'objet utilisateur si l'authentification réussit
        }
    }
    return null; // Retourne null si l'utilisateur n'existe pas ou si le mot de passe est incorrect
}

// Mettre à jour l'affichage de l'interface utilisateur après connexion/déconnexion
function updateUserInterface() {
    let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    let profileSection = document.getElementById('profile-section');
    let navbarUser = document.getElementById('navbar-user'); // Élément de la navbar pour afficher le nom
    let btnConnexion = document.getElementById('btn-connexion');
    let btnLogout = document.getElementById('btn-logout');

    if (connectedUser && typeof connectedUser === "object" && connectedUser.login) {
        if (profileSection) {
            profileSection.textContent = `${connectedUser.login} (Connecté)`;
        }
        if (navbarUser) {
            navbarUser.textContent = `Bienvenue, ${connectedUser.login}`;
        }
        btnConnexion.style.display = 'none';
        btnLogout.style.display = 'inline-block';
    } else {
        if (profileSection) {
            profileSection.textContent = '';
        }
        if (navbarUser) {
            navbarUser.textContent = ''; // Réinitialiser la navbar
        }
        btnConnexion.style.display = 'inline-block';
        btnLogout.style.display = 'none';
    }
}

// Déconnexion de l'utilisateur
document.getElementById('btn-logout').onclick = function() {
    localStorage.removeItem('connectedUser'); // Supprime l'utilisateur connecté
    showMessage("Vous êtes déconnecté.");
    updateUserInterface(); // Met à jour l'interface après la déconnexion
}

// Vérifier si l'utilisateur est déjà connecté au chargement de la page
window.onload = function() {
    updateUserInterface();
}
