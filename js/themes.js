const themes = {
    food: [
        { name: 'fries', img: 'images/fries.png' },
        { name: 'cheeseburger', img: 'images/cheeseburger.png' },
        { name: 'ice-cream', img: 'images/ice-cream.png' },
        { name: 'pizza', img: 'images/pizza.png' },
        { name: 'milkshake', img: 'images/milkshake.png' },
        { name: 'hotdog', img: 'images/hotdog.png' }
    ],
    animals: [
        { name: 'cat', img: 'images/cat.png' },
        { name: 'dog', img: 'images/dog.png' },
        { name: 'lion', img: 'images/lion.png' },
        { name: 'elephant', img: 'images/elephant.png' },
        { name: 'monkey', img: 'images/monkey.png' },
        { name: 'fox', img: 'images/fox.png' }
    ],
    space: [
        { name: 'planet', img: 'images/planet.png' },
        { name: 'star', img: 'images/star.png' },
        { name: 'rocket', img: 'images/rocket.png' },
        { name: 'moon', img: 'images/moon.png' },
        { name: 'satellite', img: 'images/satellite.png' },
        { name: 'astronaut', img: 'images/astronaut.png' }
    ]
};

document.getElementById('startGame').addEventListener('click', () => {
    const theme = document.getElementById('theme').value;
    const size = parseInt(document.getElementById('size').value);

    let selectedCards = [...themes[theme]];
    selectedCards = selectedCards.slice(0, (size * size) / 2);
    let cardArray = [...selectedCards, ...selectedCards];
    cardArray.sort(() => 0.5 - Math.random());

    createBoard(cardArray, size);
});
