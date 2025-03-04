// Importation du fichier inscription.js et login.js
import './inscription.js';
import './login.js';

// Profil utilisateur
let profileSection = document.getElementById('profile-section');
let btnLogin = document.getElementById('btn-connexion');
let btnLogout = document.getElementById('btn-logout');

// Vérification de la connexion de l'utilisateur
function checkUserConnection() {
    let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    if (connectedUser) {
        btnLogin.style.display = 'none'; // Masquer le bouton connexion
        btnLogout.style.display = 'inline-block'; // Afficher déconnexion
        showUserProfile(connectedUser);
    } else {
        btnLogin.style.display = 'inline-block'; 
        btnLogout.style.display = 'none';
        showUserProfile(null);
    }
}

// Affichage du profil si l'utilisateur est connecté
function showUserProfile(user) {
    if (user) { 
        profileSection.innerHTML = `<span style="color: green;">•</span> ${user.login} (Connecté)`;
    } else {
        profileSection.innerHTML = ""; // Déconnexion
    }
}

// Vérifier si un utilisateur est connecté au chargement
window.onload = function() {
    checkUserConnection();
}
