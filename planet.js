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

let lineHeight = 10;
let gravity = 9.81;
let planetArray = [];

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
    })

    document.addEventListener("mousedown", dropPlanet);
    requestAnimationFrame(update);
};

function update() {
    requestAnimationFrame(update);
    if (!context) return; 
    
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
    
    if(!indexPlannet.spawned){
        spawnPlannet(indexPlannet.x, indexPlannet.y);
    }

    planetArray.forEach(planet => {
        if(planet.img && planet.img.complete){
            if(!planet.isDropped){
                if(indexPlannet.x <= planet.radius/2){
                    indexPlannet.x = planet.radius/2;
                }
                else if(indexPlannet.x >= boardWidth - planet.radius/2){
                    indexPlannet.x = boardWidth - planet.radius/2;
                }
                planet.x = indexPlannet.x;
            }
            else{
                planet.y += gravity;

                 if(planet.y + planet.radius >= box.height + box.y) {
                    planet.y = box.height + box.y - planet.radius/2; 
                }

                if(planet.x - planet.radius / 2 <= 0) {
                    planet.x = planet.radius / 2; 
                }

                if(planet.x + planet.radius / 2 >= boardWidth) {
                    planet.x = boardWidth - planet.radius / 2; 
                }
            }
            context.drawImage(planet.img, planet.x - planet.radius/2, planet.y - planet.radius/2, planet.radius, planet.radius)
        }
    });

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

function spawnPlannet(x,y){
    if(indexPlannet.spawned){
        return
    }
    
    let randomNumber = Math.floor(Math.random()*5);
    let planet = {
        namePlanet : planets[randomNumber].namePlanet,
        img : planets[randomNumber].img,
        x : x,
        y : y,
        radius : planets[randomNumber].size,
        isDropped : false
    };

    planetArray.push(planet);
    indexPlannet.spawned = true;
}

function dropPlanet(){
    planetArray[planetArray.length-1].isDropped = true;
    indexPlannet.spawned = false;
}