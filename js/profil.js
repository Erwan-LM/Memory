// Récupére le nom et l'affiche

document.addEventListener("DOMContentLoaded", function () {
    let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));

    if (connectedUser && connectedUser.login) {
        document.getElementById("user-name").textContent = connectedUser.login;
    } else {
        document.getElementById("user-name").textContent = "Utilisateur non connecté";
    }

// Sélection des éléments HTML
    const themeSelect = document.getElementById("theme");
    const sizeSelect = document.getElementById("size");
    const startGameBtn = document.getElementById("startGame");
    const themeImage = document.getElementById('theme-image');

// Ajouter un écouteur d'événement pour changer l'image lorsque le thème change
themeSelect.addEventListener('change', function() {
    const selectedTheme = themeSelect.value; // Valeur du thème sélectionné
    const imagePath = `ressources/${selectedTheme}/memory_detail`; // Le chemin vers l'image
    
    const fileExtension = '.png';
    const fullImagePath = imagePath + fileExtension;

    // Mettre à jour l'image
    themeImage.setAttribute('src', fullImagePath);
    themeImage.style.display = 'block'; // Afficher l'image
});

// Charger les paramètres enregistrés
    const saveSettings = JSON.parse(localStorage.getItem("gameSettings"));
    if (saveSettings) {
        themeSelect.value = saveSettings.theme || "food";
        sizeSelect.value = saveSettings.size || "4";
    }
    

// Sauvegarder les paramètres de l'utilisateur

function storeGameSettings() {
    const gameSettings = {
        theme: themeSelect.value,
        size: sizeSelect.value
    };
    localStorage.setItem("gameSettings", JSON.stringify(gameSettings));
}

themeSelect.addEventListener("change", storeGameSettings);
sizeSelect.addEventListener("change", storeGameSettings);



// Lancer le jeu avec les paramètres
    startGameBtn.addEventListener("click", function () {
    saveSettings;
    window.location.href = "game.html";


    });
});
