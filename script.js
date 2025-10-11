// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

const player = document.getElementById('player');
const speed = 2;
let x = 1;
let y = 1;
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

// Tile indices based on the tileset image
// 0: empty, 1: soil, 2: water, 11-27: various grass tiles, 44: border/void tile

const baseMap = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1 , 1, 1, 2, 44, 44, 44, 44, 44, 44, 44 , 44],
  [11, 12, 12, 12, 12, 12, 12, 12, 12 , 12, 12, 27, 1, 1, 1, 1, 1, 2, 44 , 44],
  [11, 12, 12, 12, 12, 12, 12, 12, 12 , 12, 12, 12, 12, 12, 12, 12, 12, 27, 1 , 2],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16 , 24],
  [22, 17, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13 , 44],
  [44, 11, 12, 12, 12, 12, 12, 12, 12 , 12, 12, 12, 16, 23, 23, 23, 23, 23, 24 , 44],
  [44, 22, 23, 23, 23, 23, 23, 23, 23 , 23, 23, 23, 24, 44, 44, 44, 44, 44, 44 , 44],
];

const tileSize = 16;
const tilesPerRow = 11; // Number of tiles per row in the tileset image

const mapContainer = document.getElementById('tilemap');

baseMap.forEach(row => {
  row.forEach(tileIndex => {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    const x = (tileIndex % tilesPerRow) * tileSize;
    const y = Math.floor(tileIndex / tilesPerRow) * tileSize;
    tile.style.backgroundPosition = '-'+x+'px -'+y+'px';

    baseLayer.appendChild(tile);
  });
}
)



const grassMap = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1 , 1, 1, 2, 44, 44, 44, 44, 44, 44, 44 , 44],
  [11, 12, 12, 12, 12, 12, 12, 12, 12 , 12, 12, 27, 1, 1, 1, 1, 1, 2, 44 , 44],
  [11, 12, 12, 12, 12, 12, 12, 12, 12 , 12, 12, 12, 12, 12, 12, 12, 12, 27, 1 , 2],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 , 13],
  [11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16 , 24],
  [22, 17, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13 , 44],
  [44, 11, 12, 12, 12, 12, 12, 12, 12 , 12, 12, 12, 16, 23, 23, 23, 23, 23, 24 , 44],
  [44, 22, 23, 23, 23, 23, 23, 23, 23 , 23, 23, 23, 24, 44, 44, 44, 44, 44, 44 , 44],
];

grassMap.forEach(row => {
  row.forEach(tileIndex => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
  

    const x = (tileIndex % tilesPerRow) * tileSize;
    const y = Math.floor(tileIndex / tilesPerRow) * tileSize;
    tile.style.backgroundPosition = '-'+x+'px -'+y+'px';

    grassLayer.appendChild(tile);
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

function updatePosition() {

  const moveDir = getMovementDirection();

  if (moveDir) {
    switch (moveDir) {
      case 'up':
        y -= speed;
        break;
      case 'down':
        y += speed;
        break;
      case 'left':
        x -= speed;
        break;
      case 'right':
        x += speed;
        break;
    }
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