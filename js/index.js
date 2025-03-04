// Modals 
let modalInscription = document.getElementById("modal-inscription");
let modalConnexion = document.getElementById("modal-connexion");
let btnInscription = document.getElementById("btn-inscription");
let btnConnexion = document.getElementById("btn-connexion");
let closeInscription = document.getElementById("close-inscription");
let closeConnexion = document.getElementById("close-connexion");

// Récupérer les éléments de formulaire
let formInscription = document.querySelector('#modal-inscription form');
let formConnexion = document.querySelector('#modal-connexion form');

// Récupérer le profil dans la navbar
let profileSection = document.getElementById('profile-section');

// Récupérer les boutons connexion / déconnexion dans la navbar
let btnLogin = document.getElementById('btn-connexion');
let btnLogout = document.getElementById('btn-logout');

// Fonction pour vérifier si l'email ou le login existe déjà
function checkIfUserExists(login, email) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.login === login || user.email === email);
}

// Fonction pour enregistrer un utilisateur
function registerUser(username, email, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ login: username, email: email, password: password });
    localStorage.setItem('users', JSON.stringify(users));
}

// Fonction pour connecter l'utilisateur
function loginUser(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.login === username && user.password === password);
}

// Affichage du profil si l'utilisateur est connecté
function showUserProfile(user) {
    if(user) {// Etat connecté
        profileSection.innerHTML = `
        <span style="color: green;">•</span> ${user.login} (Connecté)
    `;              
    } else {
        profileSelection.innerHTML = ""; // Etat déconnecté 
    }
}

// Fonction pour vérifier la connexion de l'utilisateur
function checkUserConnection() {
    let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    if (connectedUser) {
        btnLogin.style.display = 'none'; // Masquer le bouton de connexion
        btnLogout.style.display = 'inline-block'; // Afficher le bouton de déconnexion
        showUserProfile(connectedUser); // Afficher le profil
    } else {
        btnLogin.style.display = 'inline-block'; // Afficher le bouton de connexion
        btnLogout.style.display = 'none'; // Masquer le bouton de déconnexion
    }
    showUserProfile(connectedUser);
    
}

// Fermer les modals si on clique en dehors de la zone du modal
window.onclick = function(event) {
    if (event.target == modalInscription) {
        modalInscription.style.display = "none";
    }
    if (event.target == modalConnexion) {
        modalConnexion.style.display = "none";
    }
}

// Ouvrir le modal d'inscription
btnInscription.onclick = function() {
    modalInscription.style.display = "block";
}

// Ouvrir le modal de connexion
btnConnexion.onclick = function() {
    modalConnexion.style.display = "block";
}

// Fermer le modal d'inscription
closeInscription.onclick = function() {
    modalInscription.style.display = "none";
}

// Fermer le modal de connexion
closeConnexion.onclick = function() {
    modalConnexion.style.display = "none";
}

// Gestion de l'inscription
formInscription.onsubmit = function(event) {
    event.preventDefault();

    let username = formInscription.username.value;
    let email = formInscription.email.value;
    let password = formInscription.password.value;

    if (!isValidUsername(username)) {
        showMessage("Le login doit contenir au moins 3 caractères.");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage("Veuillez entrer un email valide.");
        return;
    }

    checkPasswordStrength(password); // Vérifie la force du mot de passe
    if (passwordStrengthText.textContent === "Faible") {
        showMessage("Le mot de passe doit être plus fort.");
        return;
    }

    if (checkIfUserExists(username, email)) {
        showMessage("Le login ou l'email est déjà utilisé.");
    } else {
        registerUser(username, email, password);
        showMessage("Inscription réussie !");
        modalInscription.style.display = "none";
    }
}

// Gestion de la connexion
formConnexion.onsubmit = function(event) {
    event.preventDefault();

    let username = formConnexion.login.value;
    let password = formConnexion['password-login'].value;

    let user = loginUser(username, password);

    if (user) {
        localStorage.setItem('connectedUser', JSON.stringify(user));
        showMessage("Connexion réussie !");
        modalConnexion.style.display = "none";
        checkUserConnection(); // Met à jour l'affichage des boutons
    } else {
        showMessage("Login ou mot de passe incorrect.");
    }
}

// Déconnexion de l'utilisateur
btnLogout.onclick = function() {
    localStorage.removeItem('connectedUser');
    showMessage("Vous êtes déconnecté.");
    checkUserConnection(); // Met à jour l'affichage des boutons
}

// Fonction pour afficher un message temporaire (2000ms)
function showMessage(message) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = message;

    // Ajouter le message à la navbar ou au body
    document.body.appendChild(messageDiv);

    // Après 2000ms, on le retire
    setTimeout(() => {
        messageDiv.remove();
    }, 2000);
}

// Vérifier si un utilisateur est connecté et mettre à jour l'affichage des boutons et du profil
window.onload = function() {
    let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));

    if (connectedUser) {
        showUserProfile(connectedUser);  // Affiche le profil de l'utilisateur
        checkUserConnection();  // Met à jour l'affichage des boutons
    } else {
        checkUserConnection();  // Met à jour l'affichage des boutons si l'utilisateur n'est pas connecté
    }
}

// Ajouter un style CSS pour les messages temporaires
const style = document.createElement('style');
style.innerHTML = `
    .message {
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4CAF50;
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }
`;
document.head.appendChild(style);

// Appliquer le même style CSS au bouton de déconnexion que celui du bouton de connexion
btnLogout.classList.add("btn", "btn-connexion");
