/*----- constants -----*/
const PET_STATES = {
    "1": {good: "happy", bad: "unhappy", value: 100, inc: 15, dec: 5, time: 4, exp: 20, img: "/images/happyCinna.gif"},
    "2": {good: "eating", bad: "hungry", value: 100, inc: 25, dec: 10, time: 6, exp: 15, img: "/images/drinkingCinna.gif"},
    "3": {good: "sleeping", bad: "sleepy", value: 100, inc: 100, dec: 10, time: 10, exp: 10, img: "/images/sleepingCinna.gif"},
    "4": {good: "taking a bath", bad: "dirty", value: 100, inc: 100, dec: 10, time: 8, exp: 10, img: "/images/bathCinna.gif"},
    "5": {good: "having fun", bad: "bored", value: 100, inc: 20, dec: 5, time: 5, exp: 25, img: "/images/skatingCinna.gif"},
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
}

/*----- state variables -----*/
let petName = "Cinnamoroll";
let level;
let exp;
let isStatsGood;
let isPetAlive;
let isActionHappening;
let intervalIds = [];

/*----- cached elements  -----*/
const messageEl = document.querySelector("h3");
const resetBtn = document.querySelector("#resetBtn");
const audio = document.getElementById("bgPlayer");
const audioBtn = document.getElementById("bgMusic");
const petImg = document.getElementById("overlayCinna");
const images = document.getElementById("imageContainer");
const gameOver = document.getElementById("gameOverImg");

/*----- event listeners -----*/
resetBtn.addEventListener("click", init);
audioBtn.addEventListener("click", handleMusic)
document.getElementById("buttonsContainer").addEventListener("click", function(evt) {
    const button = evt.target;
    if (button.classList.contains("actionBtn") && !isActionHappening && isPetAlive) handleAction(evt);
});

/*----- functions -----*/
init();

function init() {
    PET_STATES[1].value = 90;
    PET_STATES[2].value  = 100;
    PET_STATES[3].value  = 80;
    PET_STATES[4].value  = 100;
    PET_STATES[5].value  = 75;
    level = 1;
    exp = 0;
    isStatsGood = true;
    isPetAlive = true;
    isActionHappening = false;
    decPetStat();
    petImg.src = "/images/defaultCinna.gif";
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
    let imgSrc = "/images/defaultCinna.gif";
    if (!isPetAlive) {
        imgSrc = "/images/cryingCinna.gif";
        images.style.filter = "brightness(0.5)";
        gameOver.style.display = "block";
        playAudio(SOUNDS[-1]);
    } 
    else if (!isStatsGood && !isActionHappening) imgSrc = "/images/sadCinna.gif";
    petImg.src = imgSrc;
}

function renderMessage() {
    let petStatus = getPetStatus();
    if (!isPetAlive) messageEl.innerHTML = `You neglected ${petName}! They ran away from home!`;
    else messageEl.innerHTML = `${petName} is ${petStatus}!!`
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

    let petStr = "";
    for (let i = 0; i < strArr.length; i++) {
        if (i === strArr.length - 1) petStr = petStr.concat(strArr[i]);
        else petStr = petStr.concat(strArr[i], " and ");
    }
    return petStr;
}

function getPetLevel() {
    if (LEVEL_EXP[level] > exp) return level;
    return level++;
}

function decPetStat() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];

    Object.keys(PET_STATES).forEach(key => {
        const dec = PET_STATES[key].dec;
        const sec = PET_STATES[key].time;
        const intervalId = setInterval(() => {
            if (!isActionHappening && isPetAlive) {
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
    }
    else {
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