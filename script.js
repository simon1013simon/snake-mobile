const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth * 0.9;
let height = window.innerHeight * 0.7;
canvas.width = width;
canvas.height = height;

let cellSize = 20;
let snake = [{x: 100, y: 100}];
let direction = "RIGHT";
let foods = [];
let score = 0;
const foodCount = 5;

function resizeCanvas() {
  width = window.innerWidth * 0.9;
  height = window.innerHeight * 0.7;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener("resize", resizeCanvas);

function randomFood() {
  return {
    x: Math.floor(Math.random() * (width / cellSize)) * cellSize,
    y: Math.floor(Math.random() * (height / cellSize)) * cellSize
  };
}

function generateFoods() {
  foods = [];
  for (let i = 0; i < foodCount; i++) {
    foods.push(randomFood());
  }
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, cellSize, cellSize);
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  // draw snake
  for (let s of snake) drawRect(s.x, s.y, "lime");

  // draw food
  for (let f of foods) drawRect(f.x, f.y, "red");

  // draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function moveSnake() {
  const head = {...snake[0]};
  if (direction === "UP") head.y -= cellSize;
  else if (direction === "DOWN") head.y += cellSize;
  else if (direction === "LEFT") head.x -= cellSize;
  else if (direction === "RIGHT") head.x += cellSize;

  // wrap around screen
  if (head.x < 0) head.x = width - cellSize;
  if (head.x >= width) head.x = 0;
  if (head.y < 0) head.y = height - cellSize;
  if (head.y >= height) head.y = 0;

  // check self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    alert("Game Over! Your score: " + score);
    resetGame();
    return;
  }

  snake.unshift(head);

  // check food
  let ate = false;
  for (let f of foods) {
    if (f.x === head.x && f.y === head.y) {
      score++;
      ate = true;
      break;
    }
  }

  if (ate) generateFoods();
  else snake.pop();
}

function gameLoop() {
  moveSnake();
  draw();
}

function resetGame() {
  snake = [{x: 100, y: 100}];
  direction = "RIGHT";
  score = 0;
  generateFoods();
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

document.getElementById("up").onclick = () => { if (direction !== "DOWN") direction = "UP"; };
document.getElementById("down").onclick = () => { if (direction !== "UP") direction = "DOWN"; };
document.getElementById("left").onclick = () => { if (direction !== "RIGHT") direction = "LEFT"; };
document.getElementById("right").onclick = () => { if (direction !== "LEFT") direction = "RIGHT"; };

generateFoods();
setInterval(gameLoop, 100);
