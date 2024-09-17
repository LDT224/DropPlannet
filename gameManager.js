let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
let lineHeight = 10;
let gravity = 9.81;
let planetArray = [];
let secondsPassed = 0; 
let oldTimeStamp = 0;
const restitution = 0.90;

let score = 0;
let gameOver = false;
let canDraw = 1;

let box = {
    x: 0, 
    y: 250, 
    width: boardWidth, 
    height: boardHeight / 2, 
    color: "brown" 
};

let indexPlannet = {
    x: 180,
    y: 180,
    radius: 5,
    spawned: false
};


window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    loadPlanets();
    setupEventListeners();
    
    board.style.display = "none"; 
};

function update(timeStamp) {
    if(gameOver){
        displayGameOver();
        return;
    }

    secondsPassed = (timeStamp - oldTimeStamp) / 100;
    oldTimeStamp = timeStamp;

    if (!context) return;

    drawBox();
    drawLine();
    displayScore();

    if (!indexPlannet.spawned) {
        setTimeout(spawnPlannet, 1000, indexPlannet.x, indexPlannet.y);
    }
    
    planetArray.forEach((planet, i) => {
        planet.updatePosition(secondsPassed);
        
        for (let j = i + 1; j < planetArray.length; j++) {
            let otherPlanet = planetArray[j];
            if (!otherPlanet.isDropped) continue;
            
            if (planet.checkCollision(otherPlanet)) {
                if (planet.namePlanet === otherPlanet.namePlanet) {
                    Planet.collisionSamePlanet(planet, otherPlanet);
                }
                else{
                    planet.collisionOtherPlanet(otherPlanet);
                }
            }
        }
        
        planet.draw(context);
    });
    requestAnimationFrame(update);
}

function drawBox(){
    context.clearRect(0, 0, board.width, board.height);
    context.lineWidth = 5;
    context.strokeStyle = box.color;

    context.strokeRect(box.x, box.y, box.width, box.height);
    context.beginPath();
    context.moveTo(0, 250);
    context.lineTo(50, 200);
    context.lineTo(310, 200);
    context.lineTo(360, 250);
    context.stroke();
}

function drawLine(){
    context.beginPath();
    context.arc(indexPlannet.x, indexPlannet.y, indexPlannet.radius, 0, 2 * Math.PI);
    context.stroke();
    
    for (let i = 0; i < 17; i++) {
        context.beginPath();
        context.moveTo(indexPlannet.x, indexPlannet.y + 50 + lineHeight * i * 2);
        context.lineTo(indexPlannet.x, indexPlannet.y + 50 + lineHeight * (i * 2 + 1));
        context.stroke();
    }
}

function loadPlanets() {
    planets.forEach(planet => {
        planet.img = new Image();
        planet.img.src = planet.src;
        planet.img.onload = function() {};
    });
}

function spawnPlannet(x, y) {
    if (indexPlannet.spawned) return;

    let randomNumber = Math.floor(Math.random() * canDraw);
    let planetData = planets[randomNumber];
    let planet = new Planet(planetData.namePlanet, planetData.img, x, y, planetData.size);

    planetArray.push(planet);
    indexPlannet.spawned = true;
}

function dropPlanet() {
    if(!indexPlannet.spawned){
        return;
    }

    for(let i = 0; i < planetArray.length; i++){
        if(planetArray[i].isDropped == false){
            planetArray[i].isDropped = true;
        }
    }

    indexPlannet.spawned = false;
}


function increaseCanDraw(){
    if(score < 6){
        canDraw = 0;
    } else if(score < 20 && score > 6){
        canDraw = 2;
    }else if(score > 20 && score < 70){
        canDraw = 3;
    }else if(score > 70 && score < 150){
        canDraw = 4;
    }else if(score > 150){
        canDraw = 5;
    }
}

function getCanvasPosition(canvas) {
    const rect = canvas.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
}

