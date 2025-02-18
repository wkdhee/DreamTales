document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.addEventListener("click", startGame);
    }
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 게임 상태 변수
let gameRunning = false;
let score = 0;

// 패들 설정
const paddle = {
    width: 75,
    height: 10,
    x: (canvas.width - 75) / 2,
    speed: 7
};

// 공 설정
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 3,
    dy: -3,
    radius: 10,
    color: "red"
};

// 벽돌 설정
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // 🔥 벽돌 상태 추가 (1: 존재, 0: 깨짐)
    }
}

// 키보드 입력 처리
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") rightPressed = true;
    if (e.key === "ArrowLeft") leftPressed = true;

    if (e.key === " ") {
        e.preventDefault(); // 🔥 스페이스바 문제 해결
    }
});

document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowRight") rightPressed = false;
    if (e.key === "ArrowLeft") leftPressed = false;
});

// 게임 시작 함수
function startGame() {
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.disabled = true; // 버튼 비활성화
    }
    gameRunning = true;
    resetGame();
    gameLoop();
}

// 패들 이동
function movePaddle() {
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    }
    if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
}

// 벽돌 그리기
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) { // 🔥 벽돌이 남아있는 경우만 그리기
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.fillStyle = "green";
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

// 공 그리기
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// 패들 그리기
function drawPaddle() {
    ctx.fillStyle = "blue";
    ctx.fillRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
}

// 벽돌 충돌 감지 🔥
function checkBrickCollision() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + brickWidth &&
                    ball.y > brick.y &&
                    ball.y < brick.y + brickHeight
                ) {
                    ball.dy *= -1; // 공의 방향 변경
                    brick.status = 0; // 벽돌 제거
                    score += 10; // 점수 증가
                }
            }
        }
    }
}

// 게임 화면을 그리는 함수
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();

    // 점수 표시
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`점수: ${score}`, 10, 30);
}

// 게임 루프
function gameLoop() {
    if (!gameRunning) return;

    movePaddle();
    checkBrickCollision();

    ball.x += ball.dx;
    ball.y += ball.dy;

    // 벽 충돌 감지
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    } else if (ball.y + ball.radius > canvas.height) {
        gameOver();
    }

    // 패들 충돌
    if (
        ball.y + ball.radius > canvas.height - paddle.height &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy *= -1;
    }

    draw();
    requestAnimationFrame(gameLoop);
}

// 게임 오버
function gameOver() {
    gameRunning = false;
    alert(`💥 게임 오버! 점수: ${score}`);
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.disabled = false; // 게임 시작 버튼 다시 활성화
    }
}

// 게임 초기화
function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 3;
    ball.dy = -3;
    paddle.x = (canvas.width - paddle.width) / 2;
    
    // 벽돌 다시 생성 🔥
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
}

// 점수 저장 기능
function saveScore() {
    let playerName = document.getElementById("playerName").value;
    if (playerName === "") {
        alert("이름을 입력하세요!");
        return;
    }

    let newScore = { name: playerName, score: score };
    let scores = JSON.parse(localStorage.getItem("brick_scores")) || [];
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem("brick_scores", JSON.stringify(scores));

    updateScoreBoard();
}

// 기록된 점수 리스트 업데이트
function updateScoreBoard() {
    let scoreList = document.getElementById("scoreList");
    scoreList.innerHTML = "";
    let scores = JSON.parse(localStorage.getItem("brick_scores")) || [];

    scores.forEach((entry) => {
        let li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}점`;
        scoreList.appendChild(li);
    });
}

updateScoreBoard();
