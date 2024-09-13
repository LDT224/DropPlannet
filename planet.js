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
    { namePlanet: 0, size: 20, src: "./Assets/0.png", img: null },
    { namePlanet: 1, size: 30, src: "./Assets/1.png", img: null },
    { namePlanet: 2, size: 40, src: "./Assets/2.png", img: null },
    { namePlanet: 3, size: 50, src: "./Assets/3.png", img: null },
    { namePlanet: 4, size: 60, src: "./Assets/4.png", img: null },
    { namePlanet: 5, size: 70, src: "./Assets/5.png", img: null },
    { namePlanet: 6, size: 80, src: "./Assets/6.png", img: null },
    { namePlanet: 7, size: 90, src: "./Assets/7.png", img: null },
    { namePlanet: 8, size: 100, src: "./Assets/8.png", img: null },
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
        setTimeout(spawnPlannet, 1000,indexPlannet.x, indexPlannet.y);
        //spawnPlannet(indexPlannet.x, indexPlannet.y);
    }

    planetArray.forEach((planet, i) => {
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

                    for (let j = i + 1; j < planetArray.length; j++) {
                        let otherPlanet = planetArray[j];
                        if(!otherPlanet.isDropped){
                            continue;
                        }
                        if (checkCollision(planet, otherPlanet)) {
                            if(planet.namePlanet === otherPlanet.namePlanet){
                                collisionSamePlanet(planet, otherPlanet);     

                            }
                        }
                    }                
            }
            context.drawImage(planet.img, planet.x - planet.radius/2, planet.y - planet.radius/2, planet.radius, planet.radius);
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
        vx: 0,
        vy: 0,
        mass: planets[randomNumber].size / 10,
        isDropped : false,
    };

    planetArray.push(planet);
    indexPlannet.spawned = true;
}

function dropPlanet(){
    for(let i = 0; i < planetArray.length; i++){
        planetArray[i].isDropped = true;
    }
    
    indexPlannet.spawned = false;
}

function checkCollision(planet1, planet2) {
    const dx = planet1.x - planet2.x;
    const dy = planet1.y - planet2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (planet1.radius + planet2.radius) / 2;
}

function collisionSamePlanet(planet1, planet2){
    let dx = planet2.x - planet1.x;
    let dy = planet2.y - planet1.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    let nx = dx / distance;
    let ny = dy / distance;

    let collisionPointX = (planet1.x + nx * planet1.radius + planet2.x - nx * planet2.radius) / 2;
    let collisionPointY = (planet1.y + ny * planet1.radius + planet2.y - ny * planet2.radius) / 2;

    let newPlanet = planets[planet1.namePlanet + 1];
    if(planet1.namePlanet + 1 >= planets.length)
        newPlanet = planets[planet1.namePlanet];
    let planet = {
        namePlanet : newPlanet.namePlanet,
        img : newPlanet.img,
        x : collisionPointX,
        y : collisionPointY,
        radius : newPlanet.size,
        vx: 0,
        vy: 0,
        mass: newPlanet.size / 10,
        isDropped : true,
        isCollision : false
    };
    const index1 = planetArray.indexOf(planet1);
    const index2 = planetArray.indexOf(planet2);

    if (index2 > -1) planetArray.splice(index2, 1);
    if (index1 > -1) planetArray.splice(index1, 1);

    planetArray.push(planet);
    console.log(planetArray)
}