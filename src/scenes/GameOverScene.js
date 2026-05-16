import { gameState } from '../state.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { LeaderboardSystem } from '../systems/LeaderboardSystem.js';
export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }
  create() {
    this.cameras.main.setBackgroundColor('#140e1f');
    const profile = SaveSystem.loadProfile();
    LeaderboardSystem.submit({
      اسم_اللاعب: profile.اسم_اللاعب || 'لاعب مجهول',
      الشخصية_المختارة: gameState.الشخصية_المختارة,
      الكلاس_المختار: gameState.الكلاس_المختار,
      النمط: gameState.النمط_المختار,
      وقت_الختم: 0,
      عدد_السقطات: gameState.السقطات,
      عدد_القتلى: gameState.القتلى,
      التاريخ: new Date().toISOString(),
      تم_ختم_اللعبة: false,
      أفضل_جولة: gameState.أفضل_جولة,
      محادثات_الشخصيات: gameState.محادثات_الشخصيات,
    });
    this.add.text(this.scale.width/2,180,'سقطتَ هذه المرة.\nلكن الطريق لا يحكم على من نهض.',{fontFamily:'Tahoma',fontSize:'40px',color:'#f2deff',align:'center'}).setOrigin(0.5);
    this.add.text(this.scale.width/2,360,'أعد المحاولة',{fontFamily:'Tahoma',fontSize:'30px',color:'#fff',backgroundColor:'#53307c',padding:{left:16,right:16,top:8,bottom:8}}).setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.start('ArenaScene'));
    this.add.text(this.scale.width/2,430,'العودة إلى القائمة',{fontFamily:'Tahoma',fontSize:'28px',color:'#fff',backgroundColor:'#32476e',padding:{left:16,right:16,top:8,bottom:8}}).setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.start('MainMenuScene'));
  }
}
