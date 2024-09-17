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
        // Update planet's position based on physics
        if (this.isDropped) {
            this.applyGravity(secondsPassed);
            this.x += this.vx * secondsPassed;
            this.y += this.vy * secondsPassed;
            
            this.checkGameOver();
            this.handleBoundaryCollision();
        } else {
            this.followMouse();
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
        
        planetArray.splice(planetArray.indexOf(planet1), 1);
        planetArray.splice(planetArray.indexOf(planet2), 1);
        planetArray.push(newPlanet);

        score += Math.pow(2, newPlanet.namePlanet);
        increaseCanDraw();
    }

    collisionOtherPlanet(otherPlanet) {
        let vCollision = {x: otherPlanet.x - this.x, y: otherPlanet.y - this.y};
        let distance = Math.sqrt(vCollision.x * vCollision.x + vCollision.y * vCollision.y);
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
            const correction = {x: vCollisionNorm.x * overlap * 0.5, y: vCollisionNorm.y * overlap * 0.5};
            this.x -= correction.x;
            this.y -= correction.y;
            otherPlanet.x += correction.x;
            otherPlanet.y += correction.y;
        }
    }

    // Helper methods
    applyGravity(secondsPassed) {
        if (this.vy > 0 && this.y + this.radius >= box.height + box.y) {
            this.vy *= 0.7;
        } else {
            this.vy += gravity * secondsPassed;
        }
    }

    checkGameOver() {
        if (this.y < indexPlannet.y) {
            gameOver = true;
        }
    }

    handleBoundaryCollision() {
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

    followMouse() {
        if (indexPlannet.x <= this.radius / 2) {
            indexPlannet.x = this.radius / 2;
        } else if (indexPlannet.x >= boardWidth - this.radius / 2) {
            indexPlannet.x = boardWidth - this.radius / 2;
        }
        this.x = indexPlannet.x;
    }
}


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