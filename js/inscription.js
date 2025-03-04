// Modals
let modalInscription = document.getElementById("modal-inscription");
let btnInscription = document.getElementById("btn-inscription");
let closeInscription = document.getElementById("close-inscription");
let formInscription = document.querySelector('#modal-inscription form');

// Champs et icônes
let usernameInput = formInscription.username;
let emailInput = formInscription.email;
let passwordInput = formInscription.password;
let confirmPasswordInput = formInscription['confirm-password'];

// Icônes d'erreur et de succès
let usernameErrorIcon = document.getElementById('username-error-icon');
let emailErrorIcon = document.getElementById('email-error-icon');
let passwordErrorIcon = document.getElementById('password-error-icon');
let usernameSuccessIcon = document.getElementById('username-success-icon');
let emailSuccessIcon = document.getElementById('email-success-icon');
let passwordSuccessIcon = document.getElementById('password-success-icon');
let confirmPasswordErrorIcon = document.getElementById('confirm-password-error-icon');
let confirmPasswordSuccessIcon = document.getElementById('confirm-password-success-icon');

// Récupérer le bouton de fermeture
let closeModalBtn = document.getElementById("close-modal-btn");
// Fonction pour fermer le modal
function closeModal() {
    modalInscription.style.display = "none";
}

// Lorsqu'on clique sur le bouton de fermeture (le "Fermer")
closeModalBtn.addEventListener("click", closeModal);

// Fermer le modal si on clique en dehors de la zone du modal
window.addEventListener("click", function(event) {
    if (event.target == modalInscription) {
        closeModal();
    }
});

// Ouvrir le modal d'inscription
btnInscription.onclick = function() {
    modalInscription.style.display = "block";
}

// Fermer le modal si on clique sur la croix
closeInscription.onclick = function() {
    closeModal();
}

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

// Vérification de la validité de l'email
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// Vérification du mot de passe avec le nouveau regex
function isValidPassword(password) {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return passwordRegex.test(password);
}

// Vérification des critères du login
function isValidUsername(username) {
    return username.length >= 3;
}

// Vérification des critères de confirmation de mot de passe
function isPasswordMatching(password, confirmPassword) {
    return password === confirmPassword;
}

// Mise à jour des icônes et messages de validation
function updateValidation(input, isValid, errorMessageElement, iconElement, message) {
    if (isValid) {
        errorMessageElement.style.display = "none";
        iconElement.src = "ressources/check.svg";
        iconElement.style.display = "inline-block";
    } else {
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = "block";
        iconElement.src = "ressources/error.svg";
        iconElement.style.display = "inline-block";
    }
}

// Gestion dynamique des erreurs en temps réel
usernameInput.addEventListener('input', () => {
    updateValidation(usernameInput, isValidUsername(usernameInput.value), document.getElementById('username-error'), usernameErrorIcon, "Le login doit contenir au moins 3 caractères.");
});

emailInput.addEventListener('input', () => {
    updateValidation(emailInput, isValidEmail(emailInput.value), document.getElementById('email-error'), emailErrorIcon, "Veuillez entrer un email valide.");
});

passwordInput.addEventListener('input', () => {
    updateValidation(passwordInput, isValidPassword(passwordInput.value), document.getElementById('password-error'), passwordErrorIcon, "Le mot de passe doit contenir au moins 8 caractères, avec 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.");
});

confirmPasswordInput.addEventListener('input', () => {
    updateValidation(confirmPasswordInput, isPasswordMatching(passwordInput.value, confirmPasswordInput.value), document.getElementById('confirm-password-error'), confirmPasswordErrorIcon, "Les mots de passe ne correspondent pas.");
});

// Gestion de l'inscription
formInscription.onsubmit = function(event) {
    event.preventDefault();

    let username = usernameInput.value;
    let email = emailInput.value;
    let password = passwordInput.value;
    let confirmPassword = confirmPasswordInput.value;
    let valid = true;

    if (!isValidUsername(username)) {
        updateValidation(usernameInput, false, document.getElementById('username-error'), usernameErrorIcon, "Le login doit contenir au moins 3 caractères.");
        valid = false;
    }

    if (!isValidEmail(email)) {
        updateValidation(emailInput, false, document.getElementById('email-error'), emailErrorIcon, "Veuillez entrer un email valide.");
        valid = false;
    }

    if (!isValidPassword(password)) {
        updateValidation(passwordInput, false, document.getElementById('password-error'), passwordErrorIcon, "Le mot de passe doit contenir au moins 8 caractères, avec 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.");
        valid = false;
    }

    if (!isPasswordMatching(password, confirmPassword)) {
        updateValidation(confirmPasswordInput, false, document.getElementById('confirm-password-error'), confirmPasswordErrorIcon, "Les mots de passe ne correspondent pas.");
        valid = false;
    }

    if (!valid) return;

    if (checkIfUserExists(username, email)) {
        showMessage("Le login ou l'email est déjà utilisé.");
    } else {
        registerUser(username, email, password);
        showMessage("Inscription réussie !");
        modalInscription.style.display = "none";
    }
};

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

// Création de la fonction pour évaluer la force du mot de passe
function evaluatePasswordStrength(password) {
    let strength = 0;

    // Critères de complexité du mot de passe
    const lengthRegex = /.{8,}/; // Min 8 caractères
    const lowercaseRegex = /[a-z]/; // Au moins une minuscule
    const uppercaseRegex = /[A-Z]/; // Au moins une majuscule
    const digitRegex = /[0-9]/; // Au moins un chiffre
    const specialCharRegex = /[#?!@$%^&*-]/; // Au moins un caractère spécial

    if (lengthRegex.test(password)) strength++;
    if (lowercaseRegex.test(password)) strength++;
    if (uppercaseRegex.test(password)) strength++;
    if (digitRegex.test(password)) strength++;
    if (specialCharRegex.test(password)) strength++;

    return strength;
}

// Fonction pour mettre à jour la barre de progression du mot de passe
function updatePasswordStrengthBar(password) {
    const strength = evaluatePasswordStrength(password);
    const strengthBar = document.getElementById('password-strength-bar'); // Barre de progression
    const strengthText = document.getElementById('password-strength-text'); // Texte de complexité

    let strengthClass = '';
    let width = 0;

    if (strength === 1) {
        width = 25;
        strengthClass = 'weak';
        strengthText.textContent = 'Complexité : Faible';
    } else if (strength === 2) {
        width = 50;
        strengthClass = 'medium';
        strengthText.textContent = 'Complexité : Moyenne';
    } else if (strength >= 3) {
        width = 100;
        strengthClass = 'strong';
        strengthText.textContent = 'Complexité : Forte';
    }

    // Mise à jour de la barre de progression
    strengthBar.style.width = `${width}%`;
    strengthBar.className = `strength-bar ${strengthClass}`;
}

// Ajout d'un écouteur pour vérifier la force du mot de passe pendant la saisie
passwordInput.addEventListener('input', () => {
    updateValidation(passwordInput, isValidPassword(passwordInput.value), document.getElementById('password-error'), passwordErrorIcon, "Le mot de passe doit contenir au moins 8 caractères, avec 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.");
    updatePasswordStrengthBar(passwordInput.value); // Mise à jour de la barre de force
});

// Ajouter du style CSS pour les messages
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
