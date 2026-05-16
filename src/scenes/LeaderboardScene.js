import { LeaderboardSystem } from '../systems/LeaderboardSystem.js';

export class LeaderboardScene extends Phaser.Scene {
  constructor() { super('LeaderboardScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#0c1226');
    this.add.text(this.scale.width/2, 52, 'ترتيب الخاتمين', { fontFamily:'Tahoma', fontSize:'44px', color:'#eef5ff' }).setOrigin(0.5);

    const rows = LeaderboardSystem.sort(LeaderboardSystem.load());
    this.#drawHeader();

    const max = Math.min(8, rows.length);
    for (let i=0;i<max;i+=1) this.#drawRow(i, rows[i]);
    if (rows.length===0) {
      this.add.text(this.scale.width/2, 250, 'لا توجد نتائج محفوظة بعد.', { fontFamily:'Tahoma', fontSize:'28px', color:'#d6e6ff' }).setOrigin(0.5);
    }

    this.#btn(250, 500, 'العودة', () => this.scene.start('MainMenuScene'));
    this.#btn(710, 500, 'مسح النتائج', () => { LeaderboardSystem.clear(); this.scene.restart(); });
  }

  #drawHeader() {
    const y = 112;
    this.add.rectangle(this.scale.width/2, y, 920, 36, 0x1a2649, 0.95).setStrokeStyle(1,0x46609c,1);
    const cols = ['الاسم','الكلاس','الشخصية','النمط','الوقت','السقطات','القتلى','الشارات'];
    const xs = [900,790,690,580,480,390,315,170];
    cols.forEach((c,i)=>this.add.text(xs[i],y-10,c,{fontFamily:'Tahoma',fontSize:'17px',color:'#bcd7ff'}).setOrigin(1,0));
  }

  #drawRow(i, r) {
    const y = 150 + i * 40;
    this.add.rectangle(this.scale.width/2, y, 920, 34, i%2?0x101a35:0x152244, 0.9);
    const t = (r.وقت_الختم && r.تم_ختم_اللعبة) ? `${r.وقت_الختم}ث` : '-';
    const badges = (r.الشارات || []).join('، ');
    const vals = [r.اسم_اللاعب||'---', r.الكلاس_المختار||'---', r.الشخصية_المختارة||'---', r.النمط||'---', t, String(r.عدد_السقطات||0), String(r.عدد_القتلى||0), badges||'—'];
    const xs = [900,790,690,580,480,390,315,170];
    vals.forEach((v,idx)=>this.add.text(xs[idx], y-10, v, { fontFamily:'Tahoma', fontSize:'15px', color:'#ecf3ff' }).setOrigin(1,0));
  }

  #btn(x,y,label,fn){
    this.add.text(x,y,label,{fontFamily:'Tahoma',fontSize:'28px',color:'#fff',backgroundColor:'#2f477a',padding:{left:14,right:14,top:8,bottom:8}})
      .setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',fn);
  }
}
