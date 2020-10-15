/// <reference path="ts/p5.global-mode.d.ts" />
/// <reference path="ts/p5.global-sound.d.ts" />

let cx, cy;
let img;
let sound;
let scene;

let fps = 25;

function sec(seconds) {
	return Math.floor(fps * seconds);
}

function sprite([x, y], angle, scale, coloring) {	
	if (scale == undefined)	scale = 1;
	if (scale > 0) {
		let tintedImg = 
			img.tint(
				coloring ? 
				[
					Math.min(coloring[0], 255) / 255, 
					Math.min(coloring[1], 255) / 255, 
					Math.min(coloring[2], 255) / 255, 
					1
				] : 
				[1, 1, 1, 1]
			);			
		

		let w = img.width * scale;
		let h = img.height * scale;
		
		resetMatrix();		
		translate(x, y);

		if (angle !== 0) {			
			rotate(angle % 360);
		}
			
		image(tintedImg, -w / 2, -h / 2, w, h);			
	}
}

function spin()  {
	return animate(sprite, sec(2), [[cx, cy]], [0, 3 * 360], [0, 1], [[100, 100, 100], [255, 255, 0]])
}

function move()  {
	let n = width / 250;
	let m = height / 250;

	return parallel(run => {
		for(let x = 0; x < n; x++) {
			for(let y = 0; y < m; y++) {
				let delay = (x * m + y) / (n * m);				
				run(
					sequence([
						wait(1 + sec(2 * delay)),
						animate(sprite, sec(2.5) - sec(2 * delay), 
							[[cx, cy], [125 + x * 250, 125 + y * 250]], 
							null, 
							[1, 0.5], 
							[[255, 255, 0], 
							[y * 255 / m, 128, x * 255 / n]])
					])					
				);
			}
		}
	});
}

function shakeAll()  {	
	let n = width / 250;
	let m = height / 250;

	return parallel(run => {
		for(let x = 0; x < n; x++) {
			for(let y = 0; y < m; y++) {
				run(
					animate(() => {
						sprite([125 + x * 250 + random(-3, 3), 125 + y * 250 + random(-3, 3)], 0, 0.5 + random(-0.1, 0.1), [y * 255 / m, 128, x * 255 / n]);
					}, sec(2))
				);					
			}
		}
	});
}

function shiftAll()  {	
	let n = width / 250;
	let m = height / 250;	

	return parallel(run => {
		for(let x = 0; x < n; x++) {
			for(let y = 0; y < m; y++) {				
				run(
					animate(sprite, sec(1), 
						[
							[125 + x * 250, 125 + y * 250], 
							[125 + x * 250 - 50, 125 + y * 250 - 50], 
							[125 + x * 250, 125 + y * 250],
							[125 + x * 250 -50, 125 + y * 250 -50], 
							[125 + x * 250, 125 + y * 250]
						], 
						[0, -30, 0, 0, -30, 0, 0], 
						[0.5],
						[
							[y * 255 / m, 128, x * 255 / n], 																
							[x * 255 / m, 0, y * 255 / n], 							
							[y * 255 / m, 128, x * 255 / n]
						])
				);			
			}
		}
	});
}


function spinAll(getSpin)  {	
	let n = width / 250;
	let m = height / 250;	

	return parallel(run => {
		for(let x = 0; x < n; x++) {
			for(let y = 0; y < m; y++) {				
				run(
					animate(sprite, sec(6), 
						[[125 + x * 250 + random(-3, 3), 125 + y * 250 + random(-3, 3)]], 
						[0, getSpin(x, y)], 
						[0.5, 0.5 + random(-0.1, 0.1)],
						[
							[y * 255 / m, 128, x * 255 / n], 
							[y * 255 / m + 64, 128, x * 255 / n],
							[y * 255 / m + 128, 128, x * 255 / n + 128],
							[y * 255 / m + 255, 128, x * 255 / n],				
							[y * 255 / m, 128, x * 255 / n],							
							[y * 255 / m + 64, 128, x * 255 / n],
							[y * 255 / m + 128, 128, x * 255 / n + 128],
							[y * 255 / m + 255, 128, x * 255 / n],
							[y * 255 / m, 128, x * 255 / n]
						])
				);			
			}
		}
	});
}

function waitToStart() {	
	fill('white');
	textSize(30);
	textAlign(CENTER);
	text('Turn on audio! And click to start...', windowWidth / 2, windowHeight / 2);

	if (mouseIsPressed) {
		sound.play();
		return false;
	}

	return true;		
}

function preload() {	
	img = loadImage('assets/head.png');  
	sound = loadSound('assets/bensound-dance.mp3');
}  

function setup() {
	createCanvas(displayWidth, displayHeight);	    
    cx = width / 2;
	cy = height / 2;
	
    frameRate(fps);
	angleMode(DEGREES);

	scene = //shiftAll();
		sequence([
			waitToStart, 
			wait(sec(0.5)), 
			spin(), 
			move(), 
			repeat(100, 
				sequence([
					shakeAll(), 
					spinAll(() => 360 * 10), 
					repeat(2, shiftAll()),
					shakeAll(), 					
					shakeAll(), 
					spinAll((x, y) => (x + y) % 2 ? - 360 * 5 : 360 * 5), 
					repeat(2, shiftAll()),
					shakeAll(), 
					spinAll((x, y) => y % 2 ? 4 * 360 : -8 * 360),
					repeat(2, shiftAll()),
				]))
			]);	
}

function draw() {
	background(0);
	scene();
}

function mousePressed() {	
	let fs = fullscreen();
	fullscreen(!fs);	
}