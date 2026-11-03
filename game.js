(() => {
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const W=1200,H=675,groundY=548;
const startScreen=document.getElementById('startScreen'),pauseScreen=document.getElementById('pauseScreen'),overScreen=document.getElementById('gameOverScreen');
const pauseBtn=document.getElementById('pauseBtn'),touchControls=document.getElementById('touchControls');
let state='start',keys={},player,items,obstacles,particles,clouds,score,timeLeft,lives,shield,worldSpeed,spawnTimer,lastTime=0,elapsed=0,bgOffset=0,audioCtx=null;
const rand=(a,b)=>Math.random()*(b-a)+a;
function sound(freq=600,duration=.09,type='sine'){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.08,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration)}catch(e){}}
function reset(){player={x:170,y:groundY-94,w:65,h:94,vy:0,onGround:true,duck:false,inv:0,run:0};items=[];obstacles=[];particles=[];score=0;timeLeft=90;lives=3;shield=0;worldSpeed=330;spawnTimer=.5;elapsed=0;bgOffset=0;clouds=Array.from({length:8},()=>({x:rand(0,W),y:rand(55,230),s:rand(.55,1.25)}))}
function start(){reset();state='playing';startScreen.classList.add('hidden');pauseScreen.classList.add('hidden');overScreen.classList.add('hidden');pauseBtn.classList.remove('hidden');touchControls.classList.remove('hidden');lastTime=performance.now();sound(740,.14)}
function pause(){if(state==='playing'){state='paused';pauseScreen.classList.remove('hidden')}else if(state==='paused'){state='playing';pauseScreen.classList.add('hidden');lastTime=performance.now()}}
function end(){state='over';pauseBtn.classList.add('hidden');touchControls.classList.add('hidden');document.getElementById('finalStats').textContent=`You collected ${score} stars in your magical run!`;overScreen.classList.remove('hidden');sound(180,.35,'triangle')}
document.getElementById('startBtn').onclick=start;document.getElementById('restartBtn').onclick=start;document.getElementById('pauseBtn').onclick=pause;document.getElementById('resumeBtn').onclick=pause;
addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();keys[e.key]=true;if((e.key===' '||e.key==='ArrowUp'||e.key==='w'||e.key==='W')&&state==='playing')jump();if(e.key==='Escape')pause()});
addEventListener('keyup',e=>keys[e.key]=false);
document.querySelectorAll('.touch-controls button').forEach(b=>{let k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;if(k==='ArrowUp'&&state==='playing')jump()});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false))});
function jump(){if(player.onGround){player.vy=-690;player.onGround=false;player.duck=false;sound(420,.08)}}
function rounded(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function starPath(cx,cy,outer,inner){ctx.beginPath();for(let i=0;i<10;i++){let a=-Math.PI/2+i*Math.PI/5,r=i%2?inner:outer;let x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath()}
function drawCloud(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#ffffffc9';ctx.beginPath();ctx.arc(0,15,28,0,Math.PI*2);ctx.arc(27,0,36,0,Math.PI*2);ctx.arc(62,15,27,0,Math.PI*2);ctx.arc(32,22,30,0,Math.PI*2);ctx.fill();ctx.restore()}
function background(dt){
 let sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#3aa8f8');sky.addColorStop(.62,'#b9e9ff');sky.addColorStop(1,'#fff0cf');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 // distant magical mountains
 for(let i=0;i<7;i++){let x=i*220-(bgOffset*.12%220);ctx.fillStyle=i%2?'#91c5df':'#77b4d3';ctx.beginPath();ctx.moveTo(x-100,430);ctx.lineTo(x+60,220+(i%3)*35);ctx.lineTo(x+210,430);ctx.fill()}
 clouds.forEach(c=>{c.x-=dt*13*c.s;if(c.x<-100)c.x=W+80;drawCloud(c.x,c.y,c.s)});
 // floating islands
 for(let i=0;i<4;i++){let x=((i*370-bgOffset*.25)%(W+300)+W+300)%(W+300)-100,y=310+(i%2)*65;ctx.fillStyle='#6c8b78';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+35,y+95);ctx.lineTo(x+165,y+105);ctx.lineTo(x+210,y);ctx.closePath();ctx.fill();rounded(x,y-14,215,28,12,'#53b84e');for(let j=0;j<7;j++){ctx.fillStyle=j%2?'#f9a6d3':'#fff0a2';ctx.beginPath();ctx.arc(x+15+j*29,y-15,4,0,Math.PI*2);ctx.fill()}}
 // castle silhouette
 ctx.save();ctx.translate(865,105);ctx.fillStyle='#f5a7d0';ctx.strokeStyle='#a95d9f';ctx.lineWidth=5;ctx.fillRect(40,70,170,110);ctx.fillRect(10,95,55,85);ctx.fillRect(190,95,55,85);for(let [x,y,w,h] of [[35,30,45,75],[95,0,60,105],[180,32,45,73]]){ctx.fillRect(x,y+h-10,w,10);ctx.beginPath();ctx.moveTo(x-5,y+h-10);ctx.lineTo(x+w/2,y-28);ctx.lineTo(x+w+5,y+h-10);ctx.closePath();ctx.fill();ctx.stroke()}ctx.fillStyle='#754477';ctx.beginPath();ctx.arc(122,180,25,Math.PI,0);ctx.fill();ctx.fillRect(97,180,50,0);ctx.restore();
 // big cherry tree left
 ctx.fillStyle='#754b42';ctx.beginPath();ctx.moveTo(0,430);ctx.quadraticCurveTo(45,300,70,155);ctx.lineTo(105,160);ctx.quadraticCurveTo(95,330,160,430);ctx.fill();
 for(let i=0;i<14;i++){let x=randStatic(i,0,175),y=randStatic(i,0,140);ctx.fillStyle=['#ff8acb','#f7a0d5','#e978bd'][i%3];ctx.beginPath();ctx.arc(x,y,50+(i%3)*10,0,Math.PI*2);ctx.fill()}
 // ground
 ctx.fillStyle='#654a50';ctx.fillRect(0,groundY,W,H-groundY);ctx.fillStyle='#4fbd45';ctx.fillRect(0,groundY,W,28);ctx.fillStyle='#a5f35b';ctx.fillRect(0,groundY,W,7);
 for(let x=-(bgOffset%60);x<W;x+=60){ctx.fillStyle='#3d963f';ctx.fillRect(x,groundY+30,28,8);ctx.fillStyle='#98775c';ctx.fillRect(x+15,groundY+82,35,12);ctx.fillStyle='#5ccf54';ctx.beginPath();ctx.arc(x+25,groundY+3,5,0,Math.PI*2);ctx.fill()}
 for(let i=0;i<30;i++){let x=(i*47-bgOffset*.7%W+W)%W,y=groundY+randStatic(i,0,20);ctx.fillStyle=i%2?'#fff4b3':'#ffb8d9';ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill()}
}
function randStatic(i,a,b){let n=Math.sin(i*127.1+78.2)*43758.5453;return a+(n-Math.floor(n))*(b-a)}
function drawGirl(){
 let p=player;ctx.save();ctx.translate(p.x+p.w/2,p.y+p.h/2);let bob=p.onGround?Math.sin(p.run*15)*3:0;ctx.translate(0,bob);if(p.inv>0&&Math.floor(elapsed*12)%2===0)ctx.globalAlpha=.4;
 if(shield>0){ctx.strokeStyle='#8df7ff';ctx.lineWidth=5;ctx.shadowColor='#70faff';ctx.shadowBlur=20;ctx.beginPath();ctx.ellipse(0,0,48,61,0,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0}
 // hair flowing behind
 ctx.fillStyle='#633342';ctx.beginPath();ctx.ellipse(-12,-16,31,39,-.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#8d4b50';ctx.beginPath();ctx.moveTo(-25,-15);ctx.quadraticCurveTo(-70,-5,-53,35);ctx.quadraticCurveTo(-28,22,-25,-15);ctx.fill();
 // legs
 // Realistic running legs animation
let phase = player.run * 2.8;

let leftSwing = Math.sin(phase);
let rightSwing = Math.sin(phase + Math.PI);

let leftLift = Math.max(0, Math.cos(phase)) * 9;
let rightLift = Math.max(0, Math.cos(phase + Math.PI)) * 9;

// Skin legs
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.strokeStyle = '#f4b2a8';
ctx.lineWidth = 9;

// Left leg
ctx.beginPath();
ctx.moveTo(-8, 23);
ctx.lineTo(-8 + leftSwing * 7, 35);
ctx.lineTo(-8 + leftSwing * 15, 48 - leftLift);
ctx.stroke();

// Right leg
ctx.beginPath();
ctx.moveTo(10, 23);
ctx.lineTo(10 + rightSwing * 7, 35);
ctx.lineTo(10 + rightSwing * 15, 48 - rightLift);
ctx.stroke();

// Pink shoes
ctx.strokeStyle = '#ed6a91';
ctx.lineWidth = 8;

ctx.beginPath();
ctx.moveTo(-8 + leftSwing * 15, 48 - leftLift);
ctx.lineTo(5 + leftSwing * 15, 48 - leftLift);
ctx.moveTo(10 + rightSwing * 15, 48 - rightLift);
ctx.lineTo(23 + rightSwing * 15, 48 - rightLift);
ctx.stroke();// dress/body
 ctx.fillStyle='#ff83bd';ctx.beginPath();ctx.moveTo(-13,-4);ctx.lineTo(13,-4);ctx.lineTo(24,27);ctx.quadraticCurveTo(0,40,-24,27);ctx.closePath();ctx.fill();ctx.fillStyle='#fff2f4';ctx.fillRect(-9,-4,18,8);ctx.fillStyle='#ffb7d9';ctx.beginPath();ctx.moveTo(-15,9);ctx.lineTo(15,9);ctx.lineTo(23,25);ctx.quadraticCurveTo(0,32,-23,25);ctx.fill();
 // face
 ctx.fillStyle='#ffd0b5';ctx.beginPath();ctx.ellipse(3,-27,25,29,0,0,Math.PI*2);ctx.fill();
 // hair cap
 ctx.fillStyle='#633342';ctx.beginPath();ctx.ellipse(-1,-43,28,21,-.1,Math.PI,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-24,-40);ctx.quadraticCurveTo(-37,-20,-19,-11);ctx.quadraticCurveTo(-20,-34,-4,-34);ctx.fill();
 // eyes + blush
 ctx.fillStyle='#422b3b';ctx.beginPath();ctx.ellipse(12,-26,3.3,6,0,0,Math.PI*2);ctx.ellipse(-5,-26,3.3,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(13,-28,1.3,0,Math.PI*2);ctx.arc(-4,-28,1.3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f58ca0';ctx.beginPath();ctx.arc(-11,-17,5,0,Math.PI*2);ctx.arc(20,-17,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a94d67';ctx.lineWidth=2;ctx.beginPath();ctx.arc(5,-13,5,.2,1.9);ctx.stroke();
 // bow
 ctx.fillStyle='#ff4e9b';ctx.beginPath();ctx.moveTo(-15,-54);ctx.quadraticCurveTo(-38,-72,-33,-48);ctx.quadraticCurveTo(-25,-37,-15,-46);ctx.quadraticCurveTo(-6,-65,2,-51);ctx.quadraticCurveTo(3,-38,-15,-44);ctx.fill();ctx.fillStyle='#ffd4ec';ctx.beginPath();ctx.arc(-15,-47,4,0,Math.PI*2);ctx.fill();
 ctx.restore();
}
function spawn(){let r=Math.random();if(r<.53){items.push({type:'star',x:W+30,y:rand(350,475),r:17,spin:0})}else if(r<.68){items.push({type:'shield',x:W+30,y:rand(365,450),r:22,spin:0})}else{let type=Math.random()<.5?'log':'crate';obstacles.push({type,x:W+40,y:groundY-(type==='log'?46:62),w:type==='log'?90:75,h:type==='log'?43:62})}}
function hit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function burst(x,y,color){for(let i=0;i<12;i++)particles.push({x,y,vx:rand(-150,150),vy:rand(-190,40),life:.55,color})}
function update(dt){if(state!=='playing')return;elapsed+=dt;timeLeft-=dt;if(timeLeft<=0){timeLeft=0;end();return}worldSpeed=330+Math.min(260,elapsed*3.2);bgOffset+=worldSpeed*dt;
 player.run+=dt*5;player.duck=!!keys.ArrowDown&&player.onGround;
 if(keys.ArrowLeft)player.x-=280*dt;if(keys.ArrowRight)player.x+=280*dt;player.x=Math.max(30,Math.min(420,player.x));
 if(!player.onGround){player.vy+=1700*dt;player.y+=player.vy*dt;if(player.y+player.h>=groundY){player.y=groundY-player.h;player.vy=0;player.onGround=true}}
 if(player.duck){player.h=64;player.y=groundY-64}else if(player.onGround){player.h=94;player.y=groundY-94}
 if(player.inv>0)player.inv-=dt;if(shield>0)shield=Math.max(0,shield-dt);
 spawnTimer-=dt;if(spawnTimer<=0){spawn();spawnTimer=rand(.75,1.35)*Math.max(.55,1-elapsed/180)}
 items.forEach(o=>{o.x-=worldSpeed*dt;o.spin+=dt*4;if(Math.hypot((player.x+32)-(o.x),(player.y+45)-o.y)<(o.type==='star'?39:43)){if(o.type==='star'){score+=10;sound(850,.07);burst(o.x,o.y,'#ffdb55')}else{shield=7;sound(1000,.15);burst(o.x,o.y,'#8af6ff')}o.dead=true}});
 obstacles.forEach(o=>{o.x-=worldSpeed*dt;if(hit({x:player.x+10,y:player.y+12,w:player.w-18,h:player.h-18},o)){if(shield>0){o.dead=true;score+=5;burst(o.x,o.y,'#8af6ff');sound(300,.12)}else if(player.inv<=0){lives--;player.inv=1.25;burst(player.x+30,player.y+35,'#ff789d');sound(150,.2,'sawtooth');if(lives<=0)end()}}});
 items=items.filter(o=>!o.dead&&o.x>-50);obstacles=obstacles.filter(o=>!o.dead&&o.x>-120);
 particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=420*dt;p.life-=dt});particles=particles.filter(p=>p.life>0);
}
function drawObstacle(o){if(o.type==='log'){ctx.fillStyle='#a86b39';ctx.strokeStyle='#704226';ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(o.x,o.y,o.w,o.h,18);ctx.fill();ctx.stroke();ctx.fillStyle='#d69a5c';ctx.beginPath();ctx.ellipse(o.x+13,o.y+o.h/2,12,18,0,0,Math.PI*2);ctx.fill();ctx.stroke()}else{rounded(o.x,o.y,o.w,o.h,7,'#b9783f');ctx.strokeStyle='#704326';ctx.lineWidth=5;ctx.strokeRect(o.x+3,o.y+3,o.w-6,o.h-6);ctx.beginPath();ctx.moveTo(o.x+5,o.y+5);ctx.lineTo(o.x+o.w-5,o.y+o.h-5);ctx.moveTo(o.x+o.w-5,o.y+5);ctx.lineTo(o.x+5,o.y+o.h-5);ctx.stroke()}}
function drawItem(o){ctx.save();ctx.translate(o.x,o.y);ctx.rotate(Math.sin(o.spin)*.12);if(o.type==='star'){ctx.shadowColor='#ffe45e';ctx.shadowBlur=20;starPath(0,0,23,11);ctx.fillStyle='#ffca28';ctx.fill();ctx.strokeStyle='#fff2a0';ctx.lineWidth=3;ctx.stroke()}else{ctx.shadowColor='#70efff';ctx.shadowBlur=20;ctx.fillStyle='#f9faff';ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(20,-15);ctx.lineTo(17,12);ctx.lineTo(0,25);ctx.lineTo(-17,12);ctx.lineTo(-20,-15);ctx.closePath();ctx.fill();ctx.fillStyle='#ff4dbe';ctx.fillRect(-11,-9,22,18);ctx.fillStyle='#47d7ff';ctx.fillRect(-11,0,22,9);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke()}ctx.restore()}
function hud(){// rounded wood-like HUD cards
 const card=(x,y,w,label,val,emoji)=>{rounded(x,y,w,58,18,'#75462f');rounded(x+4,y+4,w-8,50,15,'#b77a4c');rounded(x+8,y+8,w-16,42,12,'#613d37');ctx.font='bold 26px Nunito';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.fillText(emoji,x+17,y+39);ctx.font='900 23px Nunito';ctx.fillText(label,x+58,y+37);ctx.fillStyle='#ffe69a';ctx.fillText(val,x+w-55,y+37)};
 card(22,18,220,'♥',`${lives}/3`,'💗');card(260,18,220,'Score',score,'⭐');card(498,18,220,'Time',`${Math.ceil(timeLeft)}s`,'⏱');card(736,18,220,'Shield',shield>0?`${Math.ceil(shield)}s`:'OFF','🌈');
 ctx.textAlign='left';ctx.font='bold 13px Nunito';ctx.fillStyle='#fff';ctx.fillText(`LEVEL ${1+Math.floor(elapsed/25)}  ·  SPEED ${Math.round(worldSpeed)}`,26,98);
}
function render(dt){background(dt);items.forEach(drawItem);obstacles.forEach(drawObstacle);drawGirl();particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life*1.8);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1});hud();
 // decorative floating butterflies
 for(let i=0;i<5;i++){let x=(i*255-bgOffset*.45%W+W)%W,y=235+Math.sin(elapsed*2+i)*18;ctx.fillStyle='#fff4a8';ctx.font='24px serif';ctx.fillText('🦋',x,y)}
}
function loop(now){let dt=Math.min((now-lastTime)/1000||0,.033);lastTime=now;if(state==='playing')update(dt);render(dt);requestAnimationFrame(loop)}
reset();requestAnimationFrame(t=>{lastTime=t;loop(t)});
})();
