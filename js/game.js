document.addEventListener('DOMContentLoaded', () => {
  // Récupérer les paramètres de jeu depuis le localStorage
  const gameSettings = JSON.parse(localStorage.getItem("gameSettings")) || { theme: "legumes", size: "4" };
  console.log("Paramètres du jeu chargés :", gameSettings);

  // Définition des thèmes
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

  /**
   * Génère un tableau d'objets représentant les images d'un thème spécifique pour le jeu de memory.
   * Chaque image est dupliquée pour correspondre aux paires nécessaires au jeu.
   */
  function generateTheme(theme, count, extension) {
    let basePath = `ressources/${theme}/`;
    return Array.from({ length: count }, (_, i) => ({
        name: `${theme}${i + 1}`,
        img: `${basePath}${i + 1}${extension}`
    }));
  }

  // Vérification du thème valide
  if (!themes[gameSettings.theme]) {
      console.error("Thème invalide :", gameSettings.theme);
      gameSettings.theme = "legumes"; // Valeur par défaut
  }

  // Calcul du nombre de paires
  const gridSize = parseInt(gameSettings.size);
  const maxPairs = (gridSize * gridSize) / 2; // Nombre de paires nécessaires
  let cardArray = [...themes[gameSettings.theme]];

  // Si le nombre de paires demandées dépasse le nombre d'images disponibles, ajuster
  cardArray = cardArray.slice(0, Math.min(maxPairs, cardArray.length)); 

  // Créer les paires en doublant les images
  cardArray = [...cardArray, ...cardArray].sort(() => 0.5 - Math.random()); // Mélanger les cartes

  console.log("Paires générées :", cardArray);

  // Générer le plateau de jeu
  const grid = document.querySelector('.grid');
  const resultDisplay = document.querySelector('#result');
  let cardsChosen = [], cardsChosenId = [], cardsWon = [];

  function setGridSize(size) {
    grid.style.gridTemplateColumns = `repeat(${size}, auto)`;
  }

  function createBoard() {
    grid.innerHTML = '';
    setGridSize(gameSettings.size);
    cardArray.forEach((card, index) => {
      const cardElement = document.createElement('img');
      cardElement.setAttribute('src', 'ressources/back.png');
      cardElement.setAttribute('data-id', index);
      cardElement.addEventListener('click', flipCard);
      grid.appendChild(cardElement);
    });
    resultDisplay.textContent = '0';
  }

  function flipCard() {
    if (cardsChosen.length >= 2) return;
    let cardId = this.getAttribute('data-id');
    if (cardsChosenId.includes(cardId)) return;

    cardsChosen.push(cardArray[cardId].name);
    cardsChosenId.push(cardId);
    this.setAttribute('src', cardArray[cardId].img);
    this.classList.add('flip');

    if (cardsChosen.length === 2) setTimeout(checkForMatch, 500);
  }

  function checkForMatch() {
    const cards = document.querySelectorAll('.grid img');
    const [optionOneId, optionTwoId] = cardsChosenId;

    if (optionOneId === optionTwoId) {
      createPopup('Vous avez cliqué sur la même image !');
    } else if (cardsChosen[0] === cardsChosen[1]) {
      createPopup('Vous avez trouvé une paire !');
      cards[optionOneId].setAttribute('src', 'ressources/white.png');
      cards[optionTwoId].setAttribute('src', 'ressources/white.png');
      cards[optionOneId].removeEventListener('click', flipCard);
      cards[optionTwoId].removeEventListener('click', flipCard);
      cardsWon.push(cardsChosen[0]);
      resultDisplay.textContent = cardsWon.length;
    } else {
      createPopup('Loupé !');
      setTimeout(() => {
        cards[optionOneId].setAttribute('src', 'ressources/back.png');
        cards[optionTwoId].setAttribute('src', 'ressources/back.png');
      }, 500);
    }
    cardsChosen = [];
    cardsChosenId = [];

    if (cardsWon.length === cardArray.length / 2) showVictoryScreen();
  }

  function createPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
  }

  function showVictoryScreen() {
    const victoryScreen = document.createElement('div');
    victoryScreen.className = 'victory-screen';
    victoryScreen.innerHTML = `
      <div class="victory-content">
        <h2>🎉 Bravo ! 🎉</h2>
        <p>Souhaitez-vous rejouer ?</p>
        <button id="restart">Rejouer</button>
      </div>
    `;
    document.body.appendChild(victoryScreen);
    
    // Réaction au bouton "Rejouer"
    document.getElementById('restart').addEventListener('click', () => {
      document.body.removeChild(victoryScreen);
      resetGame();
    });

    // Ajout de l'event "space" pour relancer le jeu
    document.addEventListener('keydown', handleKeydown);

    // Fonction de gestion de la barre espace
    function handleKeydown(event) {
      if (event.key === ' ' || event.key === 'Spacebar') {
        document.body.removeChild(victoryScreen);
        resetGame();
      }
    }

    // Réinitialisation du jeu
    function resetGame() {
      document.removeEventListener('keydown', handleKeydown); // Nettoyer l'écouteur
      cardsChosen = [];
      cardsChosenId = [];
      cardsWon = [];
      resultDisplay.textContent = '0';
      cardArray.sort(() => 0.5 - Math.random()); // Mélanger les cartes
      createBoard(); // Re-créer le plateau
    }
  }

  createBoard(); // Créer le plateau au démarrage
});
