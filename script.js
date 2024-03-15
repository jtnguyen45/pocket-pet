/*----- constants -----*/
const PET_STATES_GOOD = {
    "1": "happy",
    "2": "full",
    "3": "well-rested",
    "4": "clean",
    "5": "having fun",
}

const PET_STATES_BAD = {
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
let happiness;
let hunger;
let energy;
let clean;
let fun;
let level;

/*----- cached elements  -----*/
const messageEl = document.querySelector("h3");
const audio = document.getElementById("bgPlayer");

/*----- event listeners -----*/


/*----- functions -----*/
init();
audio.volume = 0.15;

function init() {
    happiness = 100;
    hunger = 100;
    energy = 100;
    clean = 100;
    fun = 100;
    level = 1;

    render();
}

function render() {
    //renderPet();
    //renderMessage();
    renderPetStats();
    //renderControls();
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