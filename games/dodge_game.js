const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 게임 상태 변수
let gameRunning = false;
let score = 0;
let obstacleSpeed = 3; // 장애물 속도 (기본값)
let spawnRate = 1500; // 장애물 생성 속도(ms)

// 플레이어 설정
const player = {
    x: 175,
    y: 450,
    width: 50,
    height: 50,
    color: "blue",
    speed: 6 // 플레이어 속도 증가
};

// 장애물 설정
const obstacles = [];
const obstacleWidthMin = 30; // 최소 크기
const obstacleWidthMax = 80; // 최대 크기

// 키보드 입력 처리
let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowRight") rightPressed = true;
});

document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowLeft") leftPressed = false;
    if (e.key === "ArrowRight") rightPressed = false;
});

// 게임 시작 함수
function startGame() {
    document.getElementById("startButton").disabled = true;
    gameRunning = true;
    score = 0;
    obstacleSpeed = 3; // 속도 초기화
    spawnRate = 1500; // 생성 속도 초기화
    obstacles.length = 0;
    gameLoop();
}

// 장애물 생성
function createObstacle() {
    if (gameRunning) {
        let width = Math.random() * (obstacleWidthMax - obstacleWidthMin) + obstacleWidthMin;
        let randomX = Math.random() * (canvas.width - width);
        obstacles.push({ x: randomX, y: 0, width: width, height: 30, color: "red" });
        
        // 🔥 난이도 증가: 시간이 지날수록 장애물 속도 증가 & 생성 빈도 높이기
        if (score % 5 === 0 && spawnRate > 600) {
            spawnRate -= 100; // 장애물 생성 속도 증가
        }
        if (score % 10 === 0) {
            obstacleSpeed += 0.3; // 장애물 이동 속도 증가
        }

        setTimeout(createObstacle, spawnRate);
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

// 게임 화면을 그리는 함수
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
    if (gameRunning) {
        movePlayer();
        updateObstacles();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// 게임 오버
function gameOver() {
    gameRunning = false;
    alert(`💥 게임 오버! 당신의 점수: ${score}`);
    document.getElementById("startButton").disabled = false;
}

// 점수 저장 기능
function saveScore() {
    let playerName = document.getElementById("playerName").value;
    if (playerName === "") {
        alert("이름을 입력하세요!");
        return;
    }

    let newScore = { name: playerName, score: score };
    let scores = JSON.parse(localStorage.getItem("dodge_scores")) || [];
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem("dodge_scores", JSON.stringify(scores));

    updateScoreBoard();
}

// 기록된 점수 리스트 업데이트
function updateScoreBoard() {
    let scoreList = document.getElementById("scoreList");
    scoreList.innerHTML = "";
    let scores = JSON.parse(localStorage.getItem("dodge_scores")) || [];

    scores.forEach((entry) => {
        let li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}점`;
        scoreList.appendChild(li);
    });
}

updateScoreBoard();
setTimeout(createObstacle, spawnRate); // 장애물 생성 주기 설정
