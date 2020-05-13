var canvasdom = document.querySelector("canvas");
var clockdom =document.getElementById('clock');
var pause=document.getElementById('pausebtn');
var restart=document.getElementById('restartbtn');
var scoredom=document.getElementById('score');
var hscoredom=document.getElementById('hscore');
var menudom=document.getElementById('menu');
var topdom=document.getElementById('top');
var rulesdom=document.getElementById('rules');
var rulesbtn=document.getElementById('rulestxt');
var menubtn=document.getElementById('menubtn');
var startbtn=document.getElementById('startbtn');
var lldom=document.getElementById('liquidLuck');
var allbtns=document.querySelectorAll('.button');

var ms;
var s;
var m;
var t;
var wait;
var endt=false;
var score=0;
var hscore;
var anim=true;
var allowClick=true;
let x;
let y;
let r=20;
var bubbles= [];
var v=300;
var rtemp=0;
var gtemp=0;
var llt;
var lllife=2;
var llstatus=false;
var temp;
var vel;
var sound= new Audio();
sound.src="pop.mp3";

var c=canvasdom.getContext('2d');
canvasdom.width=0.95*window.innerWidth;
canvasdom.height=0.85*window.innerHeight;
addEventListener('resize', event => {
	canvasdom.width=0.95*window.innerWidth;
	canvasdom.height=0.85*window.innerHeight;
	if(canvasdom.style.display=='block'){
		bubbles=[];
		timerReset();
		timer();
		anim=true;
		v=300;
		endt=false;
		allowClick=true;
		score=0;
		scoredom.innerText='0';
		rtemp=0;
		lllife=2;
		llstatus=false;
	}
})
//time functions
function timer(){
	t=setInterval(run ,10);
}
function run(){
	clockdom.textContent=revealtime();
	ms++;
	if(ms==100){
		s++;
		ms=0;
	}
	if(s==60){
		m++;
		s=0;
	}
	bubbleTime();
}
function revealtime(){
	return( m + ' : ' + (s<10?'0'+ s:s) + ' : ' + (ms<10?'0'+ ms:ms));
}
function timevalue(){
	return((m*60*100) + (s*100) +ms);
}
function timerStop(){
	clearInterval(t);
	ms--;	
}
function timerplay(){
	t=false;
	timer();
}
function timerReset(){
	clearInterval(t);
	t=false;
	ms=0;
	s=0;
	m=0;
	run();
	ms--;
}
//time functions ends here
//bubble object
var img= new Image();
img.src='gauntlet.png';


function bubble(x,y,r,vel){
	this.x=x;
	this.y=y;
	this.r=r;
	this.duplicatev={
		x:0.3,
		y:0.3
	};
	this.velocity=vel;
	this.area=Math.PI*this.r*this.r;
	this.worth=this.r<55?3-((this.r%30)/10):10;
	this.mass=1;
	this.strength= this.r>50?5:1;
	this.color= this.r<55?'rgba(126, 207, 255,0.4)':"rgb(78,42,42)" ;
	this.createGauntlet=function(){
		if(r==45){
			this.worth=1;
			c.drawImage(img,this.x-35,this.y-35,70,70);
		}
	}	
	this.create= function() {
		c.beginPath();		
		c.arc(this.x,this.y,this.r,0,Math.PI*2,true);
		c.strokeStyle='#82B8D9';
		c.fillStyle=this.color;
		c.fill();
		c.stroke();
		c.closePath();
		this.createGauntlet();
	};	
	this.bounce=function(){
		for(var i=0;i<bubbles.length;i++){
			if(bubbles[i]===this){
				continue;
			}
			if(distance(bubbles[i].x,bubbles[i].y,this.x,this.y)<this.r+bubbles[i].r){
				resolveCollision(this,bubbles[i]);
			}
			
		}
	};
	this.move= function(){
		this.create();
			if(llstatus==true&&this.velocity.x!=0.3){
				temp=this.velocity;
				this.velocity=this.duplicatev;
				this.duplicatev=temp;
			}
			if(this.x+this.velocity.x>=(canvasdom.width-this.r)||this.x+this.velocity.x<=this.r){	
					this.velocity.x*=-1;
			}
			if(this.y+this.velocity.y>=(canvasdom.height-this.r)||this.y+this.velocity.y<=this.r){
					this.velocity.y*=-1;
			}

		this.bounce();
		this.x+=this.velocity.x;
		this.y+=this.velocity.y;
		
	};
}
//bubble object ends here
function distance(x1,y1,x2,y2){
	return (Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)))
}

function generate(){
	 r=(Math.floor(Math.random()*3)*10)+30;
	 if(score>70&&score!=rtemp&&score-rtemp>=31){
	 	r=60;
	 	rtemp=score;
	 }
	 if (score>75&&score!=gtemp&&score-gtemp>=100) {
	 	r=45;
	 	gtemp=score;
	 }
	 vel={
	 	x:(Math.random()-0.5)*3,
		y:(Math.random()-0.5)*3
	 };
	 x=(Math.random()*(canvasdom.width-(2*r)))+r;
	 y=(Math.random()*(canvasdom.height-(2*r)))+r;
}
function addBubble(){
	let temp1=bubbles.length;
	generate();
	for(var j=0;j<temp1;j++){
		if(distance(bubbles[j].x,bubbles[j].y,x,y)<r+bubbles[j].r){
			generate();
			j=-1;
		}
	}
	bubbles[temp1]=new bubble(x,y,r,vel);
}
function bubbleTime(){	
	var q=timevalue();
	if((q%1500==0)){
		v-=Math.floor(q/600)*20;
		if(v<100){
			v=100;
		}
	}
	if(q%v==0){
		addBubble();
	}
}
//pause and restart starts 
restart.addEventListener('click',function(){
	bubbles=[];
	timerReset();
	timer();
	anim=true;
	pause.style.display='inline-block';
	if (pause.innerText=='Play') {
		pause.innerText='Pause';
	}
	v=300;
	endt=false;
	allowClick=true;
	score=0;
	rtemp=0;
	lllife=2;
	llstatus=false;
	llupdate();
})
pause.addEventListener('click',function(){
	var txt=pause.innerText;
	if(txt=='Pause'){
		timerStop();
		pause.innerText='Play';
		anim=false;
		allowClick=false;
	}
	else{
		timerplay();
		pause.innerText='Pause';
		anim=true;
		allowClick=true;
	}
})
//pause and restart ends here
function tarea(){
	var ta=0;
	for (var i = 0; i < bubbles.length; i++) {
		ta+=bubbles[i].area;
	}
	return ta;
}
function gameover(){
	c.clearRect(0, 0, canvasdom.width, canvasdom.height);
	timerStop();
	bubbles=[];
	pause.style.display='none';
	anim=false;
	c.font='70px Creepster';
	c.textAlign='center';
	c.fillStyle="#D11E1E";
	c.fillText("Game Over",canvasdom.width/2,canvasdom.height/2);
	clearInterval(wait);
	wait=false;
	endt=false;
	lllife=2;
	llstatus=false;
}

function animate(){
	requestAnimationFrame(animate);		
	if(anim==true){		
		c.clearRect(0, 0, canvasdom.width, canvasdom.height);
		bubbles.forEach(function(bub){
			bub.move();
		})
		if(tarea()>(0.7*canvasdom.width*canvasdom.height)){
			endt=true;
		}
		if(tarea()>(0.5*canvasdom.width*canvasdom.height)){
				wait=setInterval(function(){
					endt=true;
				},5000);
		}
		else if(tarea()<(0.5*canvasdom.width*canvasdom.height)){
			clearInterval(wait);
			wait=false;
			endt=false;
		}
		if(endt==true){
			gameover();
		}

	}
}
// collision between balls starts here
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
        const m1 = particle.mass;
        const m2 = otherParticle.mass;
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;
        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
//collision between balls ends here
function getPosition(e) {
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  return {
    x,
    y
  }
}
canvasdom.addEventListener('click',function(e){
	
	if (allowClick==true) {
		var pos=getPosition(e);
		for(var i=0;i<bubbles.length;i++)
		{   
			if(distance(pos.x,pos.y,bubbles[i].x,bubbles[i].y)<=bubbles[i].r){

				sound.play();
				if(bubbles[i].strength==1){
					score+=bubbles[i].worth;
					scoredom.innerText=score;
					assignhs();
					if(bubbles[i].r==45){
						bubbles.splice(i,1)
						gauntletSnap(i);
					}
					else{
						bubbles.splice(i,1);
					}
				}
				else{
					bubbles[i].strength--;
					bubbles[i].color=`rgba(78,42,42,${bubbles[i].strength*0.1+0.4})`
				}
			}
		}
	}
})
function assignhs(){
	if (localStorage.getItem('hs')==null) {
		localStorage.setItem('hs',0);
	}
	if(parseInt(localStorage.getItem('hs'))<score){
		localStorage.setItem('hs',score);
	}
	hscoredom.innerText=localStorage.getItem('hs');
}
//menu starts
function openmenu(){
	topdom.style.display="none";
	canvasdom.style.display="none";
	rulesdom.style.display='none';
	menubtn.style.display='none';
}
function hidemenu(){
	menudom.style.display="none";
	topdom.style.display="block";
	canvasdom.style.display="block";
}
openmenu();
function startGame(){
	hidemenu();
	assignhs();
	animate();
	timerReset();
	timer();
	lldom.style.display="inline";
}
rulesbtn.addEventListener('click',function(){
	menudom.style.display='none';
	rulesdom.style.display='block';
	menubtn.style.display='block';
})
menubtn.addEventListener('click',function(){
	menudom.style.display='block';
	rulesdom.style.display='none';
	menubtn.style.display='none';	
})
startbtn.addEventListener("click",function(){
	startGame();
})
//menu ends
function llupdate(){
	if(lllife==2){
		lldom.innerText="Liquid Luck ||";
	}
	else if(lllife==1){
		lldom.innerText="Liquid Luck |";
	}
	else{
		lldom.style.display="none";
	}
}
lldom.addEventListener('click',function(){
	if (lllife>0&&llstatus==false) {
		lllife--;
		llstatus=true;
		llupdate();
		llt=setInterval(function(){
			bubbles.forEach(function(bub){
			
				temp=bub.velocity;
				bub.velocity=bub.duplicatev;
				bub.duplicatev=temp;
			
			})
			console.log(2);
			llstatus=false;
			clearInterval(llt);
			llt=false;
		},5000)		
	}
})
function gauntletSnap(i){
	bubbles.splice(0,parseInt(bubbles.length/2));
}
allbtns.forEach(function(btn){
	btn.addEventListener('click',function(){
		sound.play()
	})
})