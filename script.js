const entrySound = new Audio("./assets/audio/entry-sound.mp3");
// entrySound.play();

const gameTitle = document.querySelector("#game-title");
gameTitle.addEventListener("animationend", () => {
  new TypeIt("#dots", {
    cursor: false,
  })
    .type(".")
    .pause(200)
    .type(".")
    .pause(200)
    .type(".")
    .go();
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
const homePage = document.querySelector("#intro-page");
playButton.addEventListener("click", () => toggleView(startingPage, homePage));

const pseudoField = document.querySelector("#pseudo");
pseudoField.addEventListener("input", () => {
  if (pseudoField.value.length >= 3) {
    playButton.disabled = false;
  } else {
    playButton.disabled = true;
  }
});
