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

// Active / désactive le bouton "Jouer"
const playButton = document.querySelector("#play-button");
const enablePlayButton = (bool) => {
  if (bool) {
    playButton.disabled = false;
    playButton.style.opacity = "1";
  } else {
    playButton.disabled = true;
    playButton.style.opacity = "0.5";
  }
};

// Stock les infos du joueur
let pseudo;
let gender;

const pseudoField = document.querySelector("#pseudo");
pseudoField.addEventListener("input", () => {
  if (pseudoField.value.length >= 3 && gender) {
    enablePlayButton(true);
  } else {
    enablePlayButton(false);
  }
});

const genderIcons = document.querySelector("#gender-icons-container").children;
Array.from(genderIcons).forEach((genderIcon) => {
  genderIcon.addEventListener("click", () => getGender(genderIcon.id));
});

// Change l'opacité des images de genre (male / female)
// pour que l'utilisateur sache ce qu'il a sélectionné
const maleImg = document.querySelector("#male");
const femaleImg = document.querySelector("#female");
const getGender = (genderSelected) => {
  if (genderSelected === "male") {
    gender = true;
    maleImg.style.opacity = "1";
    femaleImg.style.opacity = "0.5";
  } else {
    gender = false;
    maleImg.style.opacity = "0.5";
    femaleImg.style.opacity = "1";
  }

  if (pseudoField.value.length >= 3 && gender !== undefined) {
    enablePlayButton(true);
  } else {
    enablePlayButton(false);
  }
};

// Ajoute au bouton "Jouer" la fonction qui lance l'intro
playButton.addEventListener("click", () => playIntro());

const dialoguePage = document.querySelector("#dialogue-page");
const startingPage = document.querySelector("#starting-page");
const introPage = document.querySelector("#intro-page");
const playIntro = () => {
  // Récupère le pseudo du joueur quand il clique sur "jouer"
  pseudo = pseudoField.value;
  // Passe de la starting page à la page d'intro
  toggleView(startingPage, introPage);

  setTimeout(() => {
    new TypeIt("#intro-text", {
      speed: 10, // Vitesse du texte
      cursor: false, // Enlève le curseur
    })
      .type(
        "La nuit tombait lentement, enveloppant la forêt d’un voile d’obscurité oppressant.",
      )
      // .pause(2000)
      .empty() // Vide le texte
      .type(
        "Un groupe de cinq amis, excités par l’idée d’un week-end loin de tout, s’enfonçait sur un sentier étroit..",
      )
      // .pause(2000)
      .empty() // Vide le texte
      .type(
        "Leurs lampes torches projetant des faisceaux vacillants entre les arbres imposants.",
      )
      // .pause(2000)
      .exec(() => {
        // Une fois tous les textes affichés, passe de la page d'intro à la prochaine page
        toggleView(introPage, dialoguePage);
        setTimeout(() => {
          addDialogue("Tu es sûr que c'est ici?");
        }, 1000);
      })
      .go();
  }, 500);
};

const dialogue = document.querySelector("#dialogue");
const addDialogue = (string) => {
  new TypeIt(dialogue, {
    speed: 70,
    cursor: false,
  })
    .type(string)
    .exec(() => {
      enableNextDialogueBtn(true);
    })
    .go();
};

const nextDialogueBtn = document.querySelector("#next-dialogue-btn");
const enableNextDialogueBtn = (bool) => {
  if (bool) {
    nextDialogueBtn.disabled = false;
    nextDialogueBtn.style.opacity = "0.6";
  } else {
    nextDialogueBtn.disabled = true;
    nextDialogueBtn.style.opacity = "0";
  }
};

const nextDialogue = (text) => {
  dialogue.innerText = "";
  addDialogue(text);
};

let nextDialogueContent = "Exemple du prochain texte";
const dialogueBox = document.querySelector("#dialogueBox");
dialogueBox.addEventListener("click", () => {
  enableNextDialogueBtn(false);
  nextDialogue(nextDialogueContent);
});
