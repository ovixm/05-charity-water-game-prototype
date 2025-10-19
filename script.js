// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

const actionbox = document.getElementById('action-box');

let scalingFactor = 3; // Initial scaling factor

let started = false;

const player = document.getElementById('player');
const speed = 2;
let frameWidth = 16 * scalingFactor; // Width of a single frame in the sprite sheet
let frameHeight = 16 * scalingFactor; // Height of a single frame in the sprite sheet
const totalFrames = 8; // Total number of frames in the sprite sheet
let currentFrame = 0;
let frameTick = 0; // To control the speed of animation
const ticksPerFrame = 6; // Number of update calls before switching to the next frame

let directionRow = 0; // Row in the sprite sheet for direction (0: down, 1: left, 2: right, 3: up)
let lastDirectionRow = 0; // To remember the last direction for idle state

//tilemap
const baseLayer = document.querySelector('.soil-layer');
const grassLayer = document.querySelector('.grass-layer');
const fenceLayer = document.querySelector('.fence-layer');
const houseLayer = document.querySelector('.house-layer');
const furnitureLayer = document.querySelector('.furniture-layer');
const wellLayer = document.querySelector('.well-layer');


const startBtn = document.getElementById('start-game-btn');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    const tutorial = document.getElementById('tutorial-screen');
    if (tutorial) {
      tutorial.style.display = 'none';
    }
    started = true;
  });
}

const button = document.getElementById('start-game-btn');

button.addEventListener('mousedown', () => {
  button.src = "start-button-down.png";
});

button.addEventListener('mouseup', () => {
  button.src = "start-button.png";
});

button.addEventListener('mouseleave', () => {
  button.src = "start-button.png";
});

button.addEventListener('touchstart', () => {
  button.src = "start-button-down.png";
});

button.addEventListener('touchend', () => {
  button.src = "start-button.png";
});

let currentDifficulty = 'Normal';
let switching = false;

const easySwitch = document.getElementById('easy-game-btn');
const normalSwitch = document.getElementById('normal-game-btn');
const hardSwitch = document.getElementById('hard-game-btn');

function setDifficulty(difficulty) {
  currentDifficulty = difficulty;

  easySwitch.src = currentDifficulty === 'Easy' ? "switch-on.png" : "switch-off.png";
  normalSwitch.src = currentDifficulty === 'Normal' ? "switch-on.png" : "switch-off.png";
  hardSwitch.src = currentDifficulty === 'Hard' ? "switch-on.png" : "switch-off.png";

  switching = true;
}

easySwitch.addEventListener('click', () => setDifficulty('Easy'));
easySwitch.addEventListener('touchstart', (e) => {
  e.preventDefault();
  setDifficulty('Easy');
});

normalSwitch.addEventListener('click', () => setDifficulty('Normal'));
normalSwitch.addEventListener('touchstart', (e) => {
  e.preventDefault();
  setDifficulty('Normal');
});


hardSwitch.addEventListener('click', () => setDifficulty('Hard'));
hardSwitch.addEventListener('touchstart', (e) => {
  e.preventDefault();
  setDifficulty('Hard');
});


// Tile indices based on the tileset image
// 0: empty, 1: soil, 2: water, 11-27: various grass tiles, 44: border/void tile

const baseMap = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1 , 1, 1, 2, 44, 44, 44, 44, 44, 44, 44 , 44],
  [11, -1, -1, -1, -1, -1, -1, -1, -1 , -1, -1, 27, 1, 1, 1, 1, 1, 2, 44 , 44],
  [11, -1, -1, -1, -1, -1, -1, -1, -1 , -1, -1, -1, -1, -1, -1, -1, -1, 27, 1 , 2],
  [11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, 12, 12, 12, 12 , 13],
  [11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, 12, 57, 12, 12 , 13],
  [11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, 55, 12, 12, 12 , 13],
  [11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, 12, 12, 57, 12 , 13],
  [11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, 58, 56, 12, 12 , 13],
  [11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, 12, 12, 59, 12 , 13],
  [11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 12, 57, 12, 12, 12 , 13],
  [11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 16 , 24],
  [22, 17, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 13 , 44],
  [44, 11, -1, -1, -1, -1, -1, -1, -1 , -1, -1, -1, 16, 23, 23, 23, 23, 23, 24 , 44],
  [44, 22, 23, 23, 23, 23, 23, 23, 23 , 23, 23, 23, 24, 44, 44, 44, 44, 44, 44 , 44],
];

let tileSize = 16;

// Find the center tile's row and column
const mapRows = baseMap.length;
const mapCols = baseMap[0].length;

// Each tile is 16px, but scaled by scalingFactor in CSS
let scaledTileSize = tileSize * scalingFactor;

// Calculate the map's pixel width and height
let mapPixelWidth = mapCols * scaledTileSize;
let mapPixelHeight = mapRows * scaledTileSize;

// Set the row and column you want the player to start on
const startRow = 6; // Change this to your desired row (0-based)
const startCol = 11; // Change this to your desired column (0-based)

// Calculate the pixel position for that tile
let startX = (window.innerWidth / 2) - (mapPixelWidth / 2) + (startCol * scaledTileSize);
let startY = (window.innerHeight / 2) - (mapPixelHeight / 2) + (startRow * scaledTileSize);

// Set the player's position to that tile
let x = startX;
let y = startY;

const mapContainer = document.getElementById('tilemap');

baseMap.forEach(row => {
  const tilesPerRow = 11; 
  row.forEach(tileIndex => {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    if(!(tileIndex < 0)) {
    const x = (tileIndex % tilesPerRow) * tileSize;
    const y = Math.floor(tileIndex / tilesPerRow) * tileSize;
    tile.style.backgroundPosition = '-'+x+'px -'+y+'px';
    }
    else {
      tile.style.background = 'transparent'; // Empty tile
    }

    baseLayer.appendChild(tile);
  });
}
)


const grassMap = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1 , 1, 1, 2, 44, 44, 44, 44, 44, 44, 44 , 44],
  [11, 57, 12, 12, 12, 12, 12, 56, 12 , 12, 12, 27, 1, 1, 1, 1, 1, 2, 44 , 44],
  [11, 12, 12, 12, 12, 12, 12, 12, 12 , 57, 60, 12, 12, 12, 60, 12, 12, 27, 1 , 2],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 57, 16, 23, 23, 23, 17 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 57, 12, 58, 12, 12, 13, -2, -2, -2, 11 , 13],
  [11, 12, 12, 12, 12, 55, 12, 12, 12, 12, 12, 12, 56, 12, 13, -2, -2, -2, 11 , 13],
  [11, 12, 12, 55, 12, 12, 12, 57, 12, 56, 12, 12, 12, 12, 13, -2, -2, -2, 11 , 13],
  [11, 55, 12, 12, 12, 55, 60, 12, 12, 12, 55, 12, 12, 12, 13, -2, -2, -2, 11 , 13],
  [11, 12, 12, 56, 12, 57, 12, 12, 55, 12, 12, 60, 12, 12, 13, -2, -2, -2, 11 , 13],
  [11, 57, 12, 12, 12, 12, 57, 12, 55, 60, 12, 12, 56, 12, 27, 1, 1, 1, 28 , 13],
  [11, 60, 12, 55, 56, 12, 55, 12, 56, 12, 12, 59, 12, 12, 56, 12, 12, 12, 16 , 24],
  [22, 17, 57, 12, 12, 12, 56, 12, 12, 56, 12, 12, 12, 12, 57, 12, 12, 57, 13 , 44],
  [44, 11, 12, 57, 55, 12, 57, 12, 12 , 12, 56, 12, 16, 23, 23, 23, 23, 23, 24 , 44],
  [44, 22, 23, 23, 23, 23, 23, 23, 23 , 23, 23, 23, 24, 44, 44, 44, 44, 44, 44 , 44],
];

grassMap.forEach(row => {
  const tilesPerRow = 11; 
  row.forEach(tileIndex => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
  

    if(!(tileIndex < 0)) {
    const x = (tileIndex % tilesPerRow) * tileSize;
    const y = Math.floor(tileIndex / tilesPerRow) * tileSize;
    tile.style.backgroundPosition = '-'+x+'px -'+y+'px';
    }
    else {
      tile.style.background = 'transparent'; // Empty tile
    }

    grassLayer.appendChild(tile);
  });
}
)

const fenceMap = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 1, 7, 4, 35, 35, 35, 35, 7, 35, 3, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 11, -1, -1, -1, -1, -1, -1, -1, -1, 11, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 11, -1, -1, -1, -1, -1, -1, -1, -1, 11, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 11, -1, -1, -1, -1, -1, -1, -1, -1, 11, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 23, 4, 7, 7, 35, 4, 35, 35, 7, 25, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

fenceMap.forEach(row => {
  const tilesPerRow = 11; 
  row.forEach(tileIndex => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
  
    if(!(tileIndex < 0)) {
    const x = (tileIndex % tilesPerRow) * tileSize;
    const y = Math.floor(tileIndex / tilesPerRow) * tileSize;
    tile.style.backgroundPosition = '-'+x+'px -'+y+'px';
    }
    else {
      tile.style.background = 'transparent'; // Empty tile
    }

    fenceLayer.appendChild(tile);
  });
}
)

const houseMap = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 0, 1, 1, 1, 1, 1, 1, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 5, 6, 6, 6, 6, 6, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 5, 6, 6, 6, 6, 6, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 5, 6, 6, 6, 6, 6, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 10, 11, 21, 6, 6, 23, 11, 12, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

houseMap.forEach(row => {
  const tilesPerRow = 5; 
  row.forEach(tileIndex => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
  
    if(!(tileIndex < 0)) {
    const x = (tileIndex % tilesPerRow) * tileSize;
    const y = Math.floor(tileIndex / tilesPerRow) * tileSize;
    tile.style.backgroundPosition = '-'+x+'px -'+y+'px';
    }
    else {
      tile.style.background = 'transparent'; // Empty tile
    }

    houseLayer.appendChild(tile);
  });
}
)

const furnitureMap = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 11, 34, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 19, 6, 6, 22, 30, 23, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 6, 6, 6, 6, 6, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 6, 6, 6, 6, 6, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, 52, 53, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

furnitureMap.forEach(row => {
  const tilesPerRow = 9; 
  row.forEach(tileIndex => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
  
    if(!(tileIndex < 0)) {
    const x = (tileIndex % tilesPerRow) * tileSize;
    const y = Math.floor(tileIndex / tilesPerRow) * tileSize;
    tile.style.backgroundPosition = '-'+x+'px -'+y+'px';
    }
    else {
      tile.style.background = 'transparent'; // Empty tile
    }

    furnitureLayer.appendChild(tile);
  });
}
)

const wellMap = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 3, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

wellMap.forEach(row => {
  const tilesPerRow = 2; 
  row.forEach(tileIndex => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
  
    if(!(tileIndex < 0)) {
    const x = (tileIndex % tilesPerRow) * tileSize;
    const y = Math.floor(tileIndex / tilesPerRow) * tileSize;
    tile.style.backgroundPosition = '-'+x+'px -'+y+'px';
    }
    else {
      tile.style.background = 'transparent'; // Empty tile
    }

    wellLayer.appendChild(tile);
  });
}
)

//game state
let day = 1;
let health = 50;
let crops = 50;
let animals = 50;
let wateravalible = 6;
let barrelBuilt = false;

let isSleeping = false;

let actionsDone = {
  drink: false,
  waterCrops: false,
  feedAnimals: false,
}

const dayE1 = document.getElementById('daytracker');
const waterE1 = document.getElementById('water');
const healthE1 = document.getElementById('health');
const cropsE1 = document.getElementById('crops');
const animalsE1 = document.getElementById('animals');

let currentAction = null;

let min = 5;
let max = 6;

let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;

//action box popup

const plant = document.getElementById('plants');
let currentFramePlant = 0;

let grown = false;

function updatePlant() {
  if (isSleeping && actionsDone.waterCrops) 
  {
    if((day == 1 || day == 3 || day == 5 || day == 7) && !grown) {
      currentFramePlant++;
      grown = true;
    }
  }
  
  const bgX = -currentFramePlant * 48;
  plant.style.backgroundPosition = `${bgX}px 0`;
}

const SLEEP_MS = 3000;
const FADE_MS = 500;  

function startSleeping() {
  if (isSleeping) return;
  isSleeping = true;
  setTimeout(() => {
      isSleeping = false;
      grown = false;
  }, SLEEP_MS);
}

function triggerDayFade() {
  const fadeScreen = document.getElementById('fade-screen');
  if (!fadeScreen) return;

  const holdMs = Math.max(0, SLEEP_MS - FADE_MS * 2);

  fadeScreen.classList.add("fade-out");

  setTimeout(() => {
    fadeScreen.classList.remove("fade-out");
    fadeScreen.classList.add("fade-in");

    setTimeout(() => {
      fadeScreen.classList.remove("fade-in");
    }, FADE_MS);

  }, FADE_MS + holdMs);
}
    

function updateStatus()
{
  for (const key of Object.keys(actionsDone)) {
    if (!actionsDone[key]) {
      switch (key) {
        case 'waterCrops':
          crops -= 10;
          break;
        case 'drink':
          health -= 10;
          break;
        case 'feedAnimals':
          animals -= 10;
          break;
      }
    }
    actionsDone[key] = false;
  }

  randomInt = Math.floor(Math.random() * (max - min + 1)) + min;

  if(barrelBuilt) {
    document.getElementById('barrel').style.backgroundPosition = `0 0`;
    wateravalible = randomInt;
  } 
  else {
    wateravalible = randomInt - 1;
  }

  dayE1.textContent = 'DAY ' + day;
  healthE1.textContent = 'HEALTH: ' + health;
  cropsE1.textContent = 'PLANTS: ' + crops;
  animalsE1.textContent = 'ANIMALS: ' + animals;

}

let eKeyPressed = false;
let actionOn = false;

function triggerAction(message) {
  actionbox.style.display = 'block';
  actionbox.textContent = message;
  actionOn = true;  
}

function performAction()
{
  eKeyPressed = true;

    switch(currentAction) {
      case 'crops':
        if ((wateravalible - 3) < 0 || actionsDone.waterCrops) {
          return;
        }
        startWatering();
        crops += 10;
        actionsDone.waterCrops = true;
        wateravalible -= 3;
        currentAction = null;
        break;

      case 'water':
        if ((wateravalible - 2) < 0 || actionsDone.drink) {
          return;
        }
        health += 10;
        actionsDone.drink = true;
        wateravalible -= 2;
        currentAction = null;
        break;

      case 'animals': 
        if((wateravalible - 3) < 0 || actionsDone.feedAnimals)
        {
          return;
        }
        startFeedingCow();
        animals += 10;
        actionsDone.feedAnimals = true;
        wateravalible -= 3;
        currentAction = null;
      break;

      case 'sleep':
        // Start sleeping now and schedule end-of-day after the sleep duration.
        currentAction = null;
        triggerDayFade();
        startSleeping();
        // Wait for the same duration as startSleeping before advancing day and applying updateStatus
        setTimeout(() => {
          day++;
          updateStatus();
        }, SLEEP_MS);
      break;

      case 'barrel':
        if((wateravalible - 4) < 0 || barrelBuilt)
        {
          return;
        }
        barrelBuilt = true;
        wateravalible -=4;
        currentAction = null;
      break;
    }

    waterE1.textContent = 'WATER: ' + wateravalible;
  }


document.addEventListener('keydown', function(event) {
  if(event.key == 'e' || event.key == 'E' && !eKeyPressed && actionOn)
  {
    performAction();
  }
  });

  document.addEventListener('click', () => {
  {
    if(!eKeyPressed && actionOn)
    {
      eKeyPressed = true;
      performAction();
    }
  }
  });

  document.addEventListener('touchend', () => {
    eKeyPressed = false;
  });

document.addEventListener('keyup', function(event) {
  if(event.key == 'e' || event.key == 'E')
  {
    eKeyPressed = false;
  }
});

function endTrigger(){
  actionbox.style.display = 'none';
  actionOn = false;
}

//keyboard input

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

const keyMap = {
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right',
    'arrowup': 'up',
    'arrowdown': 'down',
    'arrowleft': 'left',
    'arrowright': 'right'
};

function checkMobile() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const mobileControls = document.getElementById('mobile-controls');
  if (isMobile) {
    mobileControls.style.display = 'block';
  } else {
    mobileControls.style.display = 'none';
  }
}
checkMobile();

function bindTouchButton(button, keyCode) {
  const btn = document.getElementById(button);

  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
  keyMap[keyCode] && (keys[keyMap[keyCode]] = true);
  });

  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
  keyMap[keyCode] && (keys[keyMap[keyCode]] = false);
  } );
}
document.addEventListener('keydown', (e) => {
  const direction = keyMap[e.key.toLowerCase()];
    if (direction) {
        keys[direction] = true;
    }
});

document.addEventListener('keyup', (e) => {
  const direction = keyMap[e.key.toLowerCase()];
    if (direction) {
        keys[direction] = false;
    }
});

bindTouchButton('up-btn', 'w');
bindTouchButton('down-btn', 's');
bindTouchButton('left-btn', 'a');
bindTouchButton('right-btn', 'd');

// Bind E button for action on mobile
const eBtn = document.getElementById('e-btn');
if (eBtn) {
  // When the E button is touched or clicked, perform the action if available
  eBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (!eKeyPressed && actionOn) {
      performAction();
    }
  });
  eBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (!eKeyPressed && actionOn) {
      performAction();
    }
  });
}

function getMovementDirection() {
  if (keys.up) return 'up';
  if (keys.down) return 'down';
  if (keys.left) return 'left';
  if (keys.right) return 'right';
  return null;
}

function directionToRow(direction, isIdle = false) {
  const directionMap = {
    'down': isIdle ? 0 : 4,
    'left': isIdle ? 3 : 7,
    'right': isIdle ? 2 : 6,
    'up': isIdle ? 1 : 5
  };  
  return directionMap[direction] || 0;
}

function updateDirection() {
  if (keys.up) directionRow = 5;
  else if (keys.down) directionRow = 4;
  else if (keys.left) directionRow = 7;
  else if (keys.right) directionRow = 6;
  
  if (keys.up || keys.down || keys.left || keys.right) {
    lastDirectionRow = directionRow;
  }
}

//watering plants
let isWatering = false;

function startWatering() {
    isWatering = true;
    setTimeout(() => {
        isWatering = false;
    }, 3000); // Watering animation lasts for 3 seconds
}

function updateSprite(isIdle) {
    frameTick++;
    if (frameTick >= ticksPerFrame) {
      currentFrame = (currentFrame + 1) % totalFrames;
      frameTick = 0;
    }
  

  let row = directionToRow(lastDirectionRow, isIdle);
  if (isWatering) {
    startWatering();
    row = (directionToRow(lastDirectionRow, isIdle) % 4) + 20; // Assuming rows 20-23 are the watering animation rows
  }
  const bgX = -currentFrame * frameWidth;
  const bgY = -row * frameHeight;
  player.style.backgroundPosition = `${bgX}px ${bgY}px`;
}

const solidTiles = [0, 2, 11, 13, 16, 17, 23, 24, 44];
const fenceTiles = [1,3,4,7,11, 25,35, 23];
const houseTiles = [0, 1, 2, 5, 7, 10, 11, 12, 21, 23];
const furnitureTiles = [11, 19, 30, 22, 23, 24, -3];
const wellTiles = [0,1,2,3];
const gardenTiles = [-2];

function isColliding(nextX, nextY) {

  let hitboxSize = 16 * scalingFactor;
  let offset = (48 * scalingFactor - hitboxSize) / 2;

  const hitboxLeft = nextX + offset;
  const hitboxTop = nextY + offset;


    // Calculate which tile(s) the hitbox would be over
  const tilemapRect = mapContainer.getBoundingClientRect();
  const mapLeft = tilemapRect.left + window.scrollX;
  const mapTop = tilemapRect.top + window.scrollY;

  // Convert hitbox position to tile coordinates
  const tileX = Math.floor((hitboxLeft - mapLeft) / (tileSize * 3));
  const tileY = Math.floor((hitboxTop - mapTop) / (tileSize * 3));


  // Check all four corners of the hitbox
  const corners = [
    [tileX, tileY],
    [tileX + Math.floor(hitboxSize / (tileSize * 3)), tileY],
    [tileX, tileY + Math.floor(hitboxSize / (tileSize * 3))],
    [tileX + Math.floor(hitboxSize / (tileSize * 3)), tileY + Math.floor(hitboxSize / (tileSize * 3))]
  ];

  let isBlocked = false;
  let actionTriggered = false;

  for (let [cx, cy] of corners) {
    if (
      cy < 0 || cy >= baseMap.length ||
      cx < 0 || cx >= baseMap[0].length)
      { isBlocked = true;
        continue;
      } // Out of bounds is solid
    if (
      solidTiles.includes(baseMap[cy][cx])
    )
    {
      return true;
    }
    if (fenceTiles.includes(fenceMap[cy][cx]))
    {
      currentAction = 'animals';
      triggerAction( '[E] Feed Animals? 3 💧');
      actionTriggered = true;
      isBlocked = true;
    }
    if( houseTiles.includes(houseMap[cy][cx] ))
    {
      isBlocked = true
    }
    if( furnitureTiles.includes(furnitureMap[cy][cx] ))
    {
      if (furnitureMap[cy][cx] == 19)
      {
        currentAction = 'sleep';
        triggerAction('[E] Sleep?');
        actionTriggered = true;
        isBlocked = true;
      }

      if (furnitureMap[cy][cx] == -3) {
        currentAction = 'barrel';
        if(!barrelBuilt && currentDifficulty !== 'Hard') {
        triggerAction('[E] Build Barrel? 4 💧');
        }
        actionTriggered = true;
      }
      isBlocked = true;
    }
    if( wellTiles.includes(wellMap[cy][cx] ))
    {
      currentAction = 'water';
      triggerAction('[E] Drink Water? 2 💧');
      actionTriggered = true;
      isBlocked = true;
    }
    if( gardenTiles.includes(grassMap[cy][cx]))
    {
      currentAction = 'crops';
      triggerAction('[E] Water Crops? 3 💧')
      actionTriggered = true;
    }
  }
  if (!actionTriggered) endTrigger();
  
  
  return isBlocked;
}


function updatePosition() {

  let moveDir = getMovementDirection();

  if (isWatering || !started || isSleeping) {
    moveDir = null; // Prevent movement while watering
  }
  
  let nextX = x;
  let nextY = y;

  if (moveDir) {
    switch (moveDir) {
      case 'up':
        nextY -= speed;
        break;
      case 'down':
        nextY += speed;
        break;
      case 'left':
        nextX -= speed;
        break;
      case 'right':
        nextX += speed;
        break;
    }
    lastDirectionRow = moveDir;
  }

  if (!isColliding(nextX, nextY)) {
    x = nextX;
    y = nextY;
  }
    
    // Ensure the player stays within the bounds of the window
    x = Math.max(0, Math.min(window.innerWidth - player.offsetWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - player.offsetHeight, y));

    player.style.left = x + 'px';
    player.style.top = y + 'px';

    return !!moveDir;
}


//feeding cow animation
const cow = document.getElementById('cow');
let frameWidthCow = 32; // Width of a single frame in the sprite sheet
let frameHeightCow = 32; // Height of a single frame in the sprite sheet
const totalFramesCow = 6; // Total number of frames in the sprite sheet
let currentFrameCow = 0;
let frameTickCow = 0; // To control the speed of animation
const ticksPerFrameCow = 12; // Number of update calls before switching to the next frame
let isFeedingCow = false;

function startFeedingCow() {
    isFeedingCow = true;
    setTimeout(() => {
        isFeedingCow = false;
    }, 3000); // Feeding animation lasts for 3 seconds
}

function updateCow() {
    frameTickCow++;
    if (frameTickCow >= ticksPerFrameCow) {
      currentFrameCow = (currentFrameCow + 1) % totalFramesCow;
      frameTickCow = 0;
    }
  

  let row = 0;

  if(isFeedingCow) {
    row = 1; // Feeding animation row
  }
  else {
    row = 0; // Idle animation row
  }

  const bgX = -currentFrameCow * frameWidthCow;
  const bgY = -row * frameHeightCow;
  cow.style.backgroundPosition = `${bgX}px ${bgY}px`;
}

function switchDifficulty() {
  if(currentDifficulty === 'Easy' && !started) {
    document.getElementById('barrel').style.backgroundPosition = `0 0`;
    barrelBuilt = true;
    min = 7;
    max = 8;

    randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    wateravalible = randomInt;
  }
  else if(currentDifficulty === 'Hard' && !started) {
    document.getElementById('barrel').style.backgroundPosition = `-48px 0`;
    barrelBuilt = false;
    min = 3;
    max = 6;

    randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    wateravalible = randomInt - 1;
  }
  else if(currentDifficulty === 'Normal' && !started) {
    document.getElementById('barrel').style.backgroundPosition = `-48px 0`;
    barrelBuilt = false;
    min = 5;
    max = 7;

    randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    wateravalible = randomInt - 1;
  }

  waterE1.textContent = 'WATER: ' + wateravalible;

  switching = false;

}
  

function gameLoop() {

  if(window.innerWidth > 1100)
  {
    scalingFactor = 3;
    frameHeight = 16 * scalingFactor;
    frameWidth = 16 * scalingFactor;
    tileSize = 16;
  }
  else if(window.innerWidth > 800)
  {
    scalingFactor = 2/3;
    frameHeight = 48 * scalingFactor;
    frameWidth = 48 * scalingFactor;
    tileSize = 10.67;
  }
  else
  {
    scalingFactor = 1/2;
    frameHeight = 48 * scalingFactor;
    frameWidth = 48 * scalingFactor;
    tileSize = 8;
  }

  const isMoving = updatePosition();

  if(started) {
    updateSprite(!isMoving);
    updateCow();
    updatePlant();
  }
  else if (!started && switching) {
    switchDifficulty();
  }
  requestAnimationFrame(gameLoop);
}

if(health > 0 && crops > 0 && animals > 0)
{
  gameLoop();
}
else {
  console.log("Game Over! One of your stats has dropped to zero.");
}