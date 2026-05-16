import { AudioSystem } from '../systems/AudioSystem.js';
import { CinematicSystem } from '../systems/CinematicSystem.js';
import { AssetFactory } from '../systems/AssetFactory.js';

const bossByRound = {
  5: { name: 'حارس الغضب', tint: 0x8b2424, hp: 170, speed: 95, behavior: 'charge' },
  10: { name: 'سيد الكبرياء', tint: 0x6d5ea1, hp: 250, speed: 55, behavior: 'wide' },
  15: { name: 'ظل الخوف', tint: 0x2f3155, hp: 190, speed: 135, behavior: 'blink' },
  20: { name: 'صاحب الندم', tint: 0x46506b, hp: 290, speed: 48, behavior: 'gloom' },
  25: { name: 'قناع الإنكار', tint: 0x556379, hp: 230, speed: 100, behavior: 'phantom' },
  30: { name: 'الذات الأخيرة', tint: 0x2d1e3e, hp: 330, speed: 115, behavior: 'final' },
};

export class Boss extends Phaser.GameObjects.Container {
  constructor(scene, x, y, round, selectedCharacter, selectedClass) {
    super(scene, x, y);
    scene.add.existing(this);
    this.round = round;
    this.profile = bossByRound[round] || bossByRound[10];

    const tex = round === 30
      ? AssetFactory.createFinalSelfTexture(scene, selectedCharacter, selectedClass, `الذات_الأخيرة_${selectedCharacter}_${selectedClass}`)
      : AssetFactory.createBossTexture(scene, this.profile.name, `بوس_${round}`);

    this.shadow = scene.add.ellipse(0, 2, 66, 14, 0x000000, 0.3);
    this.body = scene.add.sprite(0, 0, tex).setOrigin(0.5, 1).setTint(this.profile.tint);
    this.weapon = scene.add.rectangle(20, -36, 24, 5, 0xc8d4ea, 0.95);
    this.add([this.shadow, this.body, this.weapon]);
    this.setScale(4.2);

    this.الصحة_القصوى = this.profile.hp;
    this.الصحة = this.profile.hp;
    this.الحالة = 'idle';
    this.آخر_هجوم = 0;
    this.cooldown = 1200;
    this.نمط_ثان = false;
    this.عداد_نفس_الهجوم = 0;
    this.آخر_نوع_هجوم = 'لا شيء';
    this.مات = false;
    this.fx = new CinematicSystem(scene);
  }

  update(time, delta, player) {
    if (this.مات) return;
    const dt = delta / 1000;
    const dir = Math.sign(player.x - this.x) || 1;
    const dist = Math.abs(player.x - this.x);
    this.setScale(player.x > this.x ? 4.2 : -4.2, 4.2);

    if (!this.نمط_ثان && this.الصحة <= this.الصحة_القصوى / 2) { this.نمط_ثان = true; AudioSystem.playFinalReveal(); this.fx.pulse(260,0.16); }

    if (time - this.آخر_هجوم > this.cooldown) {
      this.آخر_هجوم = time;
      this.#performPattern(player, dir, dist);
    } else {
      const pace = (this.profile.speed + (this.نمط_ثان ? 18 : 0)) * dt;
      if (dist > 95) this.x += dir * pace;
      this.body.y = Math.sin(time * 0.003) * 0.7;
    }
  }

  #performPattern(player, dir, dist) {
    if (this.profile.behavior === 'charge') this.#charge(player, dir);
    else if (this.profile.behavior === 'wide') this.#wideSlash(player, dir);
    else if (this.profile.behavior === 'blink') this.#blinkStrike(player);
    else if (this.profile.behavior === 'gloom') this.#gloomSlam(player);
    else if (this.profile.behavior === 'phantom') this.#phantomFeint(player, dir);
    else this.#finalPattern(player, dir, dist);
  }

  #charge(player, dir) {
    AudioSystem.playHeavy();
    this.fx.shake(0.005,220);
    this.scene.tweens.add({ targets: this, x: this.x + dir * 140, duration: 240, ease: 'Cubic.Out' });
    player.takeDamage(18 + (this.نمط_ثان ? 6 : 0));
  }
  #wideSlash(player, dir) {
    this.fx.slash(this.x, this.y-95, dir, 0xe7c8a1);
    this.scene.tweens.add({ targets: this.weapon, angle: 80 * dir, duration: 150, yoyo: true });
    player.takeDamage(16 + (this.نمط_ثان ? 7 : 0));
  }
  #blinkStrike(player) {
    this.alpha = 0.2;
    this.scene.time.delayedCall(150, () => {
      this.x = player.x + Phaser.Math.Between(-90, 90);
      this.alpha = 1;
      player.takeDamage(14 + (this.نمط_ثان ? 5 : 0));
    });
  }
  #gloomSlam(player) {
    const haze = this.scene.add.rectangle(this.x, this.y - 90, 120, 90, 0x1d2437, 0.36);
    this.scene.tweens.add({ targets: haze, alpha: 0, duration: 500, onComplete: () => haze.destroy() });
    player.takeDamage(22 + (this.نمط_ثان ? 8 : 0));
  }
  #phantomFeint(player, dir) {
    const ghost = this.scene.add.sprite(this.x, this.y, this.body.texture.key).setOrigin(0.5, 1).setTint(0x8fa0c2).setAlpha(0.35).setScale(this.scaleX, this.scaleY);
    this.scene.tweens.add({ targets: ghost, alpha: 0, x: ghost.x - dir * 50, duration: 330, onComplete: () => ghost.destroy() });
    this.x += dir * 80;
    player.takeDamage(15 + (this.نمط_ثان ? 6 : 0));
  }
  #finalPattern(player, dir, dist) {
    const options = ['كاتانا', 'قوس', 'اندفاع'];
    let choice = Phaser.Utils.Array.GetRandom(options);
    if (choice === this.آخر_نوع_هجوم) this.عداد_نفس_الهجوم += 1; else this.عداد_نفس_الهجوم = 1;
    this.آخر_نوع_هجوم = choice;

    if (choice === 'كاتانا') this.#wideSlash(player, dir);
    else if (choice === 'قوس') {
      const shot = this.scene.add.rectangle(this.x + dir * 30, this.y - 110, 12, 3, 0xd4e2ff, 1);
      this.scene.tweens.add({ targets: shot, x: shot.x + dir * 260, duration: 460, onComplete: () => shot.destroy() });
      player.takeDamage(10 + (this.نمط_ثان ? 4 : 0));
    } else this.#charge(player, dir);

    if (dist < 85) player.takeDamage(4);
    if (this.عداد_نفس_الهجوم >= 2) player.takeDamage(6); // يعاقب تكرار نفس الهجوم
    if (this.نمط_ثان) this.cooldown = 800;
  }

  takeDamage(amount, fromDir = 1) {
    if (this.مات) return false;
    this.الصحة -= amount;
    this.x += fromDir * 18;
    this.scene.tweens.add({ targets: this.body, alpha: 0.2, duration: 60, yoyo: true, repeat: 2 });
    if (this.الصحة <= 0) {
      this.مات = true;
      this.scene.tweens.add({ targets: this, alpha: 0, duration: 450, onComplete: () => this.destroy() });
      return true;
    }
    return false;
  }
}
