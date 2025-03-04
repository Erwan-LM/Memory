window.onload = function() {
    let connectedUser = JSON.parse(localStorage.getItem('connectedUser'));

    if (connectedUser) {
        showUserProfile(connectedUser); 
        let welcomeMessage = document.getElementById("welcome-message");
        if (welcomeMessage) {
            welcomeMessage.textContent = `Bienvenue ${connectedUser.login}`;
        }
    }
};
