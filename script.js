const savedPseudo = localStorage.getItem("pseudo");
const savedGender = localStorage.getItem("gender");
const savedScene = localStorage.getItem("scene");

class Game {
  constructor() {
    // Initialise l'état du jeu
    this.initState();
    // Récupère et stocke tous les éléments du DOM nécessaires
    this.cacheDOM();
  }

  // Initialise les variables d'état
  initState() {
    // Données du jeu
    this.characters = null;
    this.scenes = null;
    this.currentScene = null;
    this.dialogueIndex = 0;
    this.isTyping = false;
    this.isChoosing = false;

    // Infos du joueur
    this.pseudo = "";
    this.gender = null; // true pour male, false pour female
    this.mainCharacter = null;
    this.secondCharacter = null;

    // Sons
    this.entrySound = new Audio("./assets/audio/entry-sound.mp3");
    // this.blip = new Audio("./assets/audio/blip.wav");
  }

  // Stocke dans des propriétés tous les éléments DOM utilisés
  cacheDOM() {
    // Éléments généraux
    this.gameTitle = document.querySelector("#game-title");
    this.dots = document.querySelector("#dots");
    this.pseudoField = document.querySelector("#pseudo");
    this.playButton = document.querySelector("#play-button");
    this.dialogue = document.querySelector("#dialogue");
    this.nextDialogueBtn = document.querySelector("#next-dialogue-btn");

    // Pages
    this.startingPage = document.querySelector("#starting-page");
    this.introPage = document.querySelector("#intro-page");
    this.dialoguePage = document.querySelector("#dialogue-page");

    // Personnages affichés
    this.leftCharacter = document.querySelector("#left-character");
    this.rightCharacter = document.querySelector("#right-character");
    this.leftCharacterNameContainer = document.querySelector("#left-character-name-container");
    this.rightCharacterNameContainer = document.querySelector("#right-character-name-container");
    this.leftCharacterName = document.querySelector("#left-character-name");
    this.rightCharacterName = document.querySelector("#right-character-name");

    // Zone de dialogue et choix
    this.dialBox = document.querySelector("#dial-box");
    this.choicesBox = document.querySelector("#choices-box");
    this.choicesBtnContainer = document.querySelector("#choices-btn-container");
    this.questionContainer = document.querySelector("#question");
  }

  // Méthode d'initialisation : charge les données et installe les écouteurs d'évènements
  async init() {
    await this.loadData();
    this.setupListeners();
    this.playEntrySound();
    this.animateGameTitle();

    if (savedScene) {
      this.startingPage.style.display = "none";
      this.dialoguePage.style.display = "flex";
      this.setGender(savedGender === "true" ? "male" : "female");
      this.pseudo = savedPseudo;
      this.mainCharacter.name = this.pseudo;
      this.goNext();
    }
  }

  // Charge les données depuis les fichiers JSON
  async loadData() {
    try {
      const charactersRes = await fetch("./data/characters.json");
      this.characters = await charactersRes.json();

      const scenesRes = await fetch("./data/dialogues.json");
      this.scenes = await scenesRes.json();

      // On démarre avec la scène d'id 0
      if (!savedScene) {
        this.currentScene = this.scenes.find((scene) => scene.id === 0);
      } else {
        this.currentScene = this.scenes.find((scene) => scene.id === parseInt(savedScene));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  }

  // Joue le son d'entrée
  playEntrySound() {
    this.entrySound.play();
  }

  // Animation du titre avec les 3 petits points
  animateGameTitle() {
    this.gameTitle.addEventListener("animationend", () => {
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
  }

  // Configure les écouteurs d'évènements
  setupListeners() {
    // Active/désactive le bouton "Jouer" en fonction du pseudo et du genre
    this.pseudoField.addEventListener("input", () => this.checkPlayButton());

    // Sélection du genre via les icônes (attend des éléments avec id "male" et "female")
    const genderIcons = document.querySelector("#gender-icons-container").children;
    Array.from(genderIcons).forEach((icon) => {
      icon.addEventListener("click", () => this.setGender(icon.id));
    });

    // Lancement de l'intro au clic sur le bouton "Jouer"
    this.playButton.addEventListener("click", () => this.playIntro());

    // Avance l'histoire au clic sur la boîte de dialogue
    const dialogueBox = document.querySelector("#dialogue-box");
    dialogueBox.addEventListener("click", () => this.goNext());
  }

  // Vérifie si le bouton "Jouer" doit être activé
  checkPlayButton() {
    if (this.pseudoField.value.length >= 3 && this.gender !== null) {
      this.enablePlayButton(true);
    } else {
      this.enablePlayButton(false);
    }
  }

  // Active ou désactive le bouton "Jouer"
  enablePlayButton(enable) {
    this.playButton.disabled = !enable;
    this.playButton.style.opacity = enable ? "1" : "0.5";
  }

  // Définit le genre choisi et les personnages associés
  setGender(selectedGender) {
    // Détermine si le genre sélectionné est masculin
    const isMale = selectedGender === "male";

    // Met à jour les propriétés de l'objet en fonction du genre
    this.gender = isMale;
    this.mainCharacter = isMale ? this.characters.eliott : this.characters.rose;
    this.secondCharacter = isMale ? this.characters.rose : this.characters.eliott;

    // Sélectionne les images du DOM
    const maleImg = document.querySelector("#male");
    const femaleImg = document.querySelector("#female");

    // Modifie l'opacité en fonction du genre sélectionné
    maleImg.style.opacity = isMale ? "1" : "0.5";
    femaleImg.style.opacity = isMale ? "0.5" : "1";

    localStorage.setItem("gender", isMale);

    // Vérifie si le bouton de lecture doit être activé
    this.checkPlayButton();
  }

  // Change de page avec une transition en fondu
  toggleView(from, to) {
    from.classList.add("fade-out");
    from.addEventListener(
      "animationend",
      () => {
        from.style.display = "none";
        from.classList.remove("fade-out");

        to.style.display = "flex";
        to.classList.add("fade-in");

        setTimeout(() => {
          to.classList.add("visible");
        }, 50);
      },
      { once: true },
    );
  }

  // Lance l'intro du jeu
  playIntro() {
    // Récupère le pseudo et met à jour le personnage principal
    this.pseudo = this.pseudoField.value;
    this.mainCharacter.name = this.pseudo;

    localStorage.setItem("pseudo", this.pseudo);

    // Transition de la page de démarrage à l'intro
    this.toggleView(this.startingPage, this.introPage);

    setTimeout(() => {
      new TypeIt("#intro-text", {
        speed: 50, // 50
        cursor: false,
      })
        .type("7 DÉCEMBRE 1996, 19h")
        .pause(2000)
        .empty()
        .type("La nuit tombait lentement, enveloppant la forêt d’un voile d’obscurité oppressant.")
        .pause(2000)
        .empty()
        .type(
          "Un groupe de cinq amis, excités par l’idée d’un week-end loin de tout, s’enfonçait sur un sentier étroit..",
        )
        .pause(2000)
        .empty()
        .type("Leurs lampes torches projetant des faisceaux vacillants entre les arbres imposants.")
        .pause(2000)
        .empty()
        .exec(() => {
          // Une fois l'intro terminée, passe à la page de dialogue
          this.toggleView(this.introPage, this.dialoguePage);
          setTimeout(() => {
            // Affiche le premier personnage et le premier dialogue
            this.showCharacter(this.mainCharacter.neutral, "left", this.mainCharacter.name);
            this.typeDialogue(
              "Tu es sûr que c’est ici ? C’est vraiment isolé, non ? Je trouve que c’est… un peu flippant.",
            );
          }, 1000);
        })
        .go();
    }, 500);
  }

  // Affiche le texte dans la boîte de dialogue
  typeDialogue(text) {
    this.isTyping = true;

    // Passage en italique si le texte contient des **
    if (text.match(/\*\*/)) {
      this.dialogue.style.fontStyle = "italic";
      text = text.replaceAll("**", "");
    } else {
      this.dialogue.style.fontStyle = "inherit";
    }

    new TypeIt(this.dialogue, {
      speed: 10,
      cursor: false,
    })
      .type(text)
      .exec(() => {
        this.enableNextDialogueBtn(true);
        this.isTyping = false;
      })
      .go();
  }

  // Active ou désactive le bouton pour passer au dialogue suivant
  enableNextDialogueBtn(enable) {
    this.nextDialogueBtn.disabled = !enable;
    this.nextDialogueBtn.style.opacity = enable ? "0.6" : "0";
  }

  // Passe au dialogue suivant et gère la fin de scène
  nextDialogue() {
    if (this.isTyping) return;

    // Réinitialise le contenu du dialogue
    this.dialogue.innerText = "";
    this.typeDialogue(this.currentScene.dialogues[this.dialogueIndex].text);

    if (this.dialogueIndex === this.currentScene.dialogues.length - 1) {
      console.log("Fin du chapitre");
      this.isChoosing = true;
      this.dialogueIndex = 0;
    } else {
      this.dialogueIndex++;
    }
  }

  // Gère l'avancement de l'histoire (dialogue ou affichage des choix)
  goNext() {
    if (this.isTyping) return;

    // Changement de background si nécessaire
    const currentDialogue = this.currentScene.dialogues[this.dialogueIndex];
    localStorage.setItem("scene", this.currentScene.id);
    if (currentDialogue && currentDialogue.background) {
      this.dialoguePage.classList.add("animate-background");
      this.dialoguePage.style.backgroundImage = `url("${currentDialogue.background}")`;
      setTimeout(() => {
        this.dialoguePage.classList.remove("animate-background");
      }, 1000);
    }

    if (!this.isChoosing) {
      // Détermine l'image à afficher en fonction du genre
      let source = Array.isArray(currentDialogue.source)
        ? this.gender
          ? currentDialogue.source[1]
          : currentDialogue.source[0]
        : currentDialogue.source;

      // Détermine le nom du personnage qui parle
      let name;
      if (currentDialogue.character === "secondCharacter") {
        name = this.secondCharacter.name;
      } else if (currentDialogue.character === "mainCharacter") {
        name = this.pseudo;
      } else {
        name = currentDialogue.character;
      }
      this.enableNextDialogueBtn(false);
      this.showCharacter(source, currentDialogue.side, name);
      this.nextDialogue();
    } else {
      // Affiche les choix de dialogue si c'est le moment
      this.showChoices(this.currentScene.question, this.currentScene.choices);
    }
  }

  // Affiche un personnage (image et nom) à gauche ou à droite
  showCharacter(source, side, characterName) {
    if (characterName === "Narrative") {
      this.emptyCharacters();
      return;
    }
    const imageCharacter = document.createElement("img");
    imageCharacter.src = source;

    if (side === "left") {
      this.leftCharacter.innerHTML = "";
      this.leftCharacter.appendChild(imageCharacter);
      this.whoTalks("left", characterName);
    } else {
      this.rightCharacter.innerHTML = "";
      this.rightCharacter.appendChild(imageCharacter);
      this.whoTalks("right", characterName);
    }
  }

  // Met en évidence le personnage qui parle et affiche son nom
  whoTalks(side, characterName) {
    if (side === "left") {
      this.leftCharacterName.innerText = characterName;
      this.leftCharacterNameContainer.style.display = "flex";
      this.rightCharacterNameContainer.style.display = "none";
      this.leftCharacter.classList.remove("inactive-character");
      this.rightCharacter.classList.add("inactive-character");
    } else {
      this.rightCharacterName.innerText = characterName;
      this.leftCharacterNameContainer.style.display = "none";
      this.rightCharacterNameContainer.style.display = "flex";
      this.rightCharacter.classList.remove("inactive-character");
      this.leftCharacter.classList.add("inactive-character");
    }
  }

  // Affiche les choix disponibles à l'écran
  showChoices(question, choices) {
    this.emptyCharacters();
    this.choicesBtnContainer.innerHTML = "";
    this.dialBox.style.display = "none";
    this.choicesBox.style.display = "flex";
    this.questionContainer.innerText = question;

    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.innerText = choice.choice;
      button.addEventListener("click", () => {
        this.currentScene = this.scenes.find((scene) => scene.id === choice.nextId);
        this.dialogueIndex = 0;
        this.isChoosing = false;
        this.hideChoices();
        this.goNext();
      });
      this.choicesBtnContainer.appendChild(button);
    });
  }

  // Cache la zone des choix
  hideChoices() {
    this.dialBox.style.display = "flex";
    this.choicesBox.style.display = "none";
  }

  // Vide les zones d'affichage des personnages
  emptyCharacters() {
    this.leftCharacter.innerHTML = "";
    this.rightCharacter.innerHTML = "";
    this.leftCharacterNameContainer.style.display = "none";
    this.rightCharacterNameContainer.style.display = "none";
  }
}

// Instanciation et démarrage du jeu
const game = new Game();
game.init();
