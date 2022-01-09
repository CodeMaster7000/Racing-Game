const c = document.querySelector("#racing-canvas");
const ctx = c.getContext("2d");
c.style.backgroundColor = "black";

let SPEED = 0.1;
let TRUESPEED = SPEED;
let accelerateSpeed = false;
let breakSpeed = false;
let MAXSPEED = 13;
let breakAudio = new Audio("break.mp3");
let gameStarted = false;

class Line {
	constructor(x, y, w, h, c) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
	}

	draw() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.fillStyle = this.c;
		ctx.fill();
		ctx.closePath();
	}

	update() {
		if (this.y > c.clientHeight) {
			this.y -= c.clientHeight;
			let spawnObstacle = Math.floor(Math.random() * 200);

			if (spawnObstacle === 0) {
				obstacles.push(new Obstacle(Math.floor(Math.random() * (c.clientWidth - 70)), 0 - 30, 70, 30, "barrier"));
			} else if (spawnObstacle === 1) {
				powerUps.push(new Powerup(Math.random() * (c.clientWidth - 24), -100, 12, "yellow"))
			}
		}
	}
}

class Obstacle {
	constructor(x, y, w, h, t) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		if (t === "barrier") this.c = "orange";
	}

	draw() {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y + this.h);
		ctx.lineTo(this.x + 10, this.y);
		ctx.lineTo(this.x + this.w - 10, this.y);
		ctx.lineTo(this.x + this.w, this.y + this.h);
		ctx.fillStyle = this.c;
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.moveTo(this.x + 15, this.y);
		ctx.lineTo(this.x + 30, this.y);
		ctx.lineTo(this.x + 20, this.y + this.h);
		ctx.lineTo(this.x + 5, this.y + this.h);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.moveTo(this.x + this.w - 15, this.y);
		ctx.lineTo(this.x + this.w - 30, this.y);
		ctx.lineTo(this.x + this.w - 20, this.y + this.h);
		ctx.lineTo(this.x + this.w - 5, this.y + this.h);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}

	collision(player) {
		return player.x + player.w < this.x ||
			player.y + player.h < this.y ||
			player.x > this.x + this.w ||
			player.y > this.y + this.h
	}
}

class Car {
	constructor(x, y, w, h, c) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
		this.speed = MAXSPEED - ((Math.random() * 5) + 3);
		this.accSpeed = this.speed;
		this.accelerate = false;
		this.timeout = false;
		this.counter = 0;
		this.stopped = true;
		this.moving = false;
		this.xSpeed = Math.random() * 2 + 0.5;
	}

	draw() {
		ctx.beginPath();
		ctx.rect(
			this.x,
			this.y,
			this.w / 4,
			this.h / 5);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.rect(
			this.x + this.w / 4 * 2,
			this.y,
			this.w / 4,
			this.h / 5);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();


		ctx.beginPath();
		ctx.rect(
			this.x,
			this.y + this.h / 5 * 4,
			this.w / 4,
			this.h / 5);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.rect(
			this.x + this.w / 4 * 2,
			this.y + this.h / 5 * 4,
			this.w / 4,
			this.h / 5);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.ellipse(
			this.x + this.w / 2 - 6,
			this.y + this.h / 2,
			this.w / 5,
			this.h / 2,
			0, 0, Math.PI * 2);
		ctx.fillStyle = this.c
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.ellipse(
			this.x + this.w / 2 - 6,
			this.y + this.h / 2 + 5,
			this.w / 7,
			this.h / 4,
			0, 0, Math.PI * 2);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();
	}

	collision(player) {
		return player.x + player.w < this.x ||
			player.y + player.h < this.y ||
			player.x > this.x + this.w ||
			player.y > this.y + this.h
	}

	update() {
		if (this.timeout) {
			this.counter++;
			this.accSpeed *= 0.99;

			if (counter <= 150) if (counter % 5 === 0) shadows.push({ x: this.x, y: this.y, w: this.w, h: this.h });
			else {
				if (counter % 20 === 0) shadows.push({ x: this.x, y: this.y, w: this.w, h: this.h });
			}

			if (this.counter === 250) {
				this.counter = 0;
				this.timeout = false;
				this.accelerate = true;
			}
		}

		if (this.accelerate) {
			this.accSpeed *= 1.03;
			if (this.accSpeed >= this.speed) {
				this.accelerate = false;
			}
		}

		if (this.stopped) {
			let move = Math.floor(Math.random() * 80);
			if (move === 0) {
				this.xSpeed = Math.random() * this.accSpeed - this.accSpeed / 2;
				this.moving = true;
				this.stopped = false;
			}
		}

		if (this.moving) {
			this.x += this.xSpeed;

			let stop = Math.floor(Math.random() * 100);
			if (stop === 0) {
				this.stopped = true;
				this.moving = false;
			}
		}

		if (this.x < 0) {
			this.x = 0;
			this.xSpeed -= this.xSpeed;
		}

		if (this.x + this.w > c.clientWidth) {
			this.x = c.clientWidth - this.w;
			this.xSpeed -= this.xSpeed;
		}
	}
}

const player = {
	x: c.clientWidth / 2 - 20,
	y: c.clientHeight / 5 * 3,
	w: 50,
	h: 75,
	rD: false,
	lD: false,
	xSpeed: SPEED,

	draw: function () {
		ctx.beginPath();
		ctx.rect(
			this.x,
			this.y,
			this.w / 4,
			this.h / 5);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.rect(
			this.x + this.w / 4 * 2,
			this.y,
			this.w / 4,
			this.h / 5);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();


		ctx.beginPath();
		ctx.rect(
			this.x,
			this.y + this.h / 5 * 4,
			this.w / 4,
			this.h / 5);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.rect(
			this.x + this.w / 4 * 2,
			this.y + this.h / 5 * 4,
			this.w / 4,
			this.h / 5);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.ellipse(
			this.x + this.w / 2 - 6,
			this.y + this.h / 2,
			this.w / 5,
			this.h / 2,
			0, 0, Math.PI * 2);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.ellipse(
			this.x + this.w / 2 - 6,
			this.y + this.h / 2 + 5,
			this.w / 7,
			this.h / 4,
			0, 0, Math.PI * 2);
		ctx.fillStyle = "black";
		ctx.fill();
		ctx.closePath();
	},

	update: function () {
		if (this.rD) {
			this.x += this.xSpeed;
		} else if (this.lD) {
			this.x -= this.xSpeed;
		}

		if (this.x + this.w / 4 * 3 > c.clientWidth) this.x = c.clientWidth - this.w / 4 * 3;
		if (this.x < 0) this.x = 0;

		if (this.x < 20 || this.x + this.w > c.clientWidth - 20) SPEED *= 0.975;
	}
};

class Powerup {
	constructor(x, y, w, t) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.t = t;

		if (this.t) this.color = "yellow";
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.w * 2, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}

	collision(player) {
		return player.x + player.w < this.x ||
			player.y + player.h < this.y ||
			player.x > this.x + this.w ||
			player.y > this.y + this.h
	}
}

document.addEventListener("keydown", function (e) {
	if (gameStarted) {
		if ((e.key === "ArrowUp" || e.key === "w" || e.key === " ") && !timeout) {
			accelerateSpeed = true;
		} else if (e.key === "ArrowDown" || e.key === "s") {
			breakSpeed = true;
		}

		if (e.key === "ArrowRight" || e.key === "d") {
			player.rD = true;
		} else if (e.key === "ArrowLeft" || e.key === "a") {
			player.lD = true;
		}
	}
});

document.addEventListener("keyup", function (e) {
	if (gameStarted) {
		if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") {
			accelerateSpeed = false;
		} else if (e.key === "ArrowDown" || e.key === "s") {
			breakSpeed = false;
		}

		if (e.key === "ArrowRight" || e.key === "d") {
			player.rD = false;
		} else if (e.key === "ArrowLeft" || e.key === "a") {
			player.lD = false;
		}
	}
});


let lines = [];

let j = 0;
for (let i = 0; i < c.height; i += 75) {
	if (j === 0 || j % 2 === 0) {
		lines.push(new Line(0, i, 20, 75, "red"));
		lines.push(new Line(c.clientWidth - 20, i, 20, 75, "red"));

		lines.push(new Line(c.clientWidth / 2 - 10, i, 20, 75, "white"));
	} else {
		lines.push(new Line(0, i, 20, 75, "white"));
		lines.push(new Line(c.clientWidth - 20, i, 20, 75, "white"));
	}

	lines.push(new Line(20, i, 3, 75, "black"));
	lines.push(new Line(c.clientWidth - 23, i, 3, 75, "black"));

	j++;
}


let cars = [];
let colors = ["red", "orange", "yellow", "green", "blue", "purple", "aquamarine", "chartreuse", "white", "hotpink", "steelblue"]
for (let i = 0; i < 11; i++) {
	cars.push(new Car(Math.random() * (c.clientWidth - player.w), -(Math.random() * 1000), player.w, player.h, colors[i]));
}

let obstacles = [];
let shadows = [];
let powerUps = [];

let counter = 0;
let timeout = false;

let increaseDif = true;
const animate = function () {
	ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);

	// update player
	player.update();

	// Make the speed slow down 1%
	SPEED *= 0.99;

	// handle acceleration
	if (accelerateSpeed) {
		if (SPEED <= 9) SPEED *= 1.03;
		else SPEED *= 1.011;
	}

	// handle break
	if (breakSpeed) {
		SPEED *= 0.97;
	}

	// handle maximum speed
	if (SPEED >= MAXSPEED) {
		SPEED = MAXSPEED;
	}

	// handle minimum speed
	if (SPEED < 0.5) {
		SPEED = 0.5;
	}

	// Update, move and draw all lines
	for (const line of lines) {
		line.update();
		line.y += SPEED;
		line.draw();
	}

	// draw, move and update shadows
	let i = 0;
	for (let shadow of shadows) {
		shadow.y += SPEED;
		if (shadow.y > c.clientHeight * 2) {
			shadows.splice(i, 1);
			continue;
		}

		ctx.beginPath();
		ctx.rect(
			shadow.x,
			shadow.y,
			shadow.w / 4,
			shadow.h / 5);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.rect(
			shadow.x + shadow.w / 4 * 2,
			shadow.y,
			shadow.w / 4,
			shadow.h / 5);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fill();
		ctx.closePath();


		ctx.beginPath();
		ctx.rect(
			shadow.x,
			shadow.y + shadow.h / 5 * 4,
			shadow.w / 4,
			shadow.h / 5);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.rect(
			shadow.x + shadow.w / 4 * 2,
			shadow.y + shadow.h / 5 * 4,
			shadow.w / 4,
			shadow.h / 5);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fill();
		ctx.closePath();

		i++;
	}

	// Move, draw, check for collision and delete powerups
	for (let i = 0; i < powerUps.length; i++) {
		const pup = powerUps[i];
		pup.y += SPEED;
		pup.draw();

		if (!pup.collision(player)) {
			powerUps.splice(i, 1);
		}

		if (pup.y - pup.w >= c.clientHeight) {
			powerUps.splice(i, 1);
		}
	}

	// Move, draw, check for collision and delete obstacles
	for (let i = 0; i < obstacles.length; i++) {
		const obs = obstacles[i];
		obs.y += SPEED;
		obs.draw();
		if (!obstacles[i].collision(player)) {
			breakAudio.play();
			timeout = true;
			counter = 0;
			accelerateSpeed = false;
		}

		for (let j = 0; j < cars.length; j++) {
			if (!obstacles[i].collision(cars[j])) {
				cars[j].timeout = true;
				if (cars[j].y + cars[j].h >= 0 && cars[j].y <= c.clientHeight) {
					breakAudio.play();
				}
			}
		}

		if (obs.y > c.clientHeight) {
			obstacles.splice(i, 1);
		}
	}

	// Counter for position
	let ctr = 1;

	// Move, draw, check for collision and update cars
	for (let i = 0; i < cars.length; i++) {
		let car = cars[i]
		car.draw();
		car.y += SPEED;
		car.y -= car.accSpeed;

		if (car.y <= player.y) {
			ctr++;
		}

		if (!cars[i].collision(player)) {
			car.timeout = true;
			timeout = true;
			counter = 0;
			accelerateSpeed = false;
			breakAudio.play();
		}


		for (let j = 0; j < cars.length; j++) {
			// FIX THIS TO MAKE CARS COLLIDE WITH VVVVV EACHOTHER
			if (!cars[i].collision(cars[j]) && !i === j) {
				cars[i].timeout = true;
				cars[j].timeout = true;
				if (cars[j].y + cars[j].h >= 0 && cars[j].y <= c.clientHeight &&
					cars[i].y + cars[i].h >= 0 && cars[i].y <= c.clientHeight) {
					breakAudio.play();
				}
			}
		}

		car.update();
	}

	// Incease difficulty based on position
	if (ctr === 1 && increaseDif) {
		for (let car of cars) {
			car.speed += 0.5;
		}
		MAXSPEED += 0.5;
		increaseDif = false;
	}
	if (ctr > 1) {
		increaseDif = true;
	}

	// Make the players x speed 33.33% of the speed
	player.xSpeed = SPEED / 3;


	// control timeout
	if (timeout) {
		if (counter <= 150) if (counter % 5 === 0) shadows.push({ x: player.x, y: player.y, w: player.w, h: player.h });
		else {
			if (counter % 20 === 0) shadows.push({ x: player.x, y: player.y, w: player.w, h: player.h });
		}
		counter++;

		if (counter > 200) {
			counter = 0;
			timeout = false;
		}
	}

	// draw player
	player.draw();



	// TOP LAYER
	// speedometer
	ctx.beginPath();
	ctx.rect(23, c.clientHeight - SPEED * 10, 50, SPEED * 10)
	ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
	ctx.fill();
	ctx.strokeStyle = "gray";
	ctx.strokeRect(23, c.clientHeight - MAXSPEED * 10, 50, MAXSPEED * 10)
	ctx.closePath();

	// position
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.font = "54px Arial";
	ctx.fillText(ctr, c.clientWidth - 90, c.clientHeight - 20);
	ctx.closePath();

	// Draw top padding
	ctx.beginPath();
	ctx.rect(0, 0, c.clientWidth, 75);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();

	let previousCarY = cars[0].y;
	let nextCarM = Math.abs(previousCarY - player.y);

	if (ctr === 1) {
		nextCarM = 0;
	}

	for (let i = 0; i < cars.length; i++) {
		if (previousCarY > player.y) {
			previousCarY = -Infinity;
			i = 0;
		}

		if (
			cars[i].y > previousCarY &&
			cars[i].y < player.y) {
			nextCarM = Math.abs(cars[i].y - player.y);
			previousCarY = cars[i].y;
		}
	}



	// speed
	ctx.beginPath();
	ctx.fillStyle = "lime";
	ctx.font = "24px Arial"
	ctx.fillText(`Next car: ${(nextCarM / 3).toFixed(0)}m`, 170, c.clientHeight - 70)
	ctx.closePath();

	requestAnimationFrame(animate);
}

var startGame = function() {
	gameStarted = true;
	animate();
	c.style.backgroundColor = "dimgrey";
	// document.getElementById("racing-canvas").style.display = "block";
	document.getElementById("startMenu").style.display = "none";
}

function accelerate(b) {
	accelerateSpeed = b;
}

function breakS(b) {
	breakSpeed = b;
}

function rD(b) {
	player.rD = b;
}

function lD(b) {
	player.lD = b;
}
