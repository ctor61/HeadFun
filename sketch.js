/// <reference path="ts/p5.global-mode.d.ts" />
/// <reference path="ts/p5.global-sound.d.ts" />

let w, h, cx, cy;
let img;
let sound;
let animations = [];
let fps = 25;

function setup() {
    w = displayWidth;
    h = displayHeight;
    cx = w / 2;
	cy = h / 2;
	
    createCanvas(w, h);
    frameRate(fps);
	angleMode(DEGREES);
}

function preload() {
	img = loadImage('assets/head.png');  
	sound = loadSound('assets/bensound-dance.mp3');
}
  
function interpolate(array, t, duration) { 
    let index = Math.floor(t * array.length / duration);
    
    if (array.length == index + 1) return array[index];
    
    let v1 = array[index];
    let v2 = array[index + 1];

	let stepDuration = duration / array.length;
	let f = (t - (stepDuration * index)) / stepDuration;
    		
	if (v1 instanceof Array) {
        let p = [];
		for(let i = 0; i < v1.length; i++)
		{
			p.push(v1[i] + (v2[i] - v1[i]) * f);
		}
		return p;        
    } else {
		return v1 + (v2 - v1) * f;
	}
}


function sprite([t, duration], translation, rotation, scaling, coloring) {	
	let [r, g, b] = interpolate(coloring || [[0, 255, 0]], t, duration);
	let [x, y] = interpolate(translation || [[0, 0]], t, duration);
	let angle = interpolate(rotation || [0], t, duration);
	let scale = interpolate(scaling || [1], t, duration);				

	if (scale > 0) {
		tint(Math.min(r, 255), Math.min(g, 255), Math.min(b, 255));
		
		let w = img.width * scale;
		let h = img.height * scale;

		//push();
		resetMatrix();
		translate(x, y);
		if (angle !== 0) {
			rotate(angle);
		}	
		image(img, -w / 2, -h / 2, w, h);	
	}
}

function spin(frame)  {
	sprite(frame, [[cx, cy]], [0, 3 * 360], [0, 1]);
}

function delayed(frame, delay, func) {
	let start = Math.floor(delay * frame[1]);
	if (frame[0] > start) {
		func([frame[0] - start, frame[1] - start]);
	}
}

function move(frame)  {
	let n = w / 250;
	let m = h / 250;

	for(let x = 0; x < n; x++) {
		for(let y = 0; y < m; y++) {
			delayed(frame, (x * m + y) / (n * m), (f) => sprite(f, [[cx, cy], [125 + x * 250, 125 + y * 250]], null, [1, 0.5], [[0, 255, 0], [y * 255 / m, 128, x * 255 / n]]));
		}
	}
}

function shakeAll(frame)  {	
	let n = w / 250;
	let m = h / 250;

	for(let x = 0; x < n; x++) {
		for(let y = 0; y < m; y++) {
			sprite([0, 1], [[125 + x * 250 + random(-3, 3), 125 + y * 250 + random(-3, 3)]], null, [0.5, 0.5 + random(-0.1, 0.1)],
				[[y * 255 / m, 128, x * 255 / n]]);			
		}
	}
}

function spinAll(frame)  {	
	let n = w / 250;
	let m = h / 250;

	for(let x = 0; x < n; x++) {
		for(let y = 0; y < m; y++) {
			sprite(frame, [[125 + x * 250 + random(-3, 3), 125 + y * 250 + random(-3, 3)]], [0, 360 * 10], [0.5, 0.5 + random(-0.1, 0.1)],
				[
					[y * 255 / m, 128, x * 255 / n], 
					[y * 255 / m + 64, 128, x * 255 / n],
					[y * 255 / m + 128, 128, x * 255 / n + 128],
					[y * 255 / m + 255, 128, x * 255 / n],				
					[y * 255 / m, 128, x * 255 / n],
					[y * 255 / m, 128, x * 255 / n], 
					[y * 255 / m + 64, 128, x * 255 / n],
					[y * 255 / m + 128, 128, x * 255 / n + 128],
					[y * 255 / m + 255, 128, x * 255 / n],
					[y * 255 / m, 128, x * 255 / n]
				]);			
		}
	}
}


function mousePressed() {
	sound.play();
	
	let fs = fullscreen();
	fullscreen(!fs);	
}

let scenes = [{ f: spin, d: 2 }, { f: move, d: 2 }, { f: shakeAll, d: 2 }, { f: spinAll, d: 6 }];

let sceneIndex = 0;
let t = 0;

function draw() {
    background('black');

	if (t >= scenes[sceneIndex].d * fps) {
		sceneIndex = Math.min(scenes.length - 1, sceneIndex + 1);
		t = 0;		
	}

	scenes[sceneIndex].f([t, scenes[sceneIndex].d * fps]);		  
	t++;
}


/*
function triggerAnimation() {
	let time = frameCount / fps;

    let prev = null;
    
    for(let a of animations) {
        if (!a.running && !a.finished) {
            if (a.startAt != undefined && a.startAt <= time) {
				a.running = true;    
				a.startFrame = Math.floor(a.startAt * fps);
				a.frameCount = Math.floor(a.duration * fps);
				a.endFrame = frameCount + a.frameCount;                
				console.log('start2', a, time, frameCount);
            } else if (a.startAt == undefined && (!prev || prev.finished)) {
                a.running = true;				
				a.startFrame = frameCount;
				a.frameCount = Math.floor(a.duration * fps);
				a.endFrame = frameCount + a.frameCount;
				console.log('start1', a, frameCount);
            }
		}
		prev = a;
	}
}

function draw2() {
    background('black');
    tint(0, 255, 0);

	translate(0, 0);
	stroke('white');
	//text('' + frameCount, 15, 15);

	triggerAnimation();   

	for(let a of animations) {
        if (a.running) {
			let currentFrame = frameCount - a.startFrame;

            if (currentFrame >= a.frameCount) {        
                a.finished = true;
				a.running = false;	
				console.log('stopped', a);
				
				triggerAnimation();
				continue;
			}
			
			//console.log('time', currentFrame, a.frameCount);
				
			let [x, y] = interpolate(a.translate || [[0, 0]], currentFrame, a.frameCount);
			let angle = interpolate(a.rotate || [0], currentFrame, a.frameCount);
			let scale = interpolate(a.scale || [1], currentFrame, a.frameCount);
			
			console.log(x, y, angle, scale, currentFrame, a.frameCount);

			let w = img.width * scale;
			let h = img.height * scale;

			//push();
			resetMatrix();
			translate(x, y);
			rotate(angle);
			image(img, -w / 2, -h / 2, w, h);
			//pop();			
        }
    } 
}
*/