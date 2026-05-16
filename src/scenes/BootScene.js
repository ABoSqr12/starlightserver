import { loadProgress } from '../state.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#15213f');
    this.add.text(this.scale.width / 2, this.scale.height / 2, 'جار التحميل', {
      fontFamily: 'Tahoma, Arial, sans-serif',
      fontSize: '38px',
      color: '#eef4ff',
    }).setOrigin(0.5);

    loadProgress();
    this.time.delayedCall(300, () => this.scene.start('SplashScene'));
  }
}
