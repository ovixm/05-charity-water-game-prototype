// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');



const player = document.getElementById('player');
const speed = 2;
const frameWidth = 48; // Width of a single frame in the sprite sheet
const frameHeight = 48; // Height of a single frame in the sprite sheet
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
const doorLayer = document.querySelector('.door-layer');


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

const tileSize = 16;

// Find the center tile's row and column
const mapRows = baseMap.length;
const mapCols = baseMap[0].length;

// Each tile is 16px, but scaled by 3 in CSS
const scaledTileSize = tileSize * 3;

// Calculate the map's pixel width and height
const mapPixelWidth = mapCols * scaledTileSize;
const mapPixelHeight = mapRows * scaledTileSize;

// Set the row and column you want the player to start on
const startRow = 5; // Change this to your desired row (0-based)
const startCol = 8; // Change this to your desired column (0-based)

// Calculate the pixel position for that tile
const startX = (window.innerWidth / 2) - (mapPixelWidth / 2) + (startCol * scaledTileSize);
const startY = (window.innerHeight / 2) - (mapPixelHeight / 2) + (startRow * scaledTileSize);

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

function updateSprite(isIdle) {
    frameTick++;
    if (frameTick >= ticksPerFrame) {
      currentFrame = (currentFrame + 1) % totalFrames;
      frameTick = 0;
    }
  

  const row = directionToRow(lastDirectionRow, isIdle);
  const bgX = -currentFrame * frameWidth;
  const bgY = -row * frameHeight;
  player.style.backgroundPosition = `${bgX}px ${bgY}px`;
}

const solidTiles = [0, 2, 11, 13, 16, 17, 23, 24, 44];
const fenceTiles = [1,3,4,7,11, 25,35, 23];
const houseTiles = [0, 1, 2, 5, 7, 10, 11, 12, 21, 23];

function isColliding(nextX, nextY) {

  const hitboxSize = 16 * 3;
  const offset = (48 * 3 - hitboxSize) / 2;

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

  for (let [cx, cy] of corners) {
    if (
      cy < 0 || cy >= baseMap.length ||
      cx < 0 || cx >= baseMap[0].length)
      { return true; } // Out of bounds is solid
    if (
      solidTiles.includes(baseMap[cy][cx])
    )
    {
      return true;
    }
    if (fenceTiles.includes(fenceMap[cy][cx]))
    {
      return true;
    }
    if( houseTiles.includes(houseMap[cy][cx] ))
    {
      return true;
    }
  }
  return false;
}

function updatePosition() {

  const moveDir = getMovementDirection();

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
    lastDirectionRow = moveDir;
  }
    
    // Ensure the player stays within the bounds of the window
    x = Math.max(0, Math.min(window.innerWidth - player.offsetWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - player.offsetHeight, y));

    player.style.left = x + 'px';
    player.style.top = y + 'px';

    return !!moveDir;
}

function gameLoop() {
  const isMoving = updatePosition();
  updateSprite(!isMoving);
  requestAnimationFrame(gameLoop);
}



gameLoop();