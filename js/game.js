document.addEventListener('DOMContentLoaded', () => {
  const gameSettings = JSON.parse(localStorage.getItem("gameSettings")) || { theme: "legumes", size: "4" };
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

  function generateTheme(theme, count, extension) {
      let basePath = `ressources/${theme}/`;
      return Array.from({ length: count }, (_, i) => ({
          name: `${theme}${i + 1}`,
          img: `${basePath}${i + 1}${extension}`
      }));
  }

  const gridSize = parseInt(gameSettings.size);
  const maxPairs = (gridSize * gridSize) / 2;
  let cardArray = [...themes[gameSettings.theme]];
  cardArray = cardArray.slice(0, Math.min(maxPairs, cardArray.length));
  cardArray = [...cardArray, ...cardArray].sort(() => 0.5 - Math.random());

  const grid = document.querySelector('.grid');
  let cardsChosen = [], cardsChosenId = [], cardsWon = [];
  let score = 100;
  let timeLeft = 60;
  let timerInterval;
  let gameStarted = false;

  const timerElement = document.getElementById('timer');
  const scoreElement = document.getElementById('score');


  function setGridSize(size) {
      grid.style.gridTemplateColumns = `repeat(${size}, auto)`;
  }

  function createBoard() {
    const grid = document.querySelector('.grid');
    if (!grid) {
        console.error('L\'élément .grid n\'a pas été trouvé');
        return;
    }
    grid.innerHTML = '';
    setGridSize(gameSettings.size);
    cardArray.forEach((card, index) => {
        const cardElement = document.createElement('img');
        cardElement.setAttribute('src', 'ressources/back.png');
        cardElement.setAttribute('data-id', index);
        cardElement.addEventListener('click', flipCard);
        grid.appendChild(cardElement);
    });
}


  function startTimer() {
      if (!gameStarted) {
          gameStarted = true;
          timerInterval = setInterval(() => {
              timeLeft--;
              timerElement.textContent = `Temps: ${timeLeft}s`;
              if (timeLeft <= 0) {
                  clearInterval(timerInterval);
                  showVictoryScreen(false);
              }
              score = Math.max(0, score - 1);
              scoreElement.textContent = `Score: ${score}`;
          }, 1000);
      }
  }

  function flipCard() {
      if (cardsChosen.length >= 2) return;
      let cardId = this.getAttribute('data-id');

      if (cardsChosenId.includes(cardId)) return;

      cardsChosen.push(cardArray[cardId].name);
      cardsChosenId.push(cardId);
      this.setAttribute('src', cardArray[cardId].img);
      this.classList.add('flip');

      if (!gameStarted) startTimer();

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
          score += 20;
          scoreElement.textContent = `Score: ${score}`;
      } else {
          createPopup('Loupé !');
          setTimeout(() => {
              cards[optionOneId].setAttribute('src', 'ressources/back.png');
              cards[optionTwoId].setAttribute('src', 'ressources/back.png');
          }, 500);
          score -= 10;
          scoreElement.textContent = `Score: ${score}`;
      }
      cardsChosen = [];
      cardsChosenId = [];

      if (cardsWon.length === cardArray.length / 2) {
          clearInterval(timerInterval);
          showVictoryScreen(true);
      }
  }

  function createPopup(message) {
      const popup = document.createElement('div');
      popup.className = 'popup';
      popup.textContent = message;
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 2000);
  }

  function getRank() {
    let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    if (!connectedUser) return null;  // Si aucun utilisateur connecté, pas de rang à récupérer

    let playerScore = score;  // Le score du joueur
    let bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];

    // Trier les scores par ordre décroissant
    bestScores.sort((a, b) => b.score - a.score);

    // Trouver le rang de l'utilisateur en comparant son pseudo et son score
    for (let i = 0; i < bestScores.length; i++) {
        if (bestScores[i].name === connectedUser.login && bestScores[i].score === playerScore) {
            return i + 1;  // Retourner le rang (index + 1)
        }
    }

    return null;  // Si le joueur n'est pas trouvé, le rang est "Non classé"
}

function showVictoryScreen(isWin) {
    const victoryScreen = document.createElement('div');
    victoryScreen.className = 'victory-screen';

    const connectedUser = JSON.parse(localStorage.getItem('connectedUser'));  // Récupère les informations de l'utilisateur connecté
    const playerName = connectedUser ? connectedUser.login : "Anonyme";  // Pseudo de l'utilisateur ou "Anonyme"
    const playerScore = score;  // Récupère le score actuel

    // Appeler la fonction getRank pour obtenir le rang du joueur
    const rank = getRank();

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

    // Ajouter l'événement pour redémarrer
    document.getElementById('restart').addEventListener('click', () => {
        document.body.removeChild(victoryScreen);
        resetGame();
    });

    // Si le joueur a gagné, on enregistre son score
    if (isWin) {
        saveScore();  // Sauvegarder le score de l'utilisateur
    }
}



  function saveScore() {
      let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
      let playerName = connectedUser ? connectedUser.login : "Anonyme";
      let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
      bestScores.push({ name: playerName, score: score });
      bestScores.sort((a, b) => b.score - a.score);
      bestScores = bestScores.slice(0, 10);
      localStorage.setItem("bestScores", JSON.stringify(bestScores));
  }

  function resetGame() {
      cardsChosen = [];
      cardsChosenId = [];
      cardsWon = [];
      score = 100;
      timeLeft = 60;
      scoreElement.textContent = `Score: ${score}`;
      timerElement.textContent = `Temps: ${timeLeft}s`;
      createBoard();
      gameStarted = false;
  }

  createBoard();
});
