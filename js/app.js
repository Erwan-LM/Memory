document.addEventListener('DOMContentLoaded', () => {
  const cardArray = [
    { name: 'fries', img: 'images/fries.png' },
    { name: 'cheeseburger', img: 'images/cheeseburger.png' },
    { name: 'ice-cream', img: 'images/ice-cream.png' },
    { name: 'pizza', img: 'images/pizza.png' },
    { name: 'milkshake', img: 'images/milkshake.png' },
    { name: 'hotdog', img: 'images/hotdog.png' },
    { name: 'fries', img: 'images/fries.png' },
    { name: 'cheeseburger', img: 'images/cheeseburger.png' },
    { name: 'ice-cream', img: 'images/ice-cream.png' },
    { name: 'pizza', img: 'images/pizza.png' },
    { name: 'milkshake', img: 'images/milkshake.png' },
    { name: 'hotdog', img: 'images/hotdog.png' }
  ];
  
  cardArray.sort(() => 0.5 - Math.random());
  
  const grid = document.querySelector('.grid');
  const resultDisplay = document.querySelector('#result');
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];
  
  function createBoard() {
    grid.innerHTML = '';
    for (let i = 0; i < cardArray.length; i++) {
      const card = document.createElement('img');
      card.setAttribute('src', 'images/blank.png');
      card.setAttribute('data-id', i);
      card.addEventListener('click', flipCard);
      grid.appendChild(card);
    }
  }
  
  function createPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
  }
  
  function checkForMatch() {
    const cards = document.querySelectorAll('.grid img');
    const [optionOneId, optionTwoId] = cardsChosenId;
  
    if (optionOneId === optionTwoId) {
      createPopup('Vous avez cliqué sur la même image !');
    } else if (cardsChosen[0] === cardsChosen[1]) {
      createPopup('Vous avez trouvé une paire !');
      cards[optionOneId].setAttribute('src', 'images/white.png');
      cards[optionTwoId].setAttribute('src', 'images/white.png');
      cards[optionOneId].removeEventListener('click', flipCard);
      cards[optionTwoId].removeEventListener('click', flipCard);
      cardsWon.push(cardsChosen);
    } else {
      createPopup('Loupé !');
      setTimeout(() => {
        cards[optionOneId].setAttribute('src', 'images/blank.png');
        cards[optionTwoId].setAttribute('src', 'images/blank.png');
      }, 500);
    }
    
    cardsChosen = [];
    cardsChosenId = [];
    resultDisplay.textContent = cardsWon.length;
  
    if (cardsWon.length === cardArray.length / 2) {
      showVictoryScreen();
    }
  }
  
  function flipCard() {
    let cardId = this.getAttribute('data-id');
    if (cardsChosenId.includes(cardId)) return;
  
    cardsChosen.push(cardArray[cardId].name);
    cardsChosenId.push(cardId);
    this.setAttribute('src', cardArray[cardId].img);
    this.classList.add('flip');
  
    if (cardsChosen.length === 2) {
      setTimeout(checkForMatch, 500);
    }
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
    
    document.getElementById('restart').addEventListener('click', () => {
        document.body.removeChild(victoryScreen);
        resetGame();
    });
}

function resetGame() {
    // Réinitialiser les variables du jeu
    cardsChosen = [];
    cardsChosenId = [];
    cardsWon = [];

    // Réinitialiser l'affichage du score
    resultDisplay.textContent = '0';

    // Mélanger les cartes
    cardArray.sort(() => 0.5 - Math.random());

    // Vider et recréer le plateau
    grid.innerHTML = '';
    createBoard();
}

  
  createBoard();
});
