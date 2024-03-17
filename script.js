/*----- constants -----*/
const PET_STATES = {
    "1": {good: "happy", bad: "unhappy", dec: 5, time: 4},
    "2": {good: "full", bad: "hungry", dec: 10, time: 6},
    "3": {good: "well-rested", bad: "sleepy", dec: 10, time: 10},
    "4": {good: "clean", bad: "dirty", dec: 10, time: 8},
    "5": {good: "having fun", bad: "bored", dec: 5, time: 5},
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
    energy = 80;
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
    checkPetAlive();
    renderPet();
    renderMessage();
    renderControls();
    renderPetStats();
}

function renderPet() {
    let imgSrc = "/images/defaultCinna.gif";
    if (!isPetAlive) imgSrc = "/images/cryingCinna.gif";
    else if (happiness < 40 && !isActionHappening) imgSrc = "/images/sadCinna.gif";
    petImg.src = imgSrc;
}

function renderMessage() {
    //change message about pet
    if (happiness > 40) messageEl.innerHTML = `${petName} is ${PET_STATES[1].good} !!`;
    if (happiness < 40 && !isActionHappening) {
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
    Object.keys(PET_STATES).forEach(key => {
        const dec = PET_STATES[key].dec;
        const sec = PET_STATES[key].time;
        const intervalId = setInterval(() => {
            if (!isActionHappening && isPetAlive) {
                switch (parseInt(key)) {
                    case 1:
                        happiness -= dec;
                        break;
                    case 2:
                        hunger -= dec;
                        break;
                    case 3:
                        energy -= dec;
                        break;
                    case 4:
                        clean -= dec;
                        break;
                    case 5:
                        fun -= dec;
                        break;
                    default:
                        break;
                }
                render();
            }
        }, sec * 1000);
    });
}

function checkPetAlive() {
    if (happiness <= 0 || hunger <= 0 || energy <= 0 || clean <= 0 || fun <= 0) {
        isPetAlive = false;
    }
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