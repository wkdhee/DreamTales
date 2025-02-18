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
let gameRunning = true;  // 게임 실행 여부

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
    if (gameRunning) {
        let randomX = Math.floor(Math.random() * (canvas.width - obstacleWidth));
        obstacles.push({ x: randomX, y: 0, width: obstacleWidth, height: obstacleHeight, color: "red" });
    }
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

        // 충돌 감지
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            gameOver();
        }
    }

    // 화면 밖으로 나간 장애물 제거 & 점수 증가
    while (obstacles.length > 0 && obstacles[0].y > canvas.height) {
        obstacles.shift();
        score++;
    }
}

// 충돌 감지
function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        let b = obstacles[i];
        if (
            player.x < b.x + b.width &&
            player.x + player.width > b.x &&
            player.y < b.y + b.height &&
            player.y + player.height > b.y
        ) {
            gameOver();
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
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score); // 점수 순 정렬
    localStorage.setItem("scores", JSON.stringify(scores));

    updateScoreBoard();
}

// 기록된 점수 리스트 업데이트
function updateScoreBoard() {
    let scoreList = document.getElementById("scoreList");
    scoreList.innerHTML = "";
    let scores = JSON.parse(localStorage.getItem("scores")) || [];

    scores.forEach((entry) => {
        let li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}점`;
        scoreList.appendChild(li);
    });
}

// 게임 오버
function gameOver() {
    gameRunning = false;  // 게임 중지
    alert(`💥 게임 오버! 당신의 점수: ${score}`);
    
    // 게임 오버 후 점수 자동 입력
    document.getElementById("playerName").value = "";
    resetGame();  // 게임 초기화
}

// 게임 초기화
function resetGame() {
    player.x = 175;  // 플레이어 위치 초기화
    obstacles.length = 0;  // 장애물 초기화
    score = 0;  // 점수 초기화
    gameRunning = true;  // 게임 다시 시작
}

// 게임 루프
function gameLoop() {
    if (gameRunning) {
        movePlayer();
        updateObstacles();
        checkCollision();
        draw();
    }
    requestAnimationFrame(gameLoop);
}

// 2초마다 장애물 생성
setInterval(createObstacle, 2000);

// 게임 시작
gameLoop();
updateScoreBoard(); // 시작 시 기록된 점수 로드
