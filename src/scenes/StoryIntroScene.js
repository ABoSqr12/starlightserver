import { gameState } from '../state.js';
import { جلب_حوار_مكيّف } from '../data/dialogues.js';

export class StoryIntroScene extends Phaser.Scene {
  constructor() { super('StoryIntroScene'); }
  create() {
    this.cameras.main.setBackgroundColor('#101833');
    const lines = جلب_حوار_مكيّف('مقدمة_القصة', gameState.الشخصية_المختارة || 'المسافر');
    this.add.text(this.scale.width / 2, 96, 'بداية الرحلة تحت ضوء النجوم', { fontFamily: 'Tahoma', fontSize: '38px', color: '#edf4ff' }).setOrigin(0.5);
    lines.slice(0, 3).forEach((line, i) => {
      this.add.text(this.scale.width / 2, 180 + i * 52, line, { fontFamily: 'Tahoma', fontSize: '24px', color: '#d9e8ff', align: 'center' }).setOrigin(0.5);
    });
    this.add.text(this.scale.width / 2, 380, 'ابدأ الساحة', { fontFamily: 'Tahoma', fontSize: '30px', color: '#ffffff', backgroundColor: '#2a3b6b', padding: { left: 18, right: 18, top: 8, bottom: 8 } }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('ArenaScene'));
  }
}
