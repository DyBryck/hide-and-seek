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

const toggleView = (from, to) => {
  from.classList.add("fade-out");

  from.addEventListener("animationend", () => {
    from.style.display = "none";
    from.classList.remove("fade-out");

    to.style.display = "flex";
    to.classList.add("fade-in");

    setTimeout(() => {
      to.classList.add("visible");
    }, 50);
  });
};

const playButton = document.querySelector("#play-button");
const startingPage = document.querySelector("#starting-page");
const homePage = document.querySelector("#home-page");
playButton.addEventListener("click", () => toggleView(startingPage, homePage));
