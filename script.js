/*----- constants -----*/
const PET_STATES = {
    "1": "happy",
    "2": "hungry",
    "3": "sleepy",
    "4": "dirty",
    "5": "bored",
}

const PET_DESC = {
    "1": "Happiness",
    "2": "Hunger",
    "3": "Energy",
    "4": "Clean",
    "5": "Fun",
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
    //prob do a forEach -> id is "stat1", "stat2" etc
    //TODO: refactor
    // for (let i = 1; i < 6; i++) {
    //     const cellId = `stat${i}`;
    //     const cellElement = document.getElementById(cellId);
    //     cellElement.innerHTML = `${PET_DESC[i]}: ${PET_STATES}`
    // }

    const cellId1 = "stat1";
    const cellElement1 = document.getElementById(cellId1);
    cellElement1.innerHTML = `Happiness: ${happiness}`;

    const cellId2 = "stat2";
    const cellElement2 = document.getElementById(cellId2);
    cellElement2.innerHTML = `Hunger: ${hunger}`;

    const cellId3 = "stat3";
    const cellElement3 = document.getElementById(cellId3);
    cellElement3.innerHTML = `Energy: ${energy}`;

    const cellId4 = "stat4";
    const cellElement4 = document.getElementById(cellId4);
    cellElement4.innerHTML = `Clean: ${clean}`

    const cellId5 = "stat5";
    const cellElement5 = document.getElementById(cellId5);
    cellElement5.innerHTML = `Fun: ${fun}`

    const cellId6 = "petLevel";
    const cellElement6 = document.getElementById(cellId6);
    cellElement6.innerHTML = `Level: ${level}`;
}