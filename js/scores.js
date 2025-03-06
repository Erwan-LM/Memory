document.addEventListener("DOMContentLoaded", function () {
    let gameTime = 60; // Temps de jeu en secondes
    let gameScore = 100; // Score initial
    let errors = 0; // Nombre d'erreurs
    let correctPairs = 0; // Nombre de paires correctes
    let timerInterval;
    let gameFinished = false;

    // Récupération des paramètres du jeu
    const gameSettings = JSON.parse(localStorage.getItem("gameSettings"));
    const gameSize = gameSettings ? gameSettings.size : "4"; // Taille du jeu (par défaut 4x4)
    const gameTheme = gameSettings ? gameSettings.theme : "food"; // Thème du jeu (par défaut "food")

    const resultElement = document.getElementById("result");
    const timerElement = document.getElementById("timer");
    const gameOverModal = document.getElementById("game-over-modal");
    const saveScoreBtn = document.getElementById("save-score");
    const closeModalBtn = document.getElementById("close-modal");

    // Fonction pour démarrer le timer
    function startTimer() {
        timerInterval = setInterval(function () {
            if (gameTime <= 0) {
                clearInterval(timerInterval);
                endGame("perdu");
            } else {
                gameTime--;
                timerElement.textContent = gameTime;
            }
        }, 1000);
    }

    // Fonction pour mettre à jour le score
    function updateScore() {
        let timePenalty = 100 - gameTime; // Pénalité de temps (1 point par seconde)
        gameScore = 100 + (correctPairs * 20) - (errors * 5) - timePenalty;
        resultElement.textContent = gameScore;
    }

    // Fonction pour enregistrer le score
    function saveScore() {
        const connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
        const userName = connectedUser ? connectedUser.login : "Inconnue";
        const scoreData = {
            pseudo: userName,
            score: gameScore,
            size: gameSize + "x" + gameSize,
            theme: gameTheme,
            date: new Date().toLocaleString()
        };

        // Récupérer les scores existants et ajouter le nouveau score
        let scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.push(scoreData);
        localStorage.setItem("scores", JSON.stringify(scores));
    }

    // Fonction pour terminer la partie
    function endGame(result) {
        gameFinished = true;
        clearInterval(timerInterval);
        const gameResult = result === "perdu" ? "Perdu" : "Gagné";
        document.getElementById("game-result").textContent = `Vous avez ${gameResult}.`;
        gameOverModal.style.display = "block";
    }

    // Fermer le popup
    closeModalBtn.addEventListener("click", function () {
        gameOverModal.style.display = "none";
    });

    // Enregistrer le score à la fin de la partie
    saveScoreBtn.addEventListener("click", function () {
        saveScore();
        gameOverModal.style.display = "none";
        // Rediriger vers la page d'accueil ou profil
        window.location.href = "index.html";
    });

    // Logique de jeu ici : création des cartes et gestion des événements
    function startGame() {
        // Créer et afficher les cartes Memory (dynamique en fonction du thème et de la taille)
        // Code à ajouter ici pour générer le jeu
        startTimer(); // Lancer le timer
    }

    // Appeler la fonction startGame pour démarrer le jeu
    startGame();
});
