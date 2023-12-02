let selectedCharacter = 'character1';
let gameInterval;
let playerPosition = 0;
let enemyPosition = 0;
let bullets = [];

function selectCharacter(character) {
    selectedCharacter = character;
}

function startGame() {
    document.getElementById('play-button').disabled = true;
    gameInterval = setInterval(updateGameArea, 20);
}

function updateGameArea() {
    // Move the player left and right
    document.getElementById('player').style.left = playerPosition + 'px';

    // Move the enemy
    let enemy = document.querySelector('.enemy');
    enemyPosition += 1;
    enemy.style.top = enemyPosition + 'px';

    // Check for collision with enemies
    let player = document.getElementById('player');
    if (isColliding(player, enemy)) {
        clearInterval(gameInterval);
        alert('Game Over! You collided with an enemy.');
        resetGame();
    }

    // Check if the enemy reached the bottom
    if (enemyPosition >= 360) {
        clearInterval(gameInterval);
        alert('You Win! You reached the end.');
        resetGame();
    }

    // Move and check bullets
    moveBullets();
    checkBulletCollision();
}

function isColliding(player, enemy) {
    let playerRect = player.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();
    return (
        playerRect.left < enemyRect.right &&
        playerRect.right > enemyRect.left &&
        playerRect.top < enemyRect.bottom &&
        playerRect.bottom > enemyRect.top
    );
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= 5;
    } else if (event.key === 'ArrowRight' && playerPosition < 360) {
        playerPosition += 5;
    } else if (event.key === 'Space') {
        shoot();
    }
});

function shoot() {
    let bullet = document.createElement('div');
    bullet.className = 'bullet';
    let bulletPosition = playerPosition + 15;
    bullet.style.left = bulletPosition + 'px';
    document.getElementById('game-container').appendChild(bullet);
    bullets.push(bullet);

    let bulletInterval = setInterval(function () {
        let top = parseInt(bullet.style.top) || 0;
        bullet.style.top = top - 5 + 'px';

        if (top <= 0) {
            clearInterval(bulletInterval);
            bullet.style.display = 'none';
            bullets.shift();
        }
    }, 20);
}

function moveBullets() {
    bullets.forEach(function (bullet) {
        let top = parseInt(bullet.style.top) || 0;
        bullet.style.top = top - 5 + 'px';
    });
}

function checkBulletCollision() {
    let enemy = document.querySelector('.enemy');
    bullets.forEach(function (bullet, index) {
        let bulletRect = bullet.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();
        if (
            bulletRect.left < enemyRect.right &&
            bulletRect.right > enemyRect.left &&
            bulletRect.top < enemyRect.bottom &&
            bulletRect.bottom > enemyRect.top
        ) {
            enemy.style.backgroundColor = '#00f'; // Change enemy color to indicate a hit
            setTimeout(() => {
                enemy.style.backgroundColor = '#f00'; // Reset enemy color
            }, 200);
            bullet.style.display = 'none';
            bullets.splice(index, 1);
        }
    });
}

function resetGame() {
    document.getElementById('play-button').disabled = false;
    playerPosition = 0;
    enemyPosition = 0;
    document.getElementById('player').style.left = '0px';
    document.querySelector('.enemy').style.top = '0px';
    document.getElementById('bullet').style.display = 'none';
    bullets.forEach(function (bullet) {
        bullet.style.display = 'none';
    });
    bullets = [];
}
