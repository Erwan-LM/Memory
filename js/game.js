// Attendre que le contenu du DOM soit complètement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    
    // Charger les paramètres du jeu depuis localStorage, ou utiliser les valeurs par défaut
    const gameSettings = JSON.parse(localStorage.getItem("gameSettings")) || { theme: "legumes", size: "4" };
    
    // Définir les différents thèmes disponibles pour le jeu
    const themes = {
        legumes: generateTheme('legumes', 6, '.svg'),
        food: generateTheme('food', 6, '.png'),
        dinoName: generateTheme('dinoName', 10, '.jpg'),
        dino: generateTheme('dino', 10, '.jpg'),
        chiens: generateTheme('chiens', 23, '.webp'),
        animauxDom: generateTheme('animauxDom', 10, '.jpg'),
        animauxAnime: generateTheme('animauxAnimes', 8, '.webp'),
        animaux: generateTheme('animaux', 27, '.webp'),
        alphabet: generateTheme('alphabet', 26, '.png'),
    };
  
    // Fonction pour générer un tableau d'objets représentant les cartes d'un thème
    function generateTheme(theme, count, extension) {
        let basePath = `ressources/${theme}/`; // Chemin des images
        return Array.from({ length: count }, (_, i) => ({
            name: `${theme}${i + 1}`,
            img: `${basePath}${i + 1}${extension}`
        }));
    }
  
    // Calculer la taille du tableau de cartes en fonction des paramètres du jeu
    const gridSize = parseInt(gameSettings.size);
    const maxPairs = (gridSize * gridSize) / 2; // Nombre maximum de paires de cartes (1 carte pour chaque paire)
    
    // Créer le tableau de cartes à partir du thème sélectionné
    let cardArray = [...themes[gameSettings.theme]];
    cardArray = cardArray.slice(0, Math.min(maxPairs, cardArray.length)); // Limiter à la taille maximale des paires
    cardArray = [...cardArray, ...cardArray].sort(() => 0.5 - Math.random()); // Mélanger les cartes

    // Sélectionner le conteneur du jeu
    const grid = document.querySelector('.grid');
    
    // Déclarer les variables nécessaires pour gérer l'état du jeu
    let cardsChosen = [], cardsChosenId = [], cardsWon = [];
    let score = 100;
    let timeLeft = 60;
    let timerInterval;
    let gameStarted = false;
    let gameWon = false;  // Ajouté pour savoir si le jeu a été gagné
  
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
  
    // Fonction pour ajuster la taille de la grille selon le nombre de colonnes
    function setGridSize(size) {
        grid.style.gridTemplateColumns = `repeat(${size}, auto)`; // Modifier le style CSS pour la grille
    }
  
    // Fonction pour créer et afficher la grille de jeu avec des cartes
    function createBoard() {
        grid.innerHTML = ''; // Effacer la grille existante
        setGridSize(gameSettings.size); // Définir la taille de la grille
        cardArray.forEach((card, index) => {
            const cardElement = document.createElement('img'); // Créer un élément image pour chaque carte
            cardElement.setAttribute('src', 'ressources/back.png'); // Image arrière de la carte
            cardElement.setAttribute('data-id', index); // Attribuer un identifiant unique à chaque carte
            cardElement.addEventListener('click', flipCard); // Ajouter un événement au clic pour retourner la carte
            grid.appendChild(cardElement); // Ajouter l'image à la grille
        });
    }
  
    // Fonction pour démarrer le chronomètre lorsque le jeu commence
    function startTimer() {
        if (!gameStarted) { // Si le jeu n'a pas encore commencé
            gameStarted = true; // Marquer que le jeu a commencé
            timerInterval = setInterval(() => { // Démarrer l'intervalle du chronomètre
                timeLeft--; // Réduire le temps restant
                timerElement.textContent = `Temps: ${timeLeft}s`; // Mettre à jour l'affichage du temps
                if (timeLeft <= 0) { // Si le temps est écoulé
                    clearInterval(timerInterval); // Arrêter le chronomètre
                    showVictoryScreen(false); // Afficher l'écran de victoire (perdu)
                }
            }, 1000); // Mise à jour chaque seconde
        }
    }
  
    // Fonction qui gère le retournement des cartes lorsque l'on clique dessus
    function flipCard() {
        if (cardsChosen.length >= 2) return; // Ne pas pouvoir sélectionner plus de 2 cartes à la fois
        let cardId = this.getAttribute('data-id'); // Obtenir l'ID de la carte

        if (cardsChosenId.includes(cardId)) return; // Ne pas retourner la même carte plusieurs fois

        cardsChosen.push(cardArray[cardId].name); // Ajouter le nom de la carte à la sélection
        cardsChosenId.push(cardId); // Ajouter l'ID de la carte à la liste des cartes sélectionnées
        this.setAttribute('src', cardArray[cardId].img); // Afficher l'image de la carte
        this.classList.add('flip'); // Ajouter une classe CSS pour la retourner

        if (!gameStarted) startTimer(); // Démarrer le chronomètre si ce n'est pas encore fait

        if (cardsChosen.length === 2) setTimeout(checkForMatch, 500); // Vérifier les cartes après 500ms
    }
  
    // Fonction pour vérifier si les deux cartes sélectionnées forment une paire
    function checkForMatch() {
        const cards = document.querySelectorAll('.grid img'); // Sélectionner toutes les images de la grille
        const [optionOneId, optionTwoId] = cardsChosenId; // Récupérer les ID des deux cartes sélectionnées
  
        // Si les deux cartes sont les mêmes
        if (optionOneId === optionTwoId) {
            createPopup('Vous avez cliqué sur la même image !'); // Afficher un message d'erreur
        } else if (cardsChosen[0] === cardsChosen[1]) {
            createPopup('Vous avez trouvé une paire !'); // Afficher un message de réussite
            cards[optionOneId].setAttribute('src', 'ressources/white.png'); // Marquer les cartes comme trouvées
            cards[optionTwoId].setAttribute('src', 'ressources/white.png');
            cards[optionOneId].removeEventListener('click', flipCard); // Désactiver l'écouteur de clic sur ces cartes
            cards[optionTwoId].removeEventListener('click', flipCard);
            cardsWon.push(cardsChosen[0]); // Ajouter la paire trouvée à la liste des cartes gagnées
            score += 20; // Ajouter des points pour une paire trouvée
            scoreElement.textContent = `Score: ${score}`; // Mettre à jour l'affichage du score
        } else {
            createPopup('Loupé !'); // Afficher un message d'échec
            setTimeout(() => { // Réinitialiser les cartes après un court délai
                cards[optionOneId].setAttribute('src', 'ressources/back.png');
                cards[optionTwoId].setAttribute('src', 'ressources/back.png');
            }, 500);
            score -= 10; // Enlever des points pour une mauvaise tentative
            scoreElement.textContent = `Score: ${score}`; // Mettre à jour l'affichage du score
        }

        // Réinitialiser les cartes sélectionnées
        cardsChosen = [];
        cardsChosenId = [];

        // Si toutes les cartes ont été trouvées, afficher l'écran de victoire
        if (cardsWon.length === cardArray.length / 2) {
            clearInterval(timerInterval); // Arrêter le chronomètre
            gameWon = true;  // Marquer le jeu comme gagné
            showVictoryScreen(true); // Afficher l'écran de victoire
        }
    }
  
    // Fonction pour afficher un message contextuel
    function createPopup(message) {
        const popup = document.createElement('div'); // Créer un élément pour le pop-up
        popup.className = 'popup'; // Ajouter une classe CSS pour le style
        popup.textContent = message; // Ajouter le message à afficher
        document.body.appendChild(popup); // Ajouter le pop-up au corps du document
        setTimeout(() => popup.remove(), 2000); // Supprimer le pop-up après 2 secondes
    }
  
    // Fonction pour afficher l'écran de victoire (ou de défaite)
    function showVictoryScreen(isWin) {
        const victoryScreen = document.createElement('div');
        victoryScreen.className = 'victory-screen';
  
        const connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
        const playerName = connectedUser ? connectedUser.login : "Anonyme";
        const playerScore = score;
        const rank = getRank();
  
        // HTML dynamique pour afficher les informations du joueur et le résultat du jeu
        let contentHTML = `
            <div class="victory-content">
                <h2>${isWin ? '🎉 Bravo ! 🎉' : '⏳ Temps écoulé ! 😡'}</h2>
                ${isWin ? `
                    <table>
                        <tr><td>Pseudo :</td><td>${playerName}</td></tr>
                        <tr><td>Score :</td><td>${playerScore}</td></tr>
                        <tr><td>Taille :</td><td>${gameSettings.size}</td></tr>
                        <tr><td>Thème :</td><td>${gameSettings.theme}</td></tr>
                        <tr><td>Date :</td><td>${new Date().toLocaleString()}</td></tr>
                        ${rank !== null ? `<tr><td>Rang :</td><td>${rank}</td></tr>` : ''}
                    </table>
                    <button id="restart">Rejouer</button>
                ` : `
                    <p>⏳ Temps écoulé ! Votre score ne sera pas enregistré. 😡</p>
                    <button id="restart">Rejouer</button>
                `}
            </div>
        `;
      
        victoryScreen.innerHTML = contentHTML;
        document.body.appendChild(victoryScreen);
  
        document.getElementById('restart').addEventListener('click', () => {
            document.body.removeChild(victoryScreen); // Enlever l'écran de victoire
            resetGame(); // Réinitialiser le jeu
        });
  
        if (isWin) {
            saveScore(); // Enregistrer le score si le joueur a gagné
        }
    }
  
    // Fonction pour obtenir le rang du joueur parmi les meilleurs scores
    function getRank() {
        let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
        if (!connectedUser) return null;

        let playerScore = score;
        let bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];
        bestScores.sort((a, b) => b.score - a.score); // Trier les scores par ordre décroissant
  
        for (let i = 0; i < bestScores.length; i++) {
            if (bestScores[i].name === connectedUser.login && bestScores[i].score === playerScore) {
                return i + 1; // Renvoyer le rang du joueur
            }
        }
        return null; // Si aucun rang n'est trouvé
    }
  
    // Fonction pour enregistrer le score dans localStorage
    function saveScore() {
        let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
        let playerName = connectedUser ? connectedUser.login : "Anonyme";
        let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
        bestScores.push({ name: playerName, score: score });
        bestScores.sort((a, b) => b.score - a.score);
        bestScores = bestScores.slice(0, 10); // Garder seulement les 10 meilleurs scores
        localStorage.setItem("bestScores", JSON.stringify(bestScores));
    }
  
    // Fonction pour réinitialiser le jeu
    function resetGame() {
        cardsChosen = [];
        cardsChosenId = [];
        cardsWon = [];
        score = 100;
        timeLeft = 60;
        scoreElement.textContent = `Score: ${score}`;
        timerElement.textContent = `Temps: ${timeLeft}s`;
        createBoard(); // Re-créer la grille avec les cartes mélangées
        gameStarted = false;
        gameWon = false; // Réinitialiser l'état de victoire
        clearInterval(timerInterval); // Arrêter le timer avant de redémarrer
    }
  
    // Écouter la touche "Espace" pour réinitialiser le jeu
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.code === 'Space') {
            if (gameWon) {
                document.body.querySelector('.victory-screen')?.remove(); // Supprimer la fenêtre de victoire si le jeu est gagné
            }
            resetGame(); // Réinitialiser le jeu
        }
    });
  
    createBoard(); // Créer la grille de jeu au départ
});
