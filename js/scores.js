let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];

function displayScores() {
    const scoresList = document.getElementById("scores-list");
    scoresList.innerHTML = bestScores.map((entry, index) => 
        `<tr>
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score} pts</td>
        </tr>`
    ).join("");
}



document.addEventListener('DOMContentLoaded', displayScores);
