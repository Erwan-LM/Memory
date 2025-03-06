if (document.getElementById("modal-inscription")) {
    import('./inscription.js');
}

if (document.getElementById("modal-connexion")) { 
    import('./login.js');
}

// Profil utilisateur
let profileSection = document.getElementById('profil-section');
let btnLogin = document.getElementById('btn-connexion');
let btnLogout = document.getElementById('btn-logout');
let btnInscription = document.getElementById('btn-inscription');

// Fonction de déconnexion
function logoutUser() {
    // Retirer l'utilisateur de localStorage
    localStorage.removeItem('connectedUser');
    // Mise à jour de l'interface après déconnexion
    checkUserConnection();
}

// Vérification de la connexion de l'utilisateur
function checkUserConnection() {
    let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    if (connectedUser) {
        btnLogin.style.display = 'none'; // Masquer le bouton connexion
        btnLogout.style.display = 'inline-block'; // Afficher le bouton déconnexion
        btnInscription.style.display = 'none';
        showUserProfile(connectedUser);
    } else {
        btnLogin.style.display = 'inline-block'; 
        btnLogout.style.display = 'none';
        btnInscription.style.display = 'inline-block';
        showUserProfile(null);
    }
}

// Affichage du profil si l'utilisateur est connecté
function showUserProfile(user) {
    if (user) { 
        profileSection.innerHTML = `<span style="color: green;">•</span> ${user.login} (Connecté)`;
    } else {
        profileSection.innerHTML = ""; // Afficher rien si déconnecté
    }
}

// Vérifier si un utilisateur est connecté au chargement
window.onload = function() {
    checkUserConnection();
};

// Ajouter un écouteur d'événements pour détecter les changements dans localStorage
window.addEventListener('storage', function(event) {
    if (event.key === 'connectedUser') {
        // Si l'utilisateur change dans localStorage, on met à jour l'interface
        checkUserConnection();
    }
});

// Event listener pour le bouton de déconnexion
btnLogout.addEventListener('click', function() {
    logoutUser();
});
