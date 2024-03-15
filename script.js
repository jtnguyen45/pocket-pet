/*----- constants -----*/
const PET_STATES = {
    "1": {good: "happy", bad: "unhappy"},
    "2": {good: "full", bad: "hungry"},
    "3": {good: "well-rested", bad: "sleepy"},
    "4": {good: "clean", bad: "dirty"},
    "5": {good: "having fun", bad: "bored"},
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
let happiness;
let hunger;
let energy;
let clean;
let fun;
let level;
let isPetAlive;
let isActionHappening;

/*----- cached elements  -----*/
const messageEl = document.querySelector("h3");
const resetBtn = document.querySelector("#resetBtn");
const audio = document.getElementById("bgPlayer");
const petImg = document.getElementById("overlayCinna");
const bgImg = document.getElementById("petBackground");

/*----- event listeners -----*/
resetBtn.addEventListener("click", init);
document.getElementById("action1").addEventListener("click", handleHappiness)

/*----- functions -----*/
init();
audio.volume = 0.10;

function init() {
    happiness = 100;
    hunger = 100;
    energy = 100;
    clean = 100;
    fun = 100;
    level = 1;
    isPetAlive = true;
    isActionHappening = false;
    decPetStat();
    petImg.src = "/images/defaultCinna.gif";

    render();
}

function render() {
    renderPet();
    renderMessage();
    renderControls();
    renderPetStats();
}

function renderPet() {
    let imgSrc = "/images/defaultCinna.gif";
    if (happiness <= 0) imgSrc = "/images/cryingCinna.gif";
    else if (happiness < 40 && !isActionHappening) imgSrc = "/images/sadCinna.gif";
    petImg.src = imgSrc;
}

function renderMessage() {
    //change message about pet
    if (happiness > 40) messageEl.innerHTML = `${petName} is ${PET_STATES[1].good} !!`;
    if (happiness < 40 && !isActionHappening) {
        messageEl.innerHTML = `${petName} is ${PET_STATES[1].bad} !!`;
    }
}

function renderControls() {
    if (!isPetAlive) resetBtn.innerHTML = "PLAY AGAIN";
    else resetBtn.innerHTML = "RESTART"; //add start -> restart -> play again
}

function renderPetStats() {
    Object.keys(PET_DESC).forEach(key => {
        const cellId = `stat${key}`;
        const cellElement = document.getElementById(cellId);
        cellElement.innerHTML = `${PET_DESC[key].toUpperCase()}: ${getPetState(parseInt(key))}`;
    });

    const cellId = "petLevel";
    const cellElement = document.getElementById(cellId);
    cellElement.innerHTML = `Level: ${level}`;
}

function getPetState(key) {
    switch (key) {
        case 1:
            return happiness;
        case 2:
            return hunger;
        case 3:
            return energy;
        case 4:
            return clean;
        case 5:
            return fun;
        default:
            return "";
    }
}

function decPetStat() {
    setInterval(() => {
        if (happiness !== 0 && !isActionHappening){
            happiness -= 5;
            render();
        }
    }, 4000);
}

function handleHappiness() {
    isActionHappening = true;
    petImg.src = "/images/happyCinna.gif";
    happiness = happiness > 80 ? 100 : happiness += 15;
    //render();
    setTimeout(() => {
        petImg.src = happiness >= 40 ? "/images/defaultCinna.gif" : "images/sadCinna.gif";
        isActionHappening = false;
        render();
    }, 5000);
}