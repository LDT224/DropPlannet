function setupEventListeners() {
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('replayButton').addEventListener('click', resetGame);
    document.addEventListener("mousemove", function(event) {
        const canvasPosition = getCanvasPosition(board);
        indexPlannet.x = event.clientX - canvasPosition.x;
    });
    document.addEventListener("mousedown", dropPlanet);
    document.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
            gameOver = true;
        }
    });
}