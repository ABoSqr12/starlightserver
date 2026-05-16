import { AudioSystem } from '../systems/AudioSystem.js';

export class SettingsScene extends Phaser.Scene {
  constructor() { super('SettingsScene'); }
  create() {
    AudioSystem.ensure(this);
    this.cameras.main.setBackgroundColor('#0c1124');
    this.add.text(this.scale.width/2,90,'الإعدادات',{fontFamily:'Tahoma',fontSize:'46px',color:'#eef4ff'}).setOrigin(0.5);

    this.items = [
      { key:'مستوى_الصوت', label:'مستوى الصوت', values:[0.2,0.4,0.65,0.85,1] },
      { key:'المؤثرات', label:'المؤثرات', values:[true,false] },
      { key:'الموسيقى', label:'الموسيقى', values:[true,false] },
      { key:'نمط_العرض', label:'نمط العرض', values:['كامل','مريح'] },
    ];

    this.items.forEach((it,i)=>{
      const y=180+i*58;
      const val = it.key==='نمط_العرض' ? 'كامل' : AudioSystem.settings[it.key];
      const text = this.add.text(this.scale.width/2,y,`${it.label}: ${this.#fmt(val)}`,{fontFamily:'Tahoma',fontSize:'30px',color:'#d6e6ff',backgroundColor:'#1b284b',padding:{left:12,right:12,top:8,bottom:8}}).setOrigin(0.5).setInteractive({useHandCursor:true});
      text.on('pointerdown',()=>{
        AudioSystem.playButton();
        if(it.key==='نمط_العرض') return;
        const idx = it.values.indexOf(AudioSystem.settings[it.key]);
        const next = it.values[(idx+1)%it.values.length];
        AudioSystem.setSettings({[it.key]: next});
        text.setText(`${it.label}: ${this.#fmt(next)}`);
      });
    });

    this.add.text(this.scale.width/2,450,'العودة',{fontFamily:'Tahoma',fontSize:'30px',color:'#fff',backgroundColor:'#365595',padding:{left:18,right:18,top:8,bottom:8}}).setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',()=>{AudioSystem.playButton(); this.scene.start('MainMenuScene');});
  }
  #fmt(v){ if(v===true) return 'مفعلة'; if(v===false) return 'متوقفة'; if(typeof v==='number') return `${Math.round(v*100)}٪`; return v; }
}
