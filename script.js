const gameTitleContainer = document.querySelector("#game-title");

const finalGameTitle = "Hide and Seek";
let gameTitle = "";

for (let index = 0; index < finalGameTitle.length; index++) {
  setTimeout(() => {
    gameTitle += finalGameTitle[index];
    gameTitleContainer.textContent = gameTitle;
  }, index * 100);
}
