/// <reference path="ts/p5.global-mode.d.ts" />
/// <reference path="ts/p5.global-sound.d.ts" />

const tintShader = {
 vs: `
	precision highp float;
	attribute vec3 aPosition;
	attribute vec2 aTexCoord;

	varying vec2 vTexCoord;
	void main() { 
		vTexCoord = aTexCoord;

		// copy the position data into a vec4, using 1.0 as the w component
		vec4 positionVec4 = vec4(aPosition, 1.0);
		positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

		// send the vertex information on to the fragment shader
		gl_Position = positionVec4;
	}`,
 fs: `
	precision highp float;
	uniform vec2 resolution;
	uniform vec2 mouse;
	uniform float time;
	uniform sampler2D tex0;
	uniform vec4 tint;
	varying vec2 vTexCoord;

	void main() {
		vec2 pos = vTexCoord;
		pos.y = 1. - pos.y;
		//pos += vec2(-0.5, 0.5);
		vec4 c = texture2D(tex0, pos);
		//vec3 c = vec3(0,1,1);
		gl_FragColor = c * tint;
	}`
};

p5.Image.prototype.tint = function(tint) {
	if (!this._pg) {		
		this._pg = createGraphics(this.width, this.height, WEBGL);	
		this._sh = this._pg.createShader(tintShader.vs, tintShader.fs);
		this._pg.shader(this._sh);

		this._sh.setUniform("tex0", img);
		this._sh.setUniform("resolution", [this.width, this.height]);
	}

	this._sh.setUniform("tint", tint);
	this._pg.rect(this.width, this.height);
	
	return this._pg;
}  

function wait(duration) {
	let t = 0;

	let compose  = () => {	
		if (duration == 0) return false;
		t++;

		if (t >= duration) {
			t = 0;
			return false;
		}

		return true;
	};
	return compose;
}

function interpolate(keyFrameArgs, t, duration) {
	if (keyFrameArgs.length == 1) return keyFrameArgs[0];
	if (t === duration) return keyFrameArgs[keyFrameArgs.length - 1];

	let periodCount = keyFrameArgs.length - 1;
	let periodIndex = Math.floor(t * periodCount / duration);		
			
	let v1 = keyFrameArgs[periodIndex];
	let v2 = keyFrameArgs[periodIndex + 1];

	let stepDuration = duration / periodCount;
	let f = (t - (stepDuration * periodIndex)) / stepDuration;
			
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

function animate(func, duration, ...keyFrameArgs) { 
	let t = 0;

	let compose  = () => {	
		if (duration == 0) return false;
		
		if (keyFrameArgs == undefined) {
			func(t);
		} else {
			let interpolatedArgs = keyFrameArgs.map(x => x == undefined ? x : interpolate(x, t, duration));
			func.apply(null, interpolatedArgs);
		}
		
		t++;

		if (t >= duration) {
			t = 0; // for next call
			return false;
		}
		
		return true;
	};

	return compose;
}

function parallel(factory) {
	let scenes = [];

	if (factory instanceof Array) {
		scenes = factory;
	} else {
		factory((x) => scenes.push(x));	
	}	

	let running = scenes.map(x => true);

	let composed = () => {			
		let runCount = 0;

		for(let i = 0; i < scenes.length; i++) {
			if (running[i]) {
				if (scenes[i]() === true) {
					runCount++;
				} else {
					running[i] = false;
				}				
			}
		}

		if (runCount === 0) {
			running = scenes.map(x => true); // reset for next call
			return false;
		}

		return true;
	}

	return composed;
}

function sequence(factory) {	
	let scenes = [];
	
	if (factory instanceof Array) {
		scenes = factory;
	} else {
		factory((x) => scenes.push(x));	
	}

	let i = 0;

	let composed = () => {
		if (scenes[i]() !== true) i++;		

		if (i == scenes.length) {
			i = 0; // reset for next call
			return false;
		}
		
		return true;
	}

	return composed;		
}

function repeat(count, scene) {
	let i = 0;
	
	let composed = () => {
		if (count === 0) return false;	
				
		if (scene() !== true) {
			i++;		
		}

		if (i >= count) {
			i = 0; // reset for next call
			return false;
		}

		return true;
	};

	return composed;
}