import { AudioSystem } from '../systems/AudioSystem.js';
import { gameState, saveProgress } from '../state.js';
import { LeaderboardSystem } from '../systems/LeaderboardSystem.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { جلب_حوار_مكيّف, dialogues } from '../data/dialogues.js';

export class EndingScene extends Phaser.Scene {
  constructor() { super('EndingScene'); }
  create() {
    AudioSystem.ensure(this);
    AudioSystem.playEndingMusic();
    gameState.تم_ختم_اللعبة = true;
    saveProgress();
    this.cameras.main.setBackgroundColor('#1b1236');

    const profile = SaveSystem.loadProfile();
    LeaderboardSystem.submit({
      اسم_اللاعب: profile.اسم_اللاعب || 'لاعب مجهول',
      الشخصية_المختارة: gameState.الشخصية_المختارة,
      الكلاس_المختار: gameState.الكلاس_المختار,
      النمط: gameState.النمط_المختار,
      وقت_الختم: Math.max(0, gameState.الوقت || 0),
      عدد_السقطات: gameState.السقطات,
      عدد_القتلى: gameState.القتلى,
      التاريخ: new Date().toISOString(),
      تم_ختم_اللعبة: true,
      أفضل_جولة: gameState.أفضل_جولة,
      محادثات_الشخصيات: gameState.محادثات_الشخصيات,
    });


    const finalLines = جلب_حوار_مكيّف('نهاية', gameState.الشخصية_المختارة || 'المسافر');
    const quoteLines = dialogues.عبارة_النهاية;

    this.add.text(this.scale.width / 2, 95, 'الخاتمة', { fontFamily: 'Tahoma', fontSize: '44px', color: '#f7ebff' }).setOrigin(0.5);
    finalLines.forEach((line, i) => {
      this.add.text(this.scale.width / 2, 170 + i * 44, line, { fontFamily: 'Tahoma', fontSize: '28px', color: '#eadfff' }).setOrigin(0.5);
    });
    quoteLines.forEach((line, i) => {
      this.add.text(this.scale.width / 2, 320 + i * 40, line, { fontFamily: 'Tahoma', fontSize: '23px', color: '#d9c9ff' }).setOrigin(0.5);
    });

    this.add.text(this.scale.width / 2, 430, 'العودة إلى القائمة الرئيسية', { fontFamily: 'Tahoma', fontSize: '28px', color: '#fff', backgroundColor: '#4c2f7a', padding: { left: 16, right: 16, top: 8, bottom: 8 } }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('MainMenuScene'));
  }
}
