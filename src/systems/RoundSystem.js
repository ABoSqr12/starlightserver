import { rounds } from '../data/rounds.js';

export class RoundSystem {
  constructor(scene) {
    this.scene = scene;
  }

  getRound(roundNumber) {
    return rounds.find((r) => r.رقم_الجولة === roundNumber) || rounds[0];
  }

  showRoundStartMessage(roundData) {
    const title = roundData.يوجد_بوس
      ? `الجولة ${roundData.رقم_الجولة} — ${roundData.اسم_البوس}`
      : `الجولة ${roundData.رقم_الجولة}`;
    const msg = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2 - 40, `${title}\nالصعوبة: ${roundData.مستوى_الصعوبة}`, {
      fontFamily: 'Tahoma, Arial, sans-serif',
      fontSize: '34px',
      align: 'center',
      color: '#f3f8ff',
      backgroundColor: '#18264a',
      padding: { left: 16, right: 16, top: 10, bottom: 10 },
    }).setOrigin(0.5).setDepth(200);
    this.scene.tweens.add({ targets: msg, alpha: 0, delay: 1000, duration: 600, onComplete: () => msg.destroy() });
  }

  isRoundComplete(defeatedCount, roundData) {
    return defeatedCount >= roundData.عدد_الأعداء;
  }

  getNextScene(roundNumber) {
    if (roundNumber >= 30) return 'EndingScene';
    if (roundNumber % 5 === 0) return 'RestGateScene';
    return 'ArenaScene';
  }
}
