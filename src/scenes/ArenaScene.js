import { gameState, advanceRound, addKill, addDeath, saveProgress } from '../state.js';
import { AssetFactory } from '../systems/AssetFactory.js';
import { enemies as ENEMY_TYPES } from '../data/enemies.js';
import { RoundSystem } from '../systems/RoundSystem.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';
import { HUD } from '../ui/HUD.js';
import { CinematicSystem } from '../systems/CinematicSystem.js';

export class ArenaScene extends Phaser.Scene {
  constructor() {
    super('ArenaScene');
    this.player = null; this.boss = null; this.bossBarFill = null;
    this.starLayers = []; this.portalGlow = null; this.lightParticles = [];
    this.enemies = []; this.waveTimer = 0; this.localKills = 0;
    this.roundSystem = null; this.currentRound = null; this.roundDefeated = 0;
    this.hud = null;
    this.cine = null;
    this.startTime = 0;
    this.isPaused = false;
    this.pauseLayer = null;
  }
  update(time, delta) {
    if (this.isPaused) return;
    if (this.player) this.player.update(time, delta, this.scale.width);
    this.#updateParallax(); this.#updateLightParticles(delta);
    if (this.portalGlow) this.portalGlow.alpha = 0.09 + Math.sin(time * 0.0045) * 0.035;
    this.#updateEnemies(time, delta); this.#spawnEnemies(time);
    this.#updateHud(time);
  }
  create() {
    AudioSystem.ensure(this);
    AudioSystem.playCombatMusic();
    AssetFactory.ensureAll(this, gameState.الشخصية_المختارة || 'المسافر', gameState.الكلاس_المختار || 'رونين');
    this.roundSystem = new RoundSystem(this); this.currentRound = this.roundSystem.getRound(gameState.الجولة_الحالية);
    this.startTime = this.time.now;
    this.cine = new CinematicSystem(this);
    this.cine.fadeIn(520);
    this.#drawArenaEnvironment(); this.#renderEntitiesAndHud(); this.roundSystem.showRoundStartMessage(this.currentRound);
    this.input.keyboard.on('keydown-ESC', () => this.#togglePauseMenu());
  }
  #drawArenaEnvironment() { const w=this.scale.width,h=this.scale.height; const sky=this.add.graphics(); const tile=12; for (let y=0;y<h;y+=tile) for (let x=0;x<w;x+=tile){const t=Phaser.Math.Between(7,20)+Math.floor((y/h)*18);sky.fillStyle(Phaser.Display.Color.GetColor(t,t+4,t+13),1);sky.fillRect(x,y,tile,tile);} const moon=this.add.graphics(); moon.fillStyle(0xdce8ff,1); moon.fillCircle(810,88,38); moon.fillStyle(0xc6d7f6,0.6); moon.fillCircle(796,80,7); moon.fillCircle(824,97,6); this.starLayers=[this.#createStarLayer(70,0xdbefff,0.05,2,h*0.58),this.#createStarLayer(35,0xbfd8ff,0.11,2,h*0.66)]; const gate=this.add.graphics(); gate.fillStyle(0x090f1d,1); gate.fillRect(w/2-52,170,104,210); gate.fillStyle(0x121b36,0.85); gate.fillRect(w/2-28,204,56,176); this.portalGlow=this.add.rectangle(w/2,300,90,170,0x7198ff,0.1); const floor=this.add.graphics(); const gt=392; floor.fillStyle(0x171d2f,1); floor.fillRect(0,gt,w,h-gt); for(let y=gt;y<h;y+=10) for(let x=0;x<w;x+=10){const g=Phaser.Math.Between(32,56); floor.fillStyle(Phaser.Display.Color.GetColor(g,g+4,g+10),1); floor.fillRect(x,y,10,10);} this.add.rectangle(w/2,gt,w,4,0x4f618d,1); this.#drawSpawnMarker(62,gt+56,'مدخل العدو'); this.#drawSpawnMarker(w-62,gt+56,'مدخل العدو'); this.#createLightParticles(w/2,300,22); }
  #createStarLayer(count,color,speed,size,maxY){const group=this.add.group();for(let i=0;i<count;i+=1) group.add(this.add.rectangle(Phaser.Math.Between(0,this.scale.width),Phaser.Math.Between(10,Math.floor(maxY)),size,size,color,Phaser.Math.FloatBetween(0.45,0.95))); return {group,speed,maxY};}
  #updateParallax(){this.starLayers.forEach((l)=>l.group.children.iterate((s)=>{s.x-=l.speed;if(s.x<-3){s.x=this.scale.width+Phaser.Math.Between(0,40);s.y=Phaser.Math.Between(10,Math.floor(l.maxY));}}));}
  #createLightParticles(cx,cy,count){for(let i=0;i<count;i+=1){const d=this.add.rectangle(cx+Phaser.Math.Between(-38,38),cy+Phaser.Math.Between(-75,55),2,2,0xb9d8ff,Phaser.Math.FloatBetween(0.3,0.85));this.lightParticles.push({node:d,vy:Phaser.Math.FloatBetween(-0.03,-0.012),drift:Phaser.Math.FloatBetween(-0.025,0.025)});}}
  #updateLightParticles(delta){this.lightParticles.forEach((p)=>{p.node.y+=p.vy*delta;p.node.x+=p.drift*delta;p.node.alpha-=0.00023*delta;if(p.node.alpha<=0.04||p.node.y<190){p.node.x=this.scale.width/2+Phaser.Math.Between(-40,40);p.node.y=360+Phaser.Math.Between(-10,40);p.node.alpha=Phaser.Math.FloatBetween(0.35,0.85);}});} 
  #drawSpawnMarker(x,y,label){const g=this.add.graphics();g.fillStyle(0x29385a,0.95);g.fillTriangle(x,y-18,x-16,y+10,x+16,y+10);g.lineStyle(2,0x8cbcff,0.9);g.strokeTriangle(x,y-18,x-16,y+10,x+16,y+10);this.add.text(x,y+16,label,{fontFamily:'Tahoma, Arial, sans-serif',fontSize:'15px',color:'#bddbff'}).setOrigin(0.5,0);} 
  #renderEntitiesAndHud(){this.hud = new HUD(this); this.player=new Player(this,250,400,gameState.الشخصية_المختارة||'المسافر',gameState.الكلاس_المختار||'رونين'); if(this.currentRound.يوجد_بوس) this.#startBossEncounter(); else {this.#spawnOne('يمين');this.#spawnOne('يسار');} this.#btn('أضف قتيلًا',210,()=>this.#killNearestForTest()); this.#btn('أضف سقطة',270,()=>{addDeath();this.#refreshHud();}); this.#btn('أنهِ الجولة',330,()=>this.#forceFinishRound()); this.#btn('خسارة الآن',390,()=>this.scene.start('GameOverScene'));}
  #startBossEncounter(){this.cine.darkOverlay(0.58,200,500);const dark=this.add.rectangle(this.scale.width/2,this.scale.height/2,this.scale.width,this.scale.height,0x000000,0.55).setDepth(180); this.cine.titleCard(`ظهور البوس`,`${this.currentRound.اسم_البوس}`);
    const title=this.add.text(this.scale.width/2,this.scale.height/2,`ظهور البوس\n${this.currentRound.اسم_البوس}`,{fontFamily:'Tahoma, Arial, sans-serif',fontSize:'40px',align:'center',color:'#f6f2ff',backgroundColor:'#2a1e3e',padding:{left:18,right:18,top:10,bottom:10}}).setOrigin(0.5).setDepth(181); if(this.currentRound.رقم_الجولة===30){ this.time.delayedCall(250,()=>this.cine.pulse(200,0.16)); this.time.delayedCall(500,()=>this.cameras.main.shake(260,0.006)); this.add.text(this.scale.width/2,this.scale.height/2+110,'أنا أنت حين خذلت ضوءك.',{fontFamily:'Tahoma, Arial, sans-serif',fontSize:'28px',color:'#dccfff'}).setOrigin(0.5).setDepth(181);}
    AudioSystem.playBossEntry(this); this.cameras.main.shake(320,0.005); this.time.delayedCall(900,()=>{dark.destroy();title.destroy(); this.boss=new Boss(this,710,410,this.currentRound.رقم_الجولة,gameState.الشخصية_المختارة||'المسافر',gameState.الكلاس_المختار||'رونين'); this.#createBossBar();});}
  #createBossBar(){const w=420; this.add.rectangle(this.scale.width/2,110,w+6,22,0x111725,0.92).setDepth(170); this.bossBarFill=this.add.rectangle(this.scale.width/2-w/2,110,w,14,0xa43737,1).setOrigin(0,0.5).setDepth(171); this.add.text(this.scale.width/2,87,this.currentRound.اسم_البوس,{fontFamily:'Tahoma, Arial, sans-serif',fontSize:'24px',color:'#f2d9d9'}).setOrigin(0.5).setDepth(171);} 
  #updateBossBar(){if(!this.bossBarFill||!this.boss)return; const r=Phaser.Math.Clamp(this.boss.الصحة/this.boss.الصحة_القصوى,0,1); this.bossBarFill.width=420*r;}
  #spawnEnemies(time){if(this.currentRound.يوجد_بوس) return; if(time<this.waveTimer) return; const maxCount=Math.min(5,2+Math.floor(this.currentRound.رقم_الجولة/8)); if(this.enemies.filter((e)=>e.active&&!e.مات).length>=maxCount) return; if(this.roundDefeated>=this.currentRound.عدد_الأعداء) return; this.waveTimer=time+Phaser.Math.Between(1100,1900); this.#spawnOne(Math.random()>0.5?'يمين':'يسار');}
  #spawnOne(side){const allowed=ENEMY_TYPES.filter((t)=>this.currentRound.أنواع_الأعداء.includes(t.النوع)); const type=Phaser.Utils.Array.GetRandom(allowed.length?allowed:ENEMY_TYPES); const x=side==='يمين'?this.scale.width-74:74; this.enemies.push(new Enemy(this,x,400,type,side));}
  #updateEnemies(time,delta){ if(this.boss&&this.boss.active&&!this.boss.مات){this.boss.update(time,delta,this.player); this.#updateBossBar();} this.enemies=this.enemies.filter((e)=>e.active); this.enemies.forEach((e)=>e.update(time,delta,this.player,this.enemies)); const hitWindow=this.player&&this.player.الحالة==='attack'; if(hitWindow&&this.boss&&this.boss.active&&!this.boss.مات){const dx=this.boss.x-this.player.x; if(Math.abs(dx)<85){const dead=this.boss.takeDamage(this.player.الضرر,dx>0?1:-1); if(dead){addKill(); this.roundDefeated=this.currentRound.عدد_الأعداء; this.#refreshHud(); this.#nextFlow();}}} if(hitWindow){this.enemies.forEach((e)=>{if(e.مات)return; const dx=e.x-this.player.x; if(Math.abs(dx)<70){const k=e.takeDamage(this.player.الضرر,dx>0?1:-1); if(k)this.#onEnemyKilled(e.x,e.y);}});} }
  #onEnemyKilled(x,y){addKill(); this.localKills+=1; this.roundDefeated+=1; this.#refreshHud(); if(this.roundSystem.isRoundComplete(this.roundDefeated,this.currentRound)) this.#nextFlow(); if(Math.random()<0.13){const token=this.add.text(x,y-90,'سهم',{fontFamily:'Tahoma',fontSize:'18px',color:'#f1e3b5',backgroundColor:'#3d2f1b',padding:{left:6,right:6,top:2,bottom:2}}).setOrigin(0.5); this.tweens.add({targets:token,y:y-120,alpha:0,duration:900,onComplete:()=>token.destroy()}); this.player.السهام+=1;}}
  #killNearestForTest(){let n=null,b=Infinity; this.enemies.forEach((e)=>{if(e.مات)return; const d=Math.abs(e.x-this.player.x); if(d<b){b=d;n=e;}}); if(n){const k=n.takeDamage(999,n.x>this.player.x?1:-1); if(k)this.#onEnemyKilled(n.x,n.y);}}
  #refreshHud(){}

  #updateHud(time){
    if(!this.hud||!this.player) return;
    this.hud.update({
      الجولة: gameState.الجولة_الحالية,
      الصحة: Math.max(0, Math.floor(this.player.الصحة)),
      الصحة_القصوى: this.player.الصحة_القصوى,
      السهام: this.player.السهام,
      الوقت: Math.floor((time - this.startTime)/1000),
      القتلى: gameState.القتلى,
      السقوط: gameState.السقطات,
      الكلاس: gameState.الكلاس_المختار || '---',
      النمط: gameState.النمط_المختار || '---',
    });
  } 
  #btn(label,y,fn){this.add.text(this.scale.width/2,y,label,{fontFamily:'Tahoma',fontSize:'26px',color:'#fff',backgroundColor:'#2a3b6b',padding:{left:14,right:14,top:7,bottom:7}}).setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',fn);} 
  #forceFinishRound(){this.roundDefeated=this.currentRound.عدد_الأعداء; this.#nextFlow();}

  #togglePauseMenu(){
    if(this.isPaused){
      this.isPaused=false;
      if(this.pauseLayer){ this.pauseLayer.destroy(true); this.pauseLayer=null; }
      return;
    }
    this.isPaused=true;
    const c=this.add.container(0,0).setDepth(500);
    c.add(this.add.rectangle(this.scale.width/2,this.scale.height/2,this.scale.width,this.scale.height,0x000000,0.55));
    c.add(this.add.text(this.scale.width/2,150,'قائمة الإيقاف',{fontFamily:'Tahoma',fontSize:'44px',color:'#f1f6ff'}).setOrigin(0.5));
    const opts=[['متابعة',()=>this.#togglePauseMenu()],['إعادة المحاولة',()=>this.scene.restart()],['العودة إلى القائمة',()=>this.scene.start('MainMenuScene')],['الإعدادات',()=>this.scene.start('SettingsScene')]];
    opts.forEach((o,i)=>{const b=this.add.text(this.scale.width/2,240+i*72,o[0],{fontFamily:'Tahoma',fontSize:'30px',color:'#fff',backgroundColor:'#314d84',padding:{left:14,right:14,top:8,bottom:8}}).setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',o[1]); c.add(b);});
    this.pauseLayer=c;
  }

  #nextFlow(){const next=this.roundSystem.getNextScene(gameState.الجولة_الحالية); AudioSystem.playRoundEnd();
    advanceRound(); saveProgress(); if(next==='EndingScene') return void this.scene.start('EndingScene'); if(next==='RestGateScene') return void this.scene.start('RestGateScene'); this.scene.restart();}
}
