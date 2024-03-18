/*----- constants -----*/
const PET_STATES = {
    "1": {good: "happy", bad: "unhappy", value: 100, inc: 15, dec: 5, time: 4, img: "/images/happyCinna.gif"},
    "2": {good: "full", bad: "hungry", value: 100, inc: 25, dec: 10, time: 6},
    "3": {good: "well-rested", bad: "sleepy", value: 100, inc: 100, dec: 10, time: 10},
    "4": {good: "clean", bad: "dirty", value: 100, inc: 100, dec: 10, time: 8},
    "5": {good: "having fun", bad: "bored", value: 100, inc: 20, dec: 5, time: 5},
}

const PET_DESC = {
    "1": "happiness",
    "2": "hunger",
    "3": "energy",
    "4": "clean",
    "5": "fun",
}

/*----- state variables -----*/
let petName = "Cinnamoroll";
let level;
let isPetAlive;
let isActionHappening;
let intervalIds = [];

/*----- cached elements  -----*/
const messageEl = document.querySelector("h3");
const resetBtn = document.querySelector("#resetBtn");
const audio = document.getElementById("bgPlayer");
const petImg = document.getElementById("overlayCinna");
const images = document.getElementById("imageContainer")

/*----- event listeners -----*/
resetBtn.addEventListener("click", init);
document.getElementById("buttonsContainer").addEventListener("click", function(evt) {
    const button = evt.target;
    if (button.classList.contains("actionBtn")) handleAction(evt);
});

/*----- functions -----*/
init();
audio.volume = 0.10;

function init() {
    PET_STATES[1].value = 100;
    PET_STATES[2].value  = 100;
    PET_STATES[3].value  = 80;
    PET_STATES[4].value  = 100;
    PET_STATES[5].value  = 100;
    level = 1;
    isPetAlive = true;
    isActionHappening = false;
    decPetStat();
    petImg.src = "/images/defaultCinna.gif";
    images.style.filter = "";

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
    } 
    else if (PET_STATES[1].value < 40 && !isActionHappening) imgSrc = "/images/sadCinna.gif";
    petImg.src = imgSrc;
}

function renderMessage() {
    //change message about pet
    if (PET_STATES[1].value > 40) messageEl.innerHTML = `${petName} is ${PET_STATES[1].good} !!`;
    if (PET_STATES[1].value < 40 && !isActionHappening) {
        messageEl.innerHTML = `${petName} is ${PET_STATES[1].bad} !!`;
    }
    if (!isPetAlive) messageEl.innerHTML = `You neglected ${petName}! They ran away from home!`;
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
    cellElement.innerHTML = `Level: ${level}`;
}

function decPetStat() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];

    Object.keys(PET_STATES).forEach(key => {
        const dec = PET_STATES[key].dec;
        const sec = PET_STATES[key].time;
        const intervalId = setInterval(() => {
            if (!isActionHappening && isPetAlive) {
                PET_STATES[key].value -= dec;
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

function handleAction(evt) {
    isActionHappening = true;
    const button = evt.target;
    const actionId = button.id;

    const key = parseInt(actionId.charAt(6));
    PET_STATES[key].value = PET_STATES[key].value + PET_STATES[key].inc > 100 ? 100 : PET_STATES[key].value + PET_STATES[key].inc;
    petImg.src = PET_STATES[key].img;
    setTimeout(() => {
        isActionHappening = false;
        render();
    }, 5000);
}