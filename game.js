const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 320;
canvas.height = 480;

let bird, pipes, frame, score, gameRunning;

function resetGame() {
    bird = {
        x: 50,
        y: 150,
        width: 20,
        height: 20,
        gravity: 0.1,
        lift: -3,
        velocity: 0
    };
    pipes = [];
    frame = 0;
    score = 0;
    gameRunning = true;
}

resetGame();

document.addEventListener('keydown', () => {
    if (gameRunning) {
        bird.velocity = bird.lift;
    }
});

document.addEventListener('click', (event) => {
    if (!gameRunning && event.clientX >= canvas.width / 2 - 50 && event.clientX <= canvas.width / 2 + 50 && event.clientY >= canvas.height / 2 + 20 && event.clientY <= canvas.height / 2 + 50) {
        resetGame();
        gameLoop();
    } else if (gameRunning) {
        bird.velocity = bird.lift;
    }
});

document.addEventListener('touchstart', (event) => {
    if (!gameRunning && event.touches[0].clientX >= canvas.width / 2 - 50 && event.touches[0].clientX <= canvas.width / 2 + 50 && event.touches[0].clientY >= canvas.height / 2 + 20 && event.touches[0].clientY <= canvas.height / 2 + 50) {
        resetGame();
        gameLoop();
    } else if (gameRunning) {
        bird.velocity = bird.lift;
    }
});

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    });
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (frame % 90 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 50;
        pipes.push({ x: canvas.width, width: 30, top: pipeHeight, bottom: pipeHeight + 100 });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
        }
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            gameRunning = false;
        }
    });

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameRunning = false;
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function drawRestartButton() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 20, 100, 30);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText('Restart', canvas.width / 2 - 25, canvas.height / 2 + 40);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    drawScore();
    if (gameRunning) {
        update();
        frame++;
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = 'red';
        ctx.font = '20px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 50, canvas.height / 2);
        drawRestartButton();
    }
}

gameLoop();
