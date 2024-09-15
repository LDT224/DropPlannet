class Planet {
    constructor(namePlanet, img, x, y, radius, isDropped = false) {
        this.namePlanet = namePlanet;
        this.img = img;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = 0;
        this.vy = 0;
        this.mass = radius / 10;
        this.isDropped = isDropped;
        this.restitution = 0.8;
    }

    updatePosition(secondsPassed) {
        if (this.isDropped) {
            if (this.vy > 0 && this.y + this.radius >= box.height + box.y) {
                this.vy *= 0.7; 
            } else {
                this.vy += gravity * secondsPassed;
            }
    
            this.x += this.vx * secondsPassed;
            this.y += this.vy * secondsPassed;

            if(this.y < indexPlannet.y){
                gameOver = true;
                return;
            }
    
            if (this.y + this.radius >= box.height + box.y) {
                this.y = box.height + box.y - this.radius / 2;
                this.vy = 0;  
            }
            
            if (this.x - this.radius / 2 <= 0) {
                this.x = this.radius / 2;
                this.vx = 0;
            }
            if (this.x + this.radius / 2 >= boardWidth) {
                this.x = boardWidth - this.radius / 2;
                this.vx = 0;
            }
        }
        else{
            if(indexPlannet.x <= this.radius/2){
                indexPlannet.x = this.radius/2;
            }
            else if(indexPlannet.x >= boardWidth - this.radius/2){
                indexPlannet.x = boardWidth - this.radius/2;
            }
            this.x = indexPlannet.x;
        }
    }

    draw(context) {
        if (this.img && this.img.complete) {
            context.drawImage(this.img, this.x - this.radius / 2, this.y - this.radius / 2, this.radius, this.radius);
        }
    }

    checkCollision(otherPlanet) {
        const dx = this.x - otherPlanet.x;
        const dy = this.y - otherPlanet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.radius + otherPlanet.radius) / 2;
    }

    static collisionSamePlanet(planet1, planet2) {
        let dx = planet2.x - planet1.x;
        let dy = planet2.y - planet1.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let nx = dx / distance;
        let ny = dy / distance;
        let collisionPointX = (planet1.x + nx * planet1.radius + planet2.x - nx * planet2.radius) / 2;
        let collisionPointY = (planet1.y + ny * planet1.radius + planet2.y - ny * planet2.radius) / 2;

        let newPlanetData = planets[planet1.namePlanet + 1];
        if (planet1.namePlanet + 1 >= planets.length) {
            newPlanetData = planets[planet1.namePlanet];
        }

        const newPlanet = new Planet(newPlanetData.namePlanet, newPlanetData.img, collisionPointX, collisionPointY, newPlanetData.size, true);
        
        const index1 = planetArray.indexOf(planet1);
        const index2 = planetArray.indexOf(planet2);

        if (index2 > -1) planetArray.splice(index2, 1);
        if (index1 > -1) planetArray.splice(index1, 1);

        planetArray.push(newPlanet);

        score += Math.pow(2,newPlanet.namePlanet);
        increaseCanDraw();
    }

    collisionOtherPlanet(otherPlanet) {
        let vCollision = {x: otherPlanet.x - this.x, y: otherPlanet.y - this.y};
        let distance = Math.sqrt((otherPlanet.x - this.x) * (otherPlanet.x - this.x) + (otherPlanet.y - this.y) * (otherPlanet.y - this.y));
        
        if (distance === 0) return; 
        let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
        
        let vRelativeVelocity = {x: this.vx - otherPlanet.vx, y: this.vy - otherPlanet.vy};
        let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
        
        if (speed < 0) return;
    
        speed *= Math.min(this.restitution, otherPlanet.restitution);
        
        let impulse = 2 * speed / (this.mass + otherPlanet.mass);
        
        this.vx -= (impulse * otherPlanet.mass * vCollisionNorm.x);
        this.vy -= (impulse * otherPlanet.mass * vCollisionNorm.y);
        otherPlanet.vx += (impulse * this.mass * vCollisionNorm.x);
        otherPlanet.vy += (impulse * this.mass * vCollisionNorm.y);
    
        const overlap = (this.radius + otherPlanet.radius) / 2 - distance;
        if (overlap > 0) {
            const correctionFactor = 0.5; 
            const correction = {x: vCollisionNorm.x * overlap * correctionFactor, y: vCollisionNorm.y * overlap * correctionFactor};
            
            this.x -= correction.x;
            this.y -= correction.y;
            otherPlanet.x += correction.x;
            otherPlanet.y += correction.y;
        }
    }
    
}


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
let secondsPassed = 0; 
let oldTimeStamp = 0;
const restitution = 0.90;

let score = 0;
let gameOver = false;
let canDraw = 1;

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

    document.addEventListener("mousemove", function(event) {
        indexPlannet.x = event.clientX;
    });

    document.addEventListener("mousedown", dropPlanet);

    document.addEventListener("keydown", replay);
    requestAnimationFrame(update);
};

function update(timeStamp) {
    if(gameOver)
        return;

    secondsPassed = (timeStamp - oldTimeStamp) / 100;
    oldTimeStamp = timeStamp;

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
    
    for (let i = 0; i < 17; i++) {
        context.beginPath();
        context.moveTo(indexPlannet.x, indexPlannet.y + 50 + lineHeight * i * 2);
        context.lineTo(indexPlannet.x, indexPlannet.y + 50 + lineHeight * (i * 2 + 1));
        context.stroke();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.textAlign = 'center';
    context.fillText(score, boardWidth/2, 50);

    if(gameOver){
        context.fillText("Game Over", 5, 90);
    }

    requestAnimationFrame(update);
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
    planetArray.forEach(planet => {
        planet.isDropped = true;
    });

    indexPlannet.spawned = false;
}

function replay(e){
    if(e.code == "Space"){        
        if(gameOver){
            indexPlannet.x = 180;
            indexPlannet.spawned = false;
            planetArray = [];
            score = 0;
            gameOver = false;
            console.log("AA")
        }
    }
}

function increaseCanDraw(){
    if(canDraw < 5){
        canDraw = score/6;
    }
}