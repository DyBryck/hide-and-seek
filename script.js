const entrySound = new Audio("./assets/audio/entry-sound.mp3");
// entrySound.play();

// Ajoute les 3 petits points au titre après son animation
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

// Fonction qui change de page avec un fondu
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
const introPage = document.querySelector("#intro-page");

let gender;

const pseudoField = document.querySelector("#pseudo");
pseudoField.addEventListener("input", () => {
  if (pseudoField.value.length >= 3 && gender) {
    playButton.disabled = false;
  } else {
    playButton.disabled = true;
  }
});

const genderIcons = document.querySelector("#gender-icons-container").children;
Array.from(genderIcons).forEach((genderIcon) => {
  genderIcon.addEventListener("click", () => getGender(genderIcon.id));
});

const maleImg = document.querySelector("#male");
const femaleImg = document.querySelector("#female");
const getGender = (id) => {
  gender = id;
  if (id === "male") {
    maleImg.style.opacity = "1";
    femaleImg.style.opacity = "0.5";
  } else {
    maleImg.style.opacity = "0.5";
    femaleImg.style.opacity = "1";
  }

  if (pseudoField.value.length >= 3 && gender) {
    playButton.disabled = false;
  } else {
    playButton.disabled = true;
  }
};

// Ajoute au bouton "Jouer" la fonction qui lance l'intro
playButton.addEventListener("click", () => playIntro());

// Lance la page d'intro, affiche le texte d'intro paragraphe par paragraphe
const playIntro = () => {
  toggleView(startingPage, introPage);

  new TypeIt("#intro-text", {
    speed: 70, // Vitesse du texte
    cursor: false, // Enlève le curseur
  })
    .type(
      "La nuit tombait lentement, enveloppant la forêt d’un voile d’obscurité oppressant.",
    )
    .pause(1500)
    .empty() // Vide le texte
    .type(
      "Un groupe de cinq amis, excités par l’idée d’un week-end loin de tout, s’enfonçait sur un sentier étroit..",
    )
    .pause(1500)
    .empty() // Vide le texte
    .type(
      "Leurs lampes torches projetant des faisceaux vacillants entre les arbres imposants.",
    )
    .go(); // Lance la fonction
};

const divTexte = document.getElementById("divTexte").style.display("none");

function dialog(tab) {
  divTexte.style.display("flex");
}
