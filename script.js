/*----- constants -----*/
const PET_STATES_GOOD = {
    "1": "happy",
    "2": "full",
    "3": "well-rested",
    "4": "clean",
    "5": "having fun",
}

const PET_STATES_BAD = { //could combine states and make bad neg num
    "1": "unhappy",
    "2": "hungry",
    "3": "sleepy",
    "4": "dirty",
    "5": "bored",
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
    startPetStatDec();
    petImg.src = "/images/defaultCinna.gif";

    render();
}

function render() {
    //renderPet();
    renderMessage();
    renderControls();
    renderPetStats();
}

function renderMessage() {
    //change message about pet
    if (happiness > 40) messageEl.innerHTML = `${petName} is ${PET_STATES_GOOD[1]} !!`;
    if (happiness < 40) {
        messageEl.innerHTML = `${petName} is ${PET_STATES_BAD[1]} !!`;
        petImg.src = "/images/sadCinna.gif";
    }
}

function renderControls() {
    if (!isPetAlive) resetBtn.innerHTML = "PLAY AGAIN";
    else resetBtn.innerHTML = "RESTART"; //add start -> restart -> play again
}

function renderPetStats() {
    for (let i = 1; i < 6; i++) {
        const cellId = `stat${i}`;
        const cellElement = document.getElementById(cellId);
        cellElement.innerHTML = `${PET_DESC[i].toUpperCase()}: ${getPetState(i)}`;
    }

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

function startPetStatDec() {
    setInterval(() => {
        if (happiness !== 0 && !isActionHappening){
            happiness -= 5;
            render();
        }
    }, 3000);
}

function handleHappiness() {
    isActionHappening = true;
    happiness = happiness > 80 ? 100 : happiness += 15;
    petImg.src = "/images/happyCinna.gif";
    render();
    setTimeout(() => {
        isActionHappening = false;
        petImg.src = "/images/defaultCinna.gif";
        render();
    }, 5000);
}