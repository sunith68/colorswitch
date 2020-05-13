var multidom=document.getElementById('multiplayer');
var cdom1=document.getElementById('canvas1');
var cdom2=document.getElementById('canvas2');
var multibtn=document.getElementById('multibtn');
var mhomebtn= document.getElementById('homem');
var scoredom1=document.getElementById('score1');
var scoredom2=document.getElementById('score2');
var wintxt=document.getElementById('wintxt');
var restartm=document.getElementById('restartm');
var mgodom=document.getElementById('gameoverm');

multidom.style.display="none";
mgodom.style.display="none";

var passed1=-1;
var score1=0;
var upmove1=0;
var upt1;
var clk1=true;
var clkt1;
var anim1=false;
var fast1=0;
var rtxt1=true;
var allowClick1=true;

var passed2=-1;
var score2=0;
var upmove2=0;
var upt2;
var clk2=true;
var clkt2;
var anim2=false;
var fast2=0;
var rtxt2=true;
var allowClick2=true;

var akey=false;//left c1
var kkey=false;//right c2

var c1=cdom1.getContext('2d');
cdom1.width=0.5*window.innerWidth;
cdom1.height=0.95*window.innerHeight;
var c2=cdom2.getContext('2d');
cdom2.width=0.5*window.innerWidth;
cdom2.height=0.95*window.innerHeight;
addEventListener('resize', event => {
	cdom1.width=0.5*window.innerWidth;
	cdom1.height=0.95*window.innerHeight;
	if(anim1==true||allowClick1==false){
		obstacles1.forEach(function(obs){obs.x=cdom1.width/2});
		switches1.forEach(function(obs){obs.x=cdom1.width/2});
		mc1.x=cdom1.width/2;
	}
	cdom2.width=0.5*window.innerWidth;
	cdom2.height=0.95*window.innerHeight;
	if(anim2==true||allowClick2==false){
		obstacles2.forEach(function(obs){obs.x=cdom2.width/2});
		switches2.forEach(function(obs){obs.x=cdom2.width/2});
		mc2.x=cdom2.width/2;
	}
})

var obstacles1=[];
var obstacles2=[];
var switches1=[];
var switches2=[];
var mc1;
var mc2;

function animate1(){
	if (anim1==true){
		requestAnimationFrame(animate1);
		c1.clearRect(0,0,cdom1.width,cdom1.height);

		mc1.move();
		obstacles1.forEach(function(obs){obs.update();})
		switches1.forEach(function(cs){cs.update();mcswitch(mc1,cs,switches1);})
		obstacles1.forEach(function(obs){
			if(passCircle(obs,mc1)==false){
				gameoverm(1,c1,cdom1.width/2,cdom1.height/2,score1,mc1);
			}
		})
		if (obstacles1[0].y<-70) {
			gameoverm(1,c1,cdom1.width/2,cdom1.height/2,score1,mc1);
		}
		if (mc1.y-obstacles1[obstacles1.length-1].y<80) {
			place1();
		}
		if(score%5==0&&score!=fast){
			fast=score;
			obstacles1.forEach(function(obs){obs.spin+=0.008})
		}
		if (rtxt1==true) {rulesm(c1,cdom1.width/2,3*cdom1.height/4,`'A' key `);}
		movement(mc1,obstacles1,switches1);
		scoresm(1);
		finishm();
	}
}
function animate2(){
	if (anim2==true){
		requestAnimationFrame(animate2);
		c2.clearRect(0,0,cdom2.width,cdom2.height);

		mc2.move();
		obstacles2.forEach(function(obs){obs.update();})
		switches2.forEach(function(cs){cs.update();mcswitch(mc2,cs,switches2);})
		obstacles2.forEach(function(obs){
			if(passCircle(obs,mc2)==false){
				gameoverm(2,c2,cdom2.width/2,cdom2.height/2,score2,mc2);
			}
		})
		if (obstacles2[0].y<-70) {
			gameoverm(2,c2,cdom2.width/2,cdom2.height/2,score2,mc2);
		}
		if (mc2.y-obstacles2[obstacles2.length-1].y<80) {
			place2();
		}
		if(score%5==0&&score!=fast){
			fast=score;
			obstacles2.forEach(function(obs){obs.spin+=0.008})
		}
		if (rtxt2==true){rulesm(c2,cdom2.width/2,3*cdom2.height/4,`'K' key `);}
		movement(mc2,obstacles2,switches2);
		scoresm(2);
		finishm();
	}
}
document.addEventListener('keydown',function(e){

	if((e.key=='a'||e.key=='A')&&akey==false){
		akey=true;	
	}
	if (akey==true) {
		if (allowClick1==true){
			mc1.direction='up';
			clk=false;
			rtxt1=false;
		}
	}
	if ((e.key=='k'||e.key=='K')&&kkey==false) {
		kkey=true;
	}
	if (kkey==true) {
		if (allowClick2==true){
			mc2.direction='up';
			clk=false;
			rtxt2=false;
		}
	}
})
document.addEventListener('keyup',function(e){
	sound.play();
	if(e.key=='a'||e.key=='A'){
		akey=false;
		if (allowClick1==true){mc1.direction='down';}
	}
	if(e.key=='k'||e.key=='K'){
		kkey=false;
		if (allowClick2==true){mc2.direction='down';}
	}
	
})

function assign1(){
	let temp1=obstacles1.length;
	let temp2=switches1.length;
	switches1[temp2]=new colorSwitch(c1,cdom1.width/2);
	obstacles1[temp1]=new colorCircle(switches1[temp2].color[0],switches1[temp2].color[1],switches1[temp2].color[2],c1,cdom1.width/2);
}
function assign2(){
	let temp1=obstacles2.length;
	let temp2=switches2.length;
	switches2[temp2]=new colorSwitch(c2,cdom2.width/2);
	obstacles2[temp1]=new colorCircle(switches2[temp2].color[0],switches2[temp2].color[1],switches2[temp2].color[2],c2,cdom2.width/2);
}
function place1(){
	assign1();
	let temp1=obstacles1.length-1;
	let temp2=switches1.length-1;
	switches1[temp2].y=0;
	obstacles1[temp1].y=-250;
}
function place2(){
	assign2();
	let temp1=obstacles2.length-1;
	let temp2=switches2.length-1;
	switches2[temp2].y=0;
	obstacles2[temp1].y=-250;
}
function rulesm(c,x,y,side){
	c.font='25px Concert One';
	c.textAlign='center';
	c.fillStyle="rgba(224,224,224,0.5)";
	c.fillText("Click or Hold the mouse down ",x,y);
	c.fillText(`${side}to move up`,x,y+30);
}
function gameoverm(num,c,x,y,score,mc){
	if(num==1){
		anim1=false;
		c1.clearRect(0,0,cdom1.width,cdom1.height);
		mc1='gameover';
	}
	else{
		anim2=false;
		c2.clearRect(0,0,cdom2.width,cdom2.height);
		mc2='gameover';
	}
	c.font='50px Concert One';
	c.textAlign='center';
	c.fillStyle="rgba(224,224,224)";
	c.fillText(`Gameover`,x,y-30);
	c.fillText(`Score : ${score}`,x,y+30);
}
function finishm(){
	if(mc1=='gameover'&&mc2=='gameover'){
		multidom.style.display='none';
		mgodom.style.display="block";
		if(score1>score2){wintxt.innerText='Left Player Wins'}
		if(score1<score2){wintxt.innerText='Right Player Wins'}
		if(score1==score2){wintxt.innerText='Its a Draw'} 
	}
}

multibtn.addEventListener('click',function(){
	console.log(menudom);
	menudom.style.display="none";
	multidom.style.display='block';
	mc1= new mainCharecter(colors[Math.floor(Math.random()*5)],c1,cdom1.width/2,cdom1.height/2);
	assign1();
	mc2= new mainCharecter(colors[Math.floor(Math.random()*5)],c2,cdom2.width/2,cdom2.height/2);
	assign2();
	anim1=true;
	anim2=true;
	animate1();
	animate2();
})
mhomebtn.addEventListener('click',function(){
	sound.play();
	location.reload();
})
function scoresm(num){
	if(num==1){
		for (var i = 0; i < obstacles1.length; i++) {
			if(obstacles1[i].y>mc1.y&&i>passed1){
				score1++;
				passed1++;
			}
		}
		if (score1>parseInt(scoredom1.innerText)) {
			scoredom1.innerText=score1;
		}
	}
	else{
		for (var i = 0; i < obstacles2.length; i++) {
			if(obstacles2[i].y>mc2.y&&i>passed2){
				score2++;
				passed2++;
			}
		}
		if (score2>parseInt(scoredom2.innerText)) {
			scoredom2.innerText=score2;
		}	
	}
}
restartm.addEventListener('click',function(){
	multidom.style.display="block";
	mgodom.style.display="none";
	anim1=true;
	anim2=true;
	obstacles1=[];
	obstacles2=[];
	switches1=[];
	switches2=[];
	score1=0;
	score2=0;
	scoredom1.innerText=score1;
	scoredom2.innerText=score2;
	passed1=-1;
	passed2=-2;
	mc1= new mainCharecter(colors[Math.floor(Math.random()*5)],c1,cdom1.width/2,cdom1.height/2);
	assign1();
	mc2= new mainCharecter(colors[Math.floor(Math.random()*5)],c2,cdom2.width/2,cdom2.height/2);
	assign2();
	animate1();
	animate2();
})