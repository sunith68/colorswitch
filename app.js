var canvasdom=document.querySelector('canvas');
var scoredom=document.getElementById('score');
var hscoredom=document.getElementById('hscore');
var topdom=document.getElementById('top');
var menudom=document.getElementById('menu');
var startbtn=document.getElementById('startbtn');
var enddom=document.getElementById('end');
var restartbtn=document.getElementById('restart');
var pause=document.getElementById('pausebtn');
var homebtn=document.getElementById('home');

var passed=-1;
var score=0;
var upmove=0;
var upt;
var clk=true;
var clkt;
var anim=false;
var fast=0;
var rtxt=true;
var allowClick=true;

var colors=[
	"#ffcc00",
	'#1ab2ff',
	'#ff0055',
	'#8c1aff',
	'#33cc33'
]
var sound= new Audio();
sound.src="click.mp3";

var c=canvasdom.getContext('2d');
canvasdom.width=window.innerWidth;
canvasdom.height=0.95*window.innerHeight;
addEventListener('resize', event => {
	canvasdom.width=window.innerWidth;
	canvasdom.height=0.95*window.innerHeight;
	if(anim==true||allowClick==false){
		obstacles.forEach(function(obs){obs.x=canvasdom.width/2});
		switches.forEach(function(obs){obs.x=canvasdom.width/2});
		mc.x=canvasdom.width/2;
	}
})

function mainCharecter(col,c,x,y){
	this.color=col;
	this.x=x;
	this.y=y;
	this.speed=2;
	this.relspeed=0.5;
	this.direction='none';
	this.draw=function(){
		c.beginPath();		
		c.arc(this.x,this.y,8,0,Math.PI*2,true);
		c.fillStyle=this.color;
		c.strokeStyle=this.color;
		c.stroke();
		c.fill();
		c.closePath();
	};
	this.move=function(){
		this.draw();
	};
} 
canvasdom.addEventListener('click',function(e){		
	if (allowClick==true){
		sound.play();
	 	if (clk==true)
		{moveup(400);}
		else{clk=true}
	}
})
function moveup(amt){
	if (mc.direction=='up') {
		clearInterval(upt);
		upt=false;
	}
	mc.direction='up';
	upt=setInterval(function(){
		mc.direction='down'
		clearInterval(upt);
		upt=false;
	},amt)
}
canvasdom.addEventListener('mousedown',function(e){
	if (allowClick==true){
		mc.direction='up';
		clk=false;
		rtxt=false;}
})
canvasdom.addEventListener('mouseup',function(e){
	if (allowClick==true){mc.direction='down';}
	
})
function colorSwitch(c,x){
	let ctemp=Math.floor(Math.random()*5)
	this.color=[];
	this.color[0]=colors[ctemp];
	for (var i = 0; i < 3; i++) {
		this.color[i]=colors[Math.floor(Math.random()*5)];
		for (var j = 0; j< 3; j++) {
			if (this.color[i]==this.color[j]&&i!=j) {
				i--;
				break;
			}
		}
	}
	this.x=x;
	this.y=250;
	this.angle=0;
	this.r=10;
	this.draw=function(angle){
		c.beginPath();
		c.fillStyle=this.color[0];	
		c.arc(this.x,this.y,this.r,0+angle,2*Math.PI/3+angle);
		c.fill();
		c.closePath();

		c.beginPath();
		c.fillStyle=this.color[1];
		c.arc(this.x,this.y,this.r,2*Math.PI/3+angle,4*Math.PI/3+angle);
		c.fill();
		c.closePath();

		c.beginPath();
		c.fillStyle=this.color[2];
		c.arc(this.x,this.y,this.r,4*Math.PI/3+angle,Math.PI*2+angle);
		c.fill();
		c.closePath();	
	}
	this.update=function(){
		this.draw(this.angle);
		this.angle+=0.05;
	}
}
function mcswitch(tmc,obj,switches){
	if (Math.abs(obj.y-tmc.y)<=10) {	
			tmc.color=obj.color[0];
			for (var i = 0; i < switches.length; i++) {
				if(switches[i].color[0]==obj.color[0]){
					switches.splice(i,1);
				}
			}
		}	
}
function colorArc(col,a1,a2){
	this.color=col;
	this.angle1=a1;
	this.angle2=a2;
}
function colorCircle(col1,col2,col3,c,x){
	this.x=x;
	this.y=100;
	this.r=80;
	this.bottomc;
	this.topc;
	this.spin=0.01;
	this.arc=[];
	this.arc[0]=new colorArc(col1,0,2*Math.PI/3);
	this.arc[1]=new colorArc(col2,2*Math.PI/3,4*Math.PI/3);
	this.arc[2]=new colorArc(col3,4*Math.PI/3,2*Math.PI);
	this.draw=function(){
		c.lineWidth=10;
		for(let i=0;i<3;i++){
			c.beginPath();	
			c.strokeStyle=this.arc[i].color;	
			c.arc(this.x,this.y,this.r,this.arc[i].angle1,this.arc[i].angle2);
			c.stroke();
			c.closePath();
		}
	}
	this.rotate=function(){
		for (var i = 0; i < 3; i++) {
			this.arc[i].angle1+=this.spin;
			this.arc[i].angle2+=this.spin;
		}
		if (this.spin>0.3) {this.spin=0.3}
		this.draw();
	}
	this.update=function(){
		this.rotate();
		this.topbottom();
	}
	this.topbottom=function(){
		for (var i = 0; i < 3; i++) {
			if(check(this.arc[i].angle1)=='top'){
				this.topc=this.arc[i].color;
			}
			if(check(this.arc[i].angle1)=='bottom'){
				this.bottomc=this.arc[i].color;	
			}
		}
	}
}
function distance(x1,y1,x2,y2){
	return (Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)))
}
function passCircle(obs,mc){
	if (obs.r>=50) {
		dist=Math.abs(obs.y-mc.y)
		if(dist<=90&&dist>=80){
			if(obs.y<mc.y){
				if (mc.color==obs.bottomc) {

					return true
				}
				else{return false}
			}
			if(obs.y>mc.y){
				if (mc.color==obs.topc) {
					return true
				}
				else{return false}
			}
		}
		else{
			true
		}
	}
}
function check(startangle){
	let convang=startangle - (Math.floor(startangle/(2*Math.PI))*Math.PI*2);
	if(convang<Math.PI/2||convang>11*Math.PI/6){
		return "bottom";
	}
	else if(convang<3*Math.PI/2&&convang>5*Math.PI/6) {
		return "top";
	}
}
//check scores
function scores(){
	for (var i = 0; i < obstacles.length; i++) {
		if(obstacles[i].y>mc.y&&i>passed){
			score++;
			passed++;
		}
	}
	if (score>parseInt(scoredom.innerText)) {
		scoredom.innerText=score;
	}
}

var mc;
var obstacles=[];
var switches=[];
function animate(){
	if (anim==true){
		requestAnimationFrame(animate);
		c.clearRect(0,0,canvasdom.width,canvasdom.height);
		mc.move();
		obstacles.forEach(function(obs){obs.update();})
		switches.forEach(function(cs){cs.update();mcswitch(mc,cs,switches);})
		obstacles.forEach(function(obs){
			if(passCircle(obs,mc)==false){
				gameover();
			}
		})
		if (obstacles[0].y<-70) {
			gameover();
		}
		if (mc.y-obstacles[obstacles.length-1].y<80) {
			place();
		}
		if(score%5==0&&score!=fast){
			fast=score;
			obstacles.forEach(function(obs){obs.spin+=0.008})
		}
		if (rtxt==true) {rules(canvasdom.width/2,3*canvasdom.height/4);}
		movement(mc,obstacles,switches);
		scores();
		assignhs();
	}
}

function getPosition(e) {
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  return (y);
}
//cehck assign
function assign(){
	let temp1=obstacles.length;
	let temp2=switches.length;
	switches[temp2]=new colorSwitch(c,canvasdom.width/2);
	obstacles[temp1]=new colorCircle(switches[temp2].color[0],switches[temp2].color[1],switches[temp2].color[2],c,canvasdom.width/2);
}
//check place
function place(){
	assign();
	let temp1=obstacles.length-1;
	let temp2=switches.length-1;
	switches[temp2].y=0;
	obstacles[temp1].y=-250;
}
function movement(mc,obstacles,switches){
	if (mc.direction=='up') {
		obstacles.forEach(function(obs){
			obs.y+=mc.speed;
		})
		switches.forEach(function(obs){
			obs.y+=mc.speed;
		})
	}
	else if(mc.direction=='down'){
			obstacles.forEach(function(obs){
				obs.y-=mc.speed;
			})
			switches.forEach(function(obs){
				obs.y-=mc.speed;
			})
	}
}
function rules(x,y){
	c.font='35px Concert One';
	c.textAlign='center';
	c.fillStyle="rgba(224,224,224,0.5)";
	c.fillText("Click or Hold the mouse down to move up",x,y);
}
//check gameover
function gameover(){
	anim=false;
	canvasdom.style.display='none';
	enddom.style.display='block';
}
pause.addEventListener('click',function(){
	var txt=pause.innerText;
	if(txt=='Pause'){
		pause.innerText='Play';
		anim=false;
		allowClick=false;
	}
	else{
		pause.innerText='Pause';
		anim=true;
		animate();
		allowClick=true;
	}
})
//check scores
function scores(){
	for (var i = 0; i < obstacles.length; i++) {
		if(obstacles[i].y>mc.y&&i>passed){
			score++;
			passed++;
		}
	}
	if (score>parseInt(scoredom.innerText)) {
		scoredom.innerText=score;
	}
}
function assignhs(){
	if (localStorage.getItem('cshs')==null) {
		localStorage.setItem('cshs',0);
	}
	if(parseInt(localStorage.getItem('cshs'))<score){
		localStorage.setItem('cshs',score);
	}
	hscoredom.innerText=localStorage.getItem('cshs');
}
function openmenu(){
	menudom.style.diplay='block';
	topdom.style.display="none";
	canvasdom.style.display="none";
	enddom.style.display='none'
}
function hidemenu(){
	menudom.style.display="none";
	topdom.style.display="block";
	canvasdom.style.display="block";
}

startbtn.addEventListener('click',function start(){
	hidemenu();
	mc= new mainCharecter(colors[Math.floor(Math.random()*5)],c,canvasdom.width/2,canvasdom.height/2);
	assign();
	anim=true;
	animate();
})
restartbtn.addEventListener('click',function(){
	enddom.style.display='none';
	canvasdom.style.display='block';
	mc= new mainCharecter(colors[Math.floor(Math.random()*5)],c,canvasdom.width/2,canvasdom.height/2);
	obstacles=[];
	switches=[];
	score=0;
	scoredom.innerText=score;
	anim=true;
	passed=-1;
	fast=0;
	assign();
	animate();
})
homebtn.addEventListener('click',function(){
	location.reload();
})
openmenu();
//add a white moving bar tht clears any color ball