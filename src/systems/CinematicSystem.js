export class CinematicSystem {
  constructor(scene) { this.scene = scene; }

  fadeIn(ms = 500) { this.scene.cameras.main.fadeIn(ms, 0, 0, 0); }
  fadeOut(ms = 500, onDone = () => {}) { this.scene.cameras.main.fadeOut(ms, 0, 0, 0); this.scene.time.delayedCall(ms + 20, onDone); }
  shake(power = 0.004, ms = 180) { this.scene.cameras.main.shake(ms, power); }

  darkOverlay(alpha = 0.5, duration = 200, hold = 350) {
    const o = this.scene.add.rectangle(this.scene.scale.width/2,this.scene.scale.height/2,this.scene.scale.width,this.scene.scale.height,0x000000,alpha).setDepth(600);
    this.scene.tweens.add({ targets:o, alpha, duration, yoyo:false });
    this.scene.time.delayedCall(hold,()=>this.scene.tweens.add({targets:o,alpha:0,duration:duration,onComplete:()=>o.destroy()}));
    return o;
  }

  titleCard(text, sub = '') {
    const box = this.scene.add.container(0,0).setDepth(610);
    box.add(this.scene.add.rectangle(this.scene.scale.width/2, this.scene.scale.height/2, 520, 140, 0x1b1430, 0.92).setStrokeStyle(2,0x7b6bb1,1));
    box.add(this.scene.add.text(this.scene.scale.width/2,this.scene.scale.height/2-18,text,{fontFamily:'Tahoma',fontSize:'40px',color:'#f5edff'}).setOrigin(0.5));
    if(sub) box.add(this.scene.add.text(this.scene.scale.width/2,this.scene.scale.height/2+26,sub,{fontFamily:'Tahoma',fontSize:'22px',color:'#d9ccff'}).setOrigin(0.5));
    this.scene.tweens.add({targets:box,alpha:0,delay:900,duration:500,onComplete:()=>box.destroy()});
  }

  pulse(ms = 240, alpha = 0.14) {
    const p = this.scene.add.rectangle(this.scene.scale.width/2,this.scene.scale.height/2,this.scene.scale.width,this.scene.scale.height,0xc7d7ff,alpha).setDepth(605);
    this.scene.tweens.add({targets:p,alpha:0,duration:ms,onComplete:()=>p.destroy()});
  }

  slash(x,y,dir=1,color=0xd7e6ff) {
    const s=this.scene.add.ellipse(x+dir*26,y-28,14,42,color,0.55).setDepth(420); s.setAngle(dir>0?25:-25);
    this.scene.tweens.add({targets:s,alpha:0,scaleX:2.1,duration:150,onComplete:()=>s.destroy()});
  }

  arrowTrail(x,y,dir=1){
    for(let i=0;i<4;i+=1){const d=this.scene.add.rectangle(x-dir*i*8,y,2,2,0xcfe1ff,0.45).setDepth(415); this.scene.tweens.add({targets:d,alpha:0,duration:120+i*30,onComplete:()=>d.destroy()});}
  }

  dashDust(x,y,dir=1){
    for(let i=0;i<6;i+=1){const q=this.scene.add.rectangle(x-dir*Phaser.Math.Between(8,26),y+Phaser.Math.Between(-8,6),3,3,0x7f93b8,0.5).setDepth(410); this.scene.tweens.add({targets:q,alpha:0,x:q.x-dir*20,duration:180,onComplete:()=>q.destroy()});}
  }

  hitSpark(x,y,color=0xf0d7a6){
    for(let i=0;i<8;i+=1){const p=this.scene.add.rectangle(x,y,2,2,color,0.9).setDepth(430); const a=(Math.PI*2*i)/8; this.scene.tweens.add({targets:p,x:x+Math.cos(a)*18,y:y+Math.sin(a)*18,alpha:0,duration:180,onComplete:()=>p.destroy()});}
  }
}
