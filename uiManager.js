function startGame() {
    document.getElementById('startGameBanner').style.display = 'none';
    document.getElementById('board').style.display = 'block';
    requestAnimationFrame(update);
}

function displayGameOver() {
    const banner = document.getElementById('gameOverBanner');
    const finalScore = document.getElementById('finalScore');
    finalScore.textContent = score;
    banner.classList.remove('hidden');
}

function resetGame() {
    document.getElementById('gameOverBanner').classList.add('hidden');
    indexPlannet.x = 180;
    indexPlannet.spawned = false;
    planetArray = [];
    score = 0;
    canDraw = 0;
    gameOver = false;
    requestAnimationFrame(update);
}

function displayScore(){
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.textAlign = 'center';
    context.fillText(score, boardWidth/2, 50); 
}
