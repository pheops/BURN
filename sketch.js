let nois, env;// analyzer;
let lfo;
let drone;
let droneMod;
let zMod;

let synth;

let buffer1;
let buffer2;
let cooling;
const w = 400;
const h = 400;

let angle = 0;
let angle2 = 0;

let ystart = 0.0;




function setup() {
  userStartAudio();
 
  synth = new p5.MonoSynth();
  synth.amp(0.1)
  
  
  nois = new p5.Noise(); // other types include 'brown' and 'pink'
  nois.start();
  nois.amp(0.1);

  lfo = new p5.Oscillator('sine');
  lfo.start();
  lfo.freq(0.10);
  lfo.amp(1100);
  lfo.disconnect();
  
  droneMod = new p5.Oscillator('sine');
  droneMod.start();
  droneMod.amp(1.0);
  droneMod.freq(10);
  droneMod.disconnect();
  
  ampMod = new p5.Oscillator('triangle');
  ampMod.start();
  ampMod.amp(1.0);
  ampMod.freq(5);
  ampMod.freq(zMod);
  ampMod.disconnect();
    
  zMod = new p5.Oscillator('sawtooth');
  zMod.start();
  zMod.amp(1.0);
  zMod.freq(0.01);
  zMod.disconnect();
  
  drone = new p5.Oscillator('sawtooth');
  drone.start();
  drone.amp(ampMod);
  drone.freq(49);
  drone.freq(droneMod);
  
  drone2 = new p5.Oscillator('sawtooth');
  drone2.start();
  drone2.amp(ampMod);
  drone2.freq(49.2);
  drone2.freq(zMod);
 
  filter = new p5.LowPass();
  filter.freq(1200);
  filter.freq(lfo);
  //filter.res(lfo);

  // Disconnect soundfile from master output.
  // Then, connect it to the filter, so that we only hear the filtered sound
  nois.disconnect();
  drone.disconnect();
  drone2.disconnect();
  synth.disconnect();
  
  //connect to filter
  nois.connect(filter);
  drone.connect(filter);
  drone2.connect(filter);
  synth.connect(filter);
  
  filter.amp(0.5);
  filter.disconnect();
  delay = new p5.Delay();
  delay.amp(0.3);
  
  delay.process(filter, .1, .7, 2300); // tell delay to process noise
  delay.setType('pingPong'); // a stereo effect
 

  //part.loop();


  
 
 

  angleMode(DEGREES);
  pixelDensity(1);
  let cnv =createCanvas(w , h);
  //cnv.mousePressed(saveArt);
  buffer1 = createGraphics(w, h);
  buffer2 = createGraphics(w, h);
  cooling = createGraphics(w, h);
  sun = new Planet(50, 0, 0, random(TWO_PI));
  sun.spawnMoons(3, 1);
}

/*
function playKick(time, params) {
  click.rate(params);
  click.play(time);
}

function playSnare(time, params) {
  beatbox.rate(params);
  beatbox.play(time);
}

function playMelody(time, params) {
 
  let note = midiToFreq(params);
  let dur = 1/32;
  //synth.play(note/2, 1, time, dur);
  synth.triggerAttack(note  );

}

*/

class Planet {
  constructor(radius, distance, orbitspeed, angle) {
    this.radius = radius;
    this.distance = distance;
    this.orbitspeed = orbitspeed;
    this.angle = angle;
    this.planets = [];
  }


  orbit() {
    this.angle += this.orbitspeed;
    for (let i in this.planets) {
      this.planets[i].orbit();
    }
  }


  spawnMoons(total, level) {
    for (let i = 0; i < total; i++) {
      let r = this.radius / (level * 3);
      let d = random(50, 150);
      let o = random(0, 3);
      let a = random(TWO_PI);
      this.planets.push(new Planet(r, d / level, o, a));
      if (level < 3) {
        let num = Math.floor(random(0, 4));
        this.planets[i].spawnMoons(num, level + 1);
      }
    }
  }


  show() {
    push();
    fill(255, 100);
    rotate(this.angle);
    translate(this.distance, 0);
    ellipse(0, 0, this.radius * 2);
    for (let i in this.planets) {
      this.planets[i].show();
    }
    pop();
  }

}

function SolarSystem(){
  
 translate(200, 200);
 sun.show();
 sun.orbit();
}

function cool() {

  
  cooling.loadPixels();
  let xoff = 0.0; // Start xoff at 0
  let increment = 0.005;
  // For every x,y coordinate in a 2D space, calculate a noise value and produce a brightness value
  for (let x = 0; x < w; x++) {
    xoff += increment ; // Increment xoff
    let yoff = ystart; // For every xoff, start yoff at 0
    for (let y = 0; y < h; y++) {
      yoff += increment ; // Increment yoff

      // Calculate noise and scale by 255
      let n = noise(xoff, yoff);
      let bright = pow(n, 5) * 255;

      // Try using this line instead
      //let bright = random(0,255);

      // Set each pixel onscreen to a grayscale value
      let index = (x + y * w) * 4;
      cooling.pixels[index] = bright;
      cooling.pixels[index + 1] = bright;
      cooling.pixels[index + 2] = bright;
      cooling.pixels[index + 3] = 0;
    }
  }

 
  
  cooling.updatePixels();
  ystart += increment;

  
}


function draw() {
  background(0);
   buffer1.noFill();
  buffer1.stroke(255);
  
  buffer1.ellipse(w / 2, h / 2, 120, 120);
  
  buffer1.push()
  buffer1.rectMode(CENTER);
  buffer1.translate(200, 200);
  
  buffer1.rotate(angle2);
  buffer1.noFill();
  buffer1.stroke(255); 
  buffer1.rect(0, 0, 200, 200);

  buffer1.pop()
  
  angle2 += 0.01;
  
 
  cool();
  
  
  buffer1.loadPixels();
  buffer2.loadPixels();
  for (let x = 1; x < w - 1; x++) {
    for (let y = 1; y < h - 1; y++) {
      let index0 = (x + y * w) * 4; // x, y
      let index1 = (x + 1 + y * w) * 4; // (x + 1), y
      let index2 = (x - 1 + y * w) * 4; // (x - 1), y
      let index3 = (x + (y + 1) * w) * 4; // x, (y + 1)
      let index4 = (x + (y - 1) * w) * 4; // x, (y - 1)

      // Because we are using only gray colors, the value of the color
      // components are the same, and we can use that as brightness.
      let c1 = buffer1.pixels[index1];
      let c2 = buffer1.pixels[index2];
      let c3 = buffer1.pixels[index3];
      let c4 = buffer1.pixels[index4];

      let c5 = cooling.pixels[index0];
      let newC = c1 + c2 + c3 + c4;
      newC = newC * 0.25 - c5;

      buffer2.pixels[index4] = newC;
      buffer2.pixels[index4 + 1] = newC;
      buffer2.pixels[index4 + 2] = newC;
      buffer2.pixels[index4 + 3] = 255;
    }
  }
  buffer2.updatePixels();

  // Swap
  let temp = buffer1;
  buffer1 = buffer2;
  buffer2 = temp;

  image(buffer2, 0, 0);
  //image(cooling, w, 0);
  
   SolarSystem();
}

function saveArt(){
   saveCanvas()
}