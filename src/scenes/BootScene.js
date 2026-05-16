import { loadProgress } from '../state.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    loadProgress();
    this.scene.start('SplashScene');
  }
}
