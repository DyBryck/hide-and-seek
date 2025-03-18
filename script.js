// Stock tous les personnages
let characters;

fetch("./data/characters.json")
  .then((response) => response.json())
  .then((data) => (characters = data));

let scenes;
fetch("./data/dialogues.json")
  .then((response) => response.json())
  .then((data) => {
    scenes = data;
    scene = scenes.find((scene) => scene.id === 0);
  });

// Joue le son du début
const entrySound = new Audio("./assets/audio/entry-sound.mp3");
entrySound.play();

// const blip = new Audio("./assets/audio/blip.wav");

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
let mainCharacter;
let secondCharacter;

// Active le bouton "Jouer" si les conditions sont respectées
const pseudoField = document.querySelector("#pseudo");
pseudoField.addEventListener("input", () => {
  if (pseudoField.value.length >= 3 && (gender === false || gender === true)) {
    enablePlayButton(true);
  } else {
    enablePlayButton(false);
  }
});

// Ajoute les eventListener aux images de sélection de genre
const genderIcons = document.querySelector("#gender-icons-container").children;
Array.from(genderIcons).forEach((genderIcon) => {
  genderIcon.addEventListener("click", () => getGender(genderIcon.id));
});

/*
  Change l'opacité des images de genre (male / female)
  pour que l'utilisateur sache ce qu'il a sélectionné
  Défini le personnage principal et le personnage secondaire
  en fonction du sexe choisi
*/
const maleImg = document.querySelector("#male");
const femaleImg = document.querySelector("#female");
const getGender = (genderSelected) => {
  if (genderSelected === "male") {
    gender = true;
    mainCharacter = characters.eliott;
    secondCharacter = characters.rose;
    maleImg.style.opacity = "1";
    femaleImg.style.opacity = "0.5";
  } else {
    gender = false;
    mainCharacter = characters.rose;
    secondCharacter = characters.eliott;
    maleImg.style.opacity = "0.5";
    femaleImg.style.opacity = "1";
  }

  if (pseudoField.value.length >= 3 && (gender === false || gender === true)) {
    enablePlayButton(true);
  } else {
    enablePlayButton(false);
  }
};

// Ajoute au bouton "Jouer" la fonction qui lance l'intro
playButton.addEventListener("click", () => playIntro());

const left = "left";
const right = "right";

// Les 3 pages qui seront utilisées pour le projet
const dialoguePage = document.querySelector("#dialogue-page");
const startingPage = document.querySelector("#starting-page");
const introPage = document.querySelector("#intro-page");

const playIntro = () => {
  // Récupère le pseudo du joueur quand il clique sur "jouer"
  pseudo = pseudoField.value;
  mainCharacter.name = pseudo;
  // Passe de la starting page à la page d'intro
  toggleView(startingPage, introPage);

  setTimeout(() => {
    new TypeIt("#intro-text", {
      speed: 5, // Vitesse du texte
      // afterStep: (step) => {
      //   blip.currentTime = 0;
      //   blip.play();
      // },
      cursor: false, // Enlève le curseur
    })
      .type("7 DÉCEMBRE 19H 1996")
      // .pause(2000)
      .empty() // Vide le texte
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
      .empty()
      .exec(() => {
        // Une fois tous les textes affichés, passe de la page d'intro à la prochaine page
        toggleView(introPage, dialoguePage);
        setTimeout(() => {
          showCharacter(mainCharacter.neutral, left, mainCharacter.name);
          type(
            "Tu es sûr que c’est ici ? C’est vraiment isolé, non ? Je trouve que c’est… un peu flippant.",
          );
        }, 1000);
      })
      .go();
  }, 500);
};

/*
  Fonction qui changera le texte de la boîte de dialogue
  isTyping empêche l'utilisateur de cliquer pour passer le dialogue si
  le dialogue n'a pas fini d'être écrit
*/
const dialogue = document.querySelector("#dialogue");
let isTyping = false;
const type = (string) => {
  isTyping = true;

  const isItalic = /\*\*/;
  if (string.match(isItalic)) {
    dialogue.style.fontStyle = "italic";
    let italicString = string.replaceAll("**", "");

    new TypeIt(dialogue, {
      speed: 5,
      // afterStep: (step) => {
      //   blip.currentTime = 0;
      //   blip.play();
      // },
      cursor: false,
    })
      .type(italicString)
      .exec(() => {
        enableNextDialogueBtn(true);
        isTyping = false;
      })
      .go();

    return;
  } else {
    dialogue.style.fontStyle = "inherit";
  }

  new TypeIt(dialogue, {
    speed: 5,
    // afterStep: (step) => {
    //   blip.currentTime = 0;
    //   blip.play();
    // },
    cursor: false,
  })
    .type(string)
    .exec(() => {
      enableNextDialogueBtn(true);
      isTyping = false;
    })
    .go();
};

// Fonction qui active ou désactive le bouton pour pour passer au dialogue suivant
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

let scene;
let dialogueIndex = 0;

// Fonction qui envoie le prochain dialogue
const nextDialogue = () => {
  if (isTyping) return;

  // Vide la boîte de dialogue avant de rajouter le texte suivant
  dialogue.innerText = "";

  type(scene.dialogues[dialogueIndex].text);

  if (dialogueIndex === scene.dialogues.length - 1) {
    console.log("Fin du chapitre");
    isChoosing = true;
    dialogueIndex = 0;
  } else {
    dialogueIndex++;
  }
};

// Fait tout ce qu'il faut pour afficher le bon perso blablabla
const goNext = () => {
  // Si le dialogue n'a pas terminé d'être tapé, ne fait rien
  if (isTyping) return;

  if (scene.dialogues[dialogueIndex].background) {
    console.log("y'a un background", scene.dialogues[dialogueIndex].background);
    dialoguePage.classList.add("animate-background");
    dialoguePage.style.backgroundImage = `url("${scene.dialogues[dialogueIndex].background}")`;
    setTimeout(() => {
      dialoguePage.classList.remove("animate-background");
    }, 1000);
  }

  // Si le joueur n'est pas entrain de faire un choix:
  if (!isChoosing) {
    // Récupère la source de l'image
    let source;
    if (Array.isArray(scene.dialogues[dialogueIndex].source)) {
      if (gender) {
        source = scene.dialogues[dialogueIndex].source[1];
      } else {
        source = scene.dialogues[dialogueIndex].source[0];
      }
    } else {
      source = scene.dialogues[dialogueIndex].source;
    }

    // Le côté de l'image du personnage
    const side = scene.dialogues[dialogueIndex].side;

    // Le nom et la source de l'image qui seront affiché dans la boîte de dialogue
    let name;

    if (scene.dialogues[dialogueIndex].character === "secondCharacter") {
      name = secondCharacter.name;
    } else if (scene.dialogues[dialogueIndex].character === "mainCharacter") {
      name = pseudo;
    } else {
      name = scene.dialogues[dialogueIndex].character;
    }

    // Affiche le bouton "Suivant"
    enableNextDialogueBtn(false);
    // Affiche le personnage entrain de parler
    showCharacter(source, side, name);
    // Affiche le dialogue
    nextDialogue();
  }
  // Si le joueur est entrain de faire un choix
  else {
    // Récupère la question et les choix associés
    const question = scene.question;
    const choices = scene.choices;
    // Puis les affiche
    showChoices(question, choices);
  }
  // La source de l'image
};

// Affiche le prochain dialogue quand on clique sur la boîte de dialogue et masque le bouton "suivant"
const dialogueBox = document.querySelector("#dialogue-box");
dialogueBox.addEventListener("click", () => goNext());

const leftCharacter = document.querySelector("#left-character");
const rightCharacter = document.querySelector("#right-character");
// Affiche à gauche ou à droite la source de l'image
const showCharacter = (source, leftOrRight, characterName) => {
  if (characterName === "Narrative") {
    emptyCharacters();
    return;
  }
  const imageCharacter = document.createElement("img");
  imageCharacter.src = source;

  if (leftOrRight === "left") {
    leftCharacter.innerHTML = "";
    leftCharacter.appendChild(imageCharacter);
  } else {
    rightCharacter.innerHTML = "";
    rightCharacter.appendChild(imageCharacter);
  }

  whoTalks(leftOrRight, characterName);
};

const leftCharacterNameContainer = document.querySelector(
  "#left-character-name-container",
);
const rightCharacterNameContainer = document.querySelector(
  "#right-character-name-container",
);
const leftCharacterName = document.querySelector("#left-character-name");
const rightCharacterName = document.querySelector("#right-character-name");
// Gère l'opacité du personnage qui parle, et affiche son nom
const whoTalks = (leftOrRight, characterName) => {
  if (leftOrRight === "left") {
    leftCharacterName.innerText = characterName;
    leftCharacterNameContainer.style.display = "flex";
    rightCharacterNameContainer.style.display = "none";
    leftCharacter.classList.remove("inactive-character");
    rightCharacter.classList.add("inactive-character");
  } else {
    rightCharacterName.innerText = characterName;
    leftCharacterNameContainer.style.display = "none";
    rightCharacterNameContainer.style.display = "flex";
    rightCharacter.classList.remove("inactive-character");
    leftCharacter.classList.add("inactive-character");
  }
};

let isChoosing = false;

const dialBox = document.querySelector("#dial-box");
const choicesBox = document.querySelector("#choices-box");
const choicesBtnContainer = document.querySelector("#choices-btn-container");
const questionContainer = document.querySelector("#question");

const showChoices = (question, array) => {
  emptyCharacters();
  choicesBtnContainer.innerHTML = "";
  dialBox.style.display = "none";
  choicesBox.style.display = "flex";

  questionContainer.innerText = question;

  array.forEach((element) => {
    const button = document.createElement("button");
    button.innerText = element.choice;
    button.addEventListener("click", () => {
      scene = scenes.find((scene) => scene.id === element.nextId);
      dialogueIndex = 0;
      isChoosing = false;

      hideChoices();
      goNext();
    });
    choicesBtnContainer.appendChild(button);
  });
};

// Cache la div qui contient les choix
const hideChoices = () => {
  dialBox.style.display = "flex";
  choicesBox.style.display = "none";
};

// Vide les container des personnages
const emptyCharacters = () => {
  leftCharacter.innerHTML = "";
  rightCharacter.innerHTML = "";
  leftCharacterNameContainer.style.display = "none";
  rightCharacterNameContainer.style.display = "none";
};
