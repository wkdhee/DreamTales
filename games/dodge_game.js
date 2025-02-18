const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 플레이어 설정
const player = {
    x: 175,
    y: 450,
    width: 50,
    height: 50,
    color: "blue",
    speed: 5
};

// 장애물 설정
const obstacles = [];
const obstacleSpeed = 3;
const obstacleWidth = 50;
const obstacleHeight = 50;
let score = 0;

// 키보드 입력 처리
let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowRight") rightPressed = true;
});

document.addEventListener("keyup", function(e) {
    if (e.key === "ArrowLeft") leftPressed = false;
    if (e.key === "ArrowRight") rightPressed = false;
});

// 장애물 생성
function createObstacle() {
    let randomX = Math.floor(Math.random() * (canvas.width - obstacleWidth));
    obstacles.push({ x: randomX, y: 0, width: obstacleWidth, height: obstacleHeight, color: "red" });
}

// 플레이어 이동
function movePlayer() {
    if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

// 장애물 업데이트
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;

        // 충돌 감지 (장애물이 플레이어와 닿으면 게임 오버)
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            alert(`💥 게임 오버! 점수: ${score}`);
            document.location.reload();
        }
    }

    // 화면 밖으로 나간 장애물 제거 & 점수 증가
    while (obstacles.length > 0 && obstacles[0].y > canvas.height) {
        obstacles.shift();
        score++;
    }
}

// 화면 그리기
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 플레이어 그리기
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 장애물 그리기
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillStyle = obstacles[i].color;
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }

    // 점수 표시
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`점수: ${score}`, 10, 30);
}

// 게임 루프
function gameLoop() {
    movePlayer();
    updateObstacles();
    draw();
    requestAnimationFrame(gameLoop);
}

// 2초마다 장애물 생성
setInterval(createObstacle, 2000);

// 게임 시작
gameLoop();
