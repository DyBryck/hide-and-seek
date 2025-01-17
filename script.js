const entrySound = new Audio("./assets/audio/entry-sound.mp3");
entrySound.play();

const gameTitle = document.querySelector("#game-title");
gameTitle.addEventListener("animationend", () => {
  for (let index = 0; index < 3; index++) {
    setTimeout(() => {
      gameTitle.innerText += ".";
    }, index * 400);
  }
});
