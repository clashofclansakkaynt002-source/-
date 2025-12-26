const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");

// Налаштування поля
canvas.width = 400;
canvas.height = 400;
const gridSize = 20;

// Гравець
let player = { x: 200, y: 200, dx: gridSize, dy: 0 };
let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
highscoreElement.innerText = highscore;

// Об'єкти
let coins = [];
let bombs = [];

// Початок гри
function startGame() {
    setInterval(gameLoop, 150); // Швидкість руху
    setInterval(spawnCoin, 2000); // Нова монета кожні 2 сек
    setInterval(spawnBomb, 3000); // Нова бомба кожні 3 сек
}

function gameLoop() {
    update();
    draw();
}

function update() {
    // Рух гравця
    player.x += player.dx;
    player.y += player.dy;

    // Вихід за межі (телепортація)
    if (player.x < 0) player.x = canvas.width - gridSize;
    if (player.x >= canvas.width) player.x = 0;
    if (player.y < 0) player.y = canvas.height - gridSize;
    if (player.y >= canvas.height) player.y = 0;

    // Перевірка монет
    coins = coins.filter(coin => {
        if (player.x === coin.x && player.y === coin.y) {
            score += 10;
            scoreElement.innerText = score;
            checkHighscore();
            return false; // Видалити монету
        }
        return coin.timer > 0;
    });

    // Перевірка бомб
    bombs.forEach(bomb => {
        if (player.x === bomb.x && player.y === bomb.y) {
            gameOver();
        }
    });
    bombs = bombs.filter(bomb => bomb.timer > 0);

    // Зменшення таймерів
    coins.forEach(c => c.timer--);
    bombs.forEach(b => b.timer--);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Малюємо гравця (жовтий чоловічок/квадрат)
    ctx.fillStyle = "#3498db";
    ctx.fillRect(player.x, player.y, gridSize - 2, gridSize - 2);

    // Малюємо монети (золоті)
    ctx.fillStyle = "#f1c40f";
    coins.forEach(c => ctx.beginPath() || ctx.arc(c.x + 10, c.y + 10, 8, 0, Math.PI*2) || ctx.fill());

    // Малюємо бомби (червоні)
    ctx.fillStyle = "#e74c3c";
    bombs.forEach(b => ctx.fillRect(b.x + 4, b.y + 4, gridSize - 8, gridSize - 8));
}

function spawnCoin() {
    coins.push({
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
        timer: 40 // Пропаде через ~6 секунд
    });
}

function spawnBomb() {
    bombs.push({
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
        timer: 50 
    });
}

function checkHighscore() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        highscoreElement.innerText = highscore;
    }
}

function gameOver() {
    document.getElementById("game-over").style.display = "block";
    player.dx = 0;
    player.dy = 0;
}

// Керування
window.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && player.dy === 0) { player.dx = 0; player.dy = -gridSize; }
    if (e.key === "ArrowDown" && player.dy === 0) { player.dx = 0; player.dy = gridSize; }
    if (e.key === "ArrowLeft" && player.dx === 0) { player.dx = -gridSize; player.dy = 0; }
    if (e.key === "ArrowRight" && player.dx === 0) { player.dx = gridSize; player.dy = 0; }
});

// Кнопки для телефону
document.getElementById("btn-up").onclick = () => { if(player.dy === 0){player.dx = 0; player.dy = -gridSize;} };
document.getElementById("btn-down").onclick = () => { if(player.dy === 0){player.dx = 0; player.dy = gridSize;} };
document.getElementById("btn-left").onclick = () => { if(player.dx === 0){player.dx = -gridSize; player.dy = 0;} };
document.getElementById("btn-right").onclick = () => { if(player.dx === 0){player.dx = gridSize; player.dy = 0;} };

startGame();
