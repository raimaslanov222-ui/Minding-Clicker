const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.8;
const jumpForce = -12;
const speed = 7;
const groundY = canvas.height - 100;

let player = {
    x: 80, y: groundY - 40, w: 40, h: 40,
    dy: 0, grounded: false, rotation: 0
};

let obstacles = [];
let isPressing = false; // Для зажима
let frame = 0;

// Управление для телефона (зажим)
window.addEventListener('touchstart', () => isPressing = true);
window.addEventListener('touchend', () => isPressing = false);

function spawnLevel() {
    // Генерируем препятствие каждые 90 кадров (паркур)
    if (frame % 90 === 0) {
        let type = Math.random() > 0.5 ? 'spike' : 'block';
        obstacles.push({
            x: canvas.width,
            y: type === 'spike' ? groundY - 40 : groundY - 80,
            w: 40, h: 40, type: type
        });
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // Логика зажима (авто-прыжок)
    if (isPressing && player.grounded) {
        player.dy = jumpForce;
        player.grounded = false;
        // Звук можно добавить тут: new Audio('jump.mp3').play();
    }

    player.dy += gravity;
    player.y += player.dy;

    // Пол
    if (player.y + player.h > groundY) {
        player.y = groundY - player.h;
        player.dy = 0;
        player.grounded = true;
        player.rotation = Math.round(player.rotation / (Math.PI / 2)) * (Math.PI / 2);
    } else {
        player.rotation += 0.15;
    }

    // РИСУЕМ ПОЛ (с неоновой линией)
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();

    // РИСУЕМ КУБИК (с обводкой и глазами)
    ctx.save();
    ctx.translate(player.x + player.w/2, player.y + player.h/2);
    ctx.rotate(player.rotation);
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffcc";
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(-player.w/2, -player.h/2, player.w, player.h);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(-player.w/2, -player.h/2, player.w, player.h);
    // Глаза
    ctx.fillStyle = "black";
    ctx.fillRect(5, -10, 8, 8);
    ctx.fillRect(5, 2, 8, 8);
    ctx.restore();

    // ПРЕПЯТСТВИЯ
    spawnLevel();
    obstacles.forEach((obs, i) => {
        obs.x -= speed;
        
        ctx.shadowBlur = 0;
        if (obs.type === 'spike') {
            ctx.fillStyle = "#ff0055";
            ctx.beginPath();
            ctx.moveTo(obs.x, groundY);
            ctx.lineTo(obs.x + obs.w/2, obs.y);
            ctx.lineTo(obs.x + obs.w, groundY);
            ctx.fill();
        } else {
            ctx.fillStyle = "#333";
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
            ctx.strokeStyle = "#555";
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        }

        // Коллизия (смерть)
        if (player.x < obs.x + obs.w - 5 && player.x + player.w > obs.x + 5 &&
            player.y < obs.y + obs.h - 5 && player.y + player.h > obs.y + 5) {
            location.reload(); // Рестарт при смерти
        }

        if (obs.x < -50) obstacles.splice(i, 1);
    });

    requestAnimationFrame(update);
}

update();
