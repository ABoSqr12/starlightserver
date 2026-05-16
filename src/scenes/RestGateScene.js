import { AudioSystem } from '../systems/AudioSystem.js';
import { gameState, saveProgress } from '../state.js';

export class RestGateScene extends Phaser.Scene {
  constructor() { super('RestGateScene'); }
  create() {
    AudioSystem.ensure(this);
    AudioSystem.playRestMusic();
    this.cameras.main.setBackgroundColor('#142040');
    this.add.text(this.scale.width / 2, 140, 'بوابة الاستراحة', { fontFamily: 'Tahoma', fontSize: '44px', color: '#eef4ff' }).setOrigin(0.5);
    this.add.text(this.scale.width / 2, 220, `وصلت إلى استراحة بعد الجولة ${gameState.الجولة_الحالية - 1}`, { fontFamily: 'Tahoma', fontSize: '26px', color: '#d6e6ff' }).setOrigin(0.5);
    this.add.text(this.scale.width / 2, 360, 'تابع إلى الجولة التالية', { fontFamily: 'Tahoma', fontSize: '30px', color: '#fff', backgroundColor: '#2a3b6b', padding: { left: 16, right: 16, top: 8, bottom: 8 } }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true }).on('pointerdown', () => { saveProgress(); this.scene.start('ArenaScene'); });
  }
}
