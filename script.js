/*----- constants -----*/
const PET_STATES = {
    "1": {good: "happy", bad: "unhappy", value: 100, inc: 15, dec: 5, time: 4, exp: 20, img: "images/happyCinna.gif",},
    "2": {good: "eating", bad: "hungry", value: 100, inc: 25, dec: 10, time: 6, exp: 15, img: "images/drinkingCinna.gif",},
    "3": {good: "sleeping", bad: "sleepy", value: 100, inc: 100, dec: 10, time: 10, exp: 10, img: "images/sleepingCinna.gif",},
    "4": {good: "taking a bath", bad: "dirty", value: 100, inc: 100, dec: 10, time: 8, exp: 10, img: "images/bathCinna.gif",},
    "5": {good: "having fun", bad: "bored", value: 100, inc: 20, dec: 5, time: 5, exp: 25, img: "images/skatingCinna.gif",},
}

const PET_DESC = {
    "1": "happiness",
    "2": "hunger",
    "3": "energy",
    "4": "clean",
    "5": "fun",
}

const LEVEL_EXP = {
    "1": 100,
    "2": 200,
    "3": 300,
    "4": 400,
    "5": 500,
}

const SOUNDS = {
    "1": "https://epsilon.vgmsite.com/soundtracks/animal-crossing-k.k.-slider-complete-songs-collection/fftixgzsli/2-89%20Bubblegum%20K.K.%20%28Radio%29.mp3",
    "-1": "https://epsilon.vgmsite.com/soundtracks/animal-crossing-k.k.-slider-complete-songs-collection/ponoeqydxl/2-95%20Farewell%20%28Radio%29.mp3",
    "2": "https://epsilon.vgmsite.com/soundtracks/animal-crossing-k.k.-slider-complete-songs-collection/cmakslxqel/2-71%20K.K.%20Metal%20%28Radio%29.mp3",
}

/*----- state variables -----*/
let petName = "Cinnamoroll";
let level;
let exp;
let isStatsGood;
let isPetAlive;
let isWinner;
let isActionHappening;
let intervalIds = [];
let easterEggTimeout;

/*----- cached elements  -----*/
const messageEl = document.querySelector("h3");
const resetBtn = document.querySelector("#resetBtn");
const audio = document.getElementById("bgPlayer");
const audioBtn = document.getElementById("bgMusic");
const bgImg = document.getElementById("petBackground");
const petImg = document.getElementById("overlayCinna");
const images = document.getElementById("imageContainer");
const gameOver = document.getElementById("gameOverImg");
const hoverSound = document.getElementById("hoverSound");
const buttonsContainer = document.getElementById("buttonsContainer");
const buttons = document.querySelectorAll("button");

/*----- event listeners -----*/
resetBtn.addEventListener("click", init);
audioBtn.addEventListener("click", handleMusic)
buttonsContainer.addEventListener("click", function(evt) {
    const button = evt.target;
    if (button.classList.contains("actionBtn") && !isActionHappening && isPetAlive && !isWinner) handleAction(evt);
});

buttons.forEach(button => {
    button.addEventListener("mouseenter", () => {
        if (!audio.paused) {
            hoverSound.volume = "0.075";
            hoverSound.currentTime = 0;
            hoverSound.play();
        }
    });
});

/*----- functions -----*/
init();

function init() {
    clearTimeout(easterEggTimeout);
    PET_STATES[1].value = 90;
    PET_STATES[2].value  = 100;
    PET_STATES[3].value  = 80;
    PET_STATES[4].value  = 100;
    PET_STATES[5].value  = 75;
    level = 1;
    exp = 0;
    isStatsGood = true;
    isPetAlive = true;
    isWinner = false;
    isActionHappening = false;
    decPetStat();
    bgImg.src = "images/pet-background.jpg";
    petImg.src = "images/defaultCinna.gif";
    petImg.style.display = "block";
    images.style.filter = "";
    gameOver.style.display = "none";
    playAudio(SOUNDS[1]);

    render();
}

function render() {
    checkPetAlive();
    renderPet();
    renderMessage();
    renderControls();
    renderPetStats();
}

function renderPet() {
    let imgSrc = "images/defaultCinna.gif";
    if (!isPetAlive) {
        imgSrc = "images/cryingCinna.gif";
        images.style.filter = "brightness(0.5)";
        gameOver.style.display = "block";
        playAudio(SOUNDS[-1]);
    } else if (isWinner) {
        imgSrc = "images/levelupCinna.gif"
    } else if (!isStatsGood && !isActionHappening) imgSrc = "images/sadCinna.gif";
    petImg.src = imgSrc;
}

function renderMessage() {
    let petStatus = getPetStatus();
    if (!isPetAlive) messageEl.innerHTML = `You neglected ${petName}! They ran away from home!`;
    else if (isWinner) {
        messageEl.innerHTML = `You're a great owner! ${petName} evolved! You win!`
        winEasterEgg();
    } else messageEl.innerHTML = `${petName} is ${petStatus}!!`
}

function renderControls() {
    if (!isPetAlive) resetBtn.innerHTML = "PLAY AGAIN";
    else resetBtn.innerHTML = "RESTART"; //add start -> restart -> play again
}

function renderPetStats() {
    Object.keys(PET_DESC).forEach(key => {
        const cellId = `stat${key}`;
        const cellElement = document.getElementById(cellId);
        cellElement.innerHTML = `${PET_DESC[key].toUpperCase()}: ${PET_STATES[key].value}`;
    });

    const cellId = "petLevel";
    const cellElement = document.getElementById(cellId);
    cellElement.innerHTML = `Level: ${getPetLevel()}`;
}

function getPetStatus() {
    if (PET_STATES[1].value >= 40 && PET_STATES[2].value >= 40 && PET_STATES[3].value >= 40 && PET_STATES[4].value >= 40 && PET_STATES[5].value >= 40) {
        isStatsGood = true;
        return "happy";
    }
    
    let strArr = [];
    Object.keys(PET_STATES).forEach(key => {
        if (PET_STATES[key].value < 40) {
            strArr.push(PET_STATES[key].bad);
            isStatsGood = false;
        }
    });

    if (strArr.length === 1) return strArr[0];

    let petStr = "";
    for (let i = 0; i < strArr.length; i++) {
        if (i === strArr.length - 1) petStr = petStr.concat("and ", strArr[i]);
        else petStr = petStr.concat(strArr[i], ", ");
    }
    return petStr;
}

function getPetLevel() {
    if (LEVEL_EXP[level] <= exp) {
        level++;
        if (level === 5) {
            isWinner = true;
            render();
        }
    }
    return level;
}

function decPetStat() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];

    Object.keys(PET_STATES).forEach(key => {
        const dec = PET_STATES[key].dec;
        const sec = PET_STATES[key].time;
        const intervalId = setInterval(() => {
            if (!isActionHappening && isPetAlive && !isWinner) {
                PET_STATES[key].value =  PET_STATES[key].value - dec <= 0 ? 0 : PET_STATES[key].value - dec;
                render();
            }
        }, sec * 1000);
        intervalIds.push(intervalId);
    });
}

function checkPetAlive() {
    if (PET_STATES[1].value <= 0 || PET_STATES[2].value <= 0 || PET_STATES[3].value <= 0 || PET_STATES[4].value <= 0 || PET_STATES[5].value <= 0) {
        isPetAlive = false;
    }
}

function playAudio(src) {
    let isAudioPaused = audio.paused;
    audio.src = src;
    if (!isAudioPaused) {
        audio.play();
    }
}

function handleMusic() {
    if (audio.paused) {
        audio.volume = 0.1;
        audio.play();
        audioBtn.innerHTML = "MUSIC: ON";
    } else {
        audio.pause();
        audioBtn.innerHTML = "MUSIC: OFF";
    }
}

function handleAction(evt) {
    isActionHappening = true;
    const button = evt.target;
    const actionId = button.id;

    const key = parseInt(actionId.charAt(6));
    PET_STATES[key].value = PET_STATES[key].value + PET_STATES[key].inc > 100 ? 100 : PET_STATES[key].value + PET_STATES[key].inc;
    exp += PET_STATES[key].exp;
    petImg.src = PET_STATES[key].img;
    messageEl.innerHTML = `${petName} is ${PET_STATES[key].good}!!`;
    if (key === 3) images.style.filter = "brightness(0.5)";
    setTimeout(() => {
        isActionHappening = false;
        render();
        images.style.filter = "";
    }, 5000);
}

function winEasterEgg() {
    easterEggTimeout = setTimeout(() => {
        bgImg.src = "images/buffCinna.gif";
        petImg.style.display = "none";
        playAudio(SOUNDS[2]);

        Object.keys(PET_STATES).forEach(key => {
            PET_STATES[key].value = 9999;
        });

        render();
    }, 10000)
}