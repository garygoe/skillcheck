var canvas;
var points = 0;
var x, y, xb, yb;
var speed = 4.5;
var move = 0;
var fails = 0;
var endgame = false;
var currentTime;
var newTime;
var onlyWhite, randomPos, speedInput;
var total = -1;
var ratio = 0;
var position; // les différentes positions possible du cercle.
var rand;
var setHeight;
function setup() {
	setHeight = windowHeight-530;
	if(setHeight < 200) setHeight = 200;
	canvas = createCanvas(windowWidth, setHeight);
	canvas.parent('container');
	frameRate(60);
	position = [[0, 0], [width*0.2, 0], [width*-0.2, 0]];

	onlyWhite = document.getElementById('onlyWhite');
	randomPos = document.getElementById('randomPos');
	speedInput = document.getElementById('speedInput');

	var checkboxes = document.querySelectorAll("input[type=\"checkbox\"], input[type=\"number\"");
	checkboxes[0].addEventListener("focus", function(e) {
		checkboxes[0].blur();
	});
	checkboxes[1].addEventListener("focus", function(e) {
		checkboxes[1].blur();
	});
	speedInput.addEventListener("input", function() {
		speed = parseFloat(speedInput.value);
	});
	newGame();
}

function windowResized() {
	setHeight = windowHeight-530;
	if(setHeight < 200) setHeight = 200;
	resizeCanvas(windowWidth, setHeight);
	position = [[0, 0], [width*0.2, 0], [width*-0.2, 0]];
}

function draw() {
	clear();
	angleMode(DEGREES); // using degrees not radian
	translate(width/2, 100); // origin is the middle of the canvas;
	noStroke();
	textAlign(CENTER);
	fill(255, 255, 255);
	ratio = fails == 0 ? total : ((total-fails)/fails).toFixed(2);
	ratio = fails == total ? 0 : ((total-fails)/fails).toFixed(2);
	text("Total : " + total, 0, -20);
	text("Points : " + points, 0, 0);
	text("Fails : " + fails, 0, 20);
	text("Ratio : " + ratio, 0, 40);

	if(endgame) {
		text("PREPARE...", 0, -40);
		noFill();
		strokeWeight(4);
		stroke(color("#595959")); // gray
		ellipse(0, 0, 150, 150); // gray ellipse
		if(frameCount >= currentTime+newTime) { // si le temps actuel en fps est supérieur ou égal au temps à la fin de la partie précedente + le délai, on joue à nouveau
			endgame = false;
		}
		return;
	}
	move+=speed;
	noFill();
	strokeWeight(4);
	stroke(color("#595959")); // gray
	ellipse(position[rand][0], position[rand][1], 150, 150); // gray ellipse
	if(!onlyWhite.checked) {
		strokeWeight(10);
		stroke(color(255, 255, 255)); // white
		arc(position[rand][0], position[rand][1], 150, 150, x, y); // white outline
		stroke(color(0, 0, 0)); // black
		strokeWeight(8);
		arc(position[rand][0], position[rand][1], 150, 150, x, y); // black arc
	}

	strokeWeight(10);
	stroke(color(255, 255, 255)); // white
	arc(position[rand][0], position[rand][1], 150, 150, xb, yb); // white arc

	stroke(color(173, 6, 6)); // red
	strokeWeight(4);
	translate(position[rand][0], position[rand][1])
	rotate(move);
	line(0, -65, 0, -95); // red dot

	if(move >= 360) { // Le curseur fait un tour complet = raté
		fails++;
		newGame();
	}
	
}

function keyPressed() {
	if(keyCode == 32) {
		if(endgame) return;
		var angle = floor(move%360-90);
		if(angle >= xb-2 && angle <= yb+2) { // on touche l'arc blanc
			points += 150;
		}
		else if(angle >= x-2 && angle <= y+2 && !onlyWhite.checked) { // on touche l'arc noir
			points += 50;
		}
		else {
			fails++;
		}
		newGame();
	}
}

function newGame() {
	console.log(speed);
	endgame = true;
	currentTime = frameCount;
	newTime = floor(random(30, 210)+1); // un nouveau cercle apparait entre 0.5s et 3.5s (car 60fps donc 60 = 1 seconde)
	x = random(1, 184); // [1, 184]
	y = x + 36; // x + 36
	xb = floor(random(x, y-3)); // [x, y-4]
	yb = xb + 3;
	move = 0;
	rand = 0;
	if(randomPos.checked) {
		rand = floor(random(0, 3));	
		console.log(rand);
	}
	total++;

}