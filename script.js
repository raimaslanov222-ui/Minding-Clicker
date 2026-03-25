const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Адаптация под размер экрана телефона
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.6;
const jumpForce = -10;
const speed = 5;

let player = {
    x: 50,
    y: canvas.height - 100,
    w: 40,
    h: 40,
    dy: 0,
    grounded: false,
    rotation: 0
};

let obstacles = [];
let score = 0;
let isGameOver = false;

// Создание препятствия (треугольника)
function spawnObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 50,
        w: 40,
        h: 50
    });
}

// Управление тапом
window.addEventListener('touchstart', () => {
    if (player.grounded) {
        player.dy = jumpForce;
        player.grounded = false;
    }
    if (isGameOver) resetGame();
});

function resetGame() {
    player.y = canvas.height - 100;
    player.dy = 0;
    obstacles = [];
    score = 0;
    isGameOver = false;
    requestAnimationFrame(update);
}

function update() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Логика игрока
    player.dy += gravity;
    player.y += player.dy;

    // Пол
    if (player.y + player.h > canvas.height - 50) {
        player.y = canvas.height - 50 - player.h;
        player.dy = 0;
        player.grounded = true;
        player.rotation = 0; // Сброс вращения на земле
    } else {
        player.rotation += 0.15; // Вращение в прыжке
    }

    // Отрисовка пола
    ctx.fillStyle = "#333";
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Отрисовка игрока (куб)
    ctx.save();
    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
    ctx.rotate(player.rotation);
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(-player.w / 2, -player.h / 2, player.w, player.h);
    ctx.strokeStyle = "white";
    ctx.strokeRect(-player.w / 2, -player.h / 2, player.w, player.h);
    ctx.restore();

    // Препятствия
    if (Math.random() < 0.01) spawnObstacle();

    obstacles.forEach((obs, index) => {
        obs.x -= speed;

        // Отрисовка шипа (треугольник)
        ctx.fillStyle = "#ff4444";
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y + obs.h);
        ctx.lineTo(obs.x + obs.w / 2, obs.y);
        ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
        ctx.fill();

        // Проверка столкновения
        if (
            player.x < obs.x + obs.w &&
            player.x + player.w > obs.x &&
            player.y < obs.y + obs.h &&
            player.y + player.h > obs.y
        ) {
            isGameOver = true;
            alert("Игра окончена! Счет: " + Math.floor(score));
        }

        if (obs.x + obs.w < 0) obstacles.splice(index, 1);
    });

    score += 0.1;
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 40);

    requestAnimationFrame(update);
}

update();
