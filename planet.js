let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

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
    radius: 10,
    spawned: false
};

let mouse = {
    x: 10,
    y: 10
};

let randomNumber = 0;
let lineHeight = 10;

const planets = [
    { namePlanet: 1, size: 20, src: "./Assets/1.png", img: null },
    { namePlanet: 2, size: 30, src: "./Assets/2.png", img: null },
    { namePlanet: 3, size: 40, src: "./Assets/3.png", img: null },
    { namePlanet: 4, size: 50, src: "./Assets/4.png", img: null },
    { namePlanet: 5, size: 60, src: "./Assets/5.png", img: null },
    { namePlanet: 6, size: 70, src: "./Assets/6.png", img: null },
    { namePlanet: 7, size: 80, src: "./Assets/7.png", img: null },
    { namePlanet: 8, size: 90, src: "./Assets/8.png", img: null },
    { namePlanet: 9, size: 100, src: "./Assets/9.png", img: null },
];


window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    
    loadPlanets();

    document.addEventListener("mousemove", function(event){
        indexPlannet.x = event.clientX;
        if(indexPlannet.x <= planets[randomNumber].size/2){
            indexPlannet.x = planets[randomNumber].size/2;
        }else if(indexPlannet.x >= boardWidth - planets[randomNumber].size/2){
            indexPlannet.x = boardWidth - planets[randomNumber].size/2;
        }
    })

    document.addEventListener("mousedown", dropPlanet());
    requestAnimationFrame(update);
};

function update() {
    requestAnimationFrame(update);
    if (!context) return; 
    
    context.clearRect(0, 0, board.width, board.height);
    context.lineWidth = 5;
    context.strokeStyle = box.color;
    
    // context.beginPath();
    // context.arc(indexPlannet.x, indexPlannet.y, indexPlannet.radius, 0, 2 * Math.PI);
    // context.stroke();
    
    context.strokeRect(box.x, box.y, box.width, box.height);
    context.beginPath();
    context.moveTo(0, 250);
    context.lineTo(50, 200);
    context.lineTo(310, 200);
    context.lineTo(360, 250);
    context.stroke();
    
    drawPlanet(indexPlannet.x, indexPlannet.y);   
    for(let i =0; i < 17; i++){
        context.beginPath();
        context.moveTo(indexPlannet.x, indexPlannet.y + 50 + lineHeight*i*2);
        context.lineTo(indexPlannet.x, indexPlannet.y + 50 + lineHeight*(i*2+1));
        context.stroke();
    }
}

function loadPlanets() {
    planets.forEach(planet => {
        planet.img = new Image();
        planet.img.src = planet.src;
        planet.img.onload = function() {
        };
    });
}

function drawPlanet(x, y) {
    if(!indexPlannet.spawned){
        randomNumber = Math.floor(Math.random()*5);
    }
    if(planets[randomNumber].img && planets[randomNumber].img.complete){
        context.drawImage(planets[randomNumber].img, x - planets[randomNumber].size / 2, y - planets[randomNumber].size / 2, planets[randomNumber].size, planets[randomNumber].size);
        indexPlannet.spawned = true;
    }
}

function dropPlanet(){

}