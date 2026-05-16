import { AudioSystem } from '../systems/AudioSystem.js';
import { CinematicSystem } from '../systems/CinematicSystem.js';
import { AssetFactory } from '../systems/AssetFactory.js';

export class Enemy extends Phaser.GameObjects.Container {
  constructor(scene, x, y, config, side = 'يمين') {
    super(scene, x, y);
    scene.add.existing(this);

    this.config = config;
    this.side = side;
    this.الحالة = 'walk';
    this.مات = false;
    this.آخر_هجوم = -9999;
    this.cooldown = config.زمن_تهدئة_الهجوم;
    this.الصحة = config.الصحة;
    this.الصحة_القصوى = config.الصحة;
    this.السرعة = config.السرعة;
    this.knockback = 0;
    this.walkSwing = Math.random() * 2;
    this.fx = new CinematicSystem(scene);

    const key = AssetFactory.createEnemyTexture(scene, `عدو_${config.النوع}`);
    this.shadow = scene.add.ellipse(0, 2, 44, 12, 0x000000, 0.25);
    this.body = scene.add.sprite(0, 0, key).setOrigin(0.5, 1).setTint(config.اللون);
    this.weapon = scene.add.rectangle(12, -24, 12, 3, 0xa7b9d8, 0.9);
    this.add([this.shadow, this.body, this.weapon]);
    this.setScale(side === 'يمين' ? -3.6 : 3.6, 3.6);
  }

  update(time, delta, player, friends) {
    if (this.مات || !this.active) return null;
    const dt = delta / 1000;

    const dirToPlayer = Math.sign(player.x - this.x) || 1;
    const dist = Math.abs(player.x - this.x);

    const avoid = this.#avoidStack(friends);
    const moveDir = (dist > this.config.مدى_الهجوم ? dirToPlayer : 0) + avoid;

    if (this.knockback !== 0) {
      this.x += this.knockback * dt;
      this.knockback *= 0.84;
      if (Math.abs(this.knockback) < 4) this.knockback = 0;
    } else if (moveDir !== 0) {
      this.x += Math.sign(moveDir) * this.السرعة * dt;
      this.الحالة = 'walk';
    } else {
      this.الحالة = 'idle';
    }

    this.setScale(player.x > this.x ? 3.6 : -3.6, 3.6);
    this.#animate(time);

    if (dist <= this.config.مدى_الهجوم && time - this.آخر_هجوم > this.cooldown) {
      this.آخر_هجوم = time;
      return this.#attack(player);
    }
    return null;
  }

  #avoidStack(friends) {
    let push = 0;
    friends.forEach((f) => {
      if (f === this || f.مات || !f.active) return;
      const dx = this.x - f.x;
      if (Math.abs(dx) < 42) push += dx > 0 ? 0.65 : -0.65;
    });
    return push;
  }

  #animate(time) {
    if (this.الحالة === 'walk') {
      this.walkSwing += 0.24;
      const bob = Math.abs(Math.sin(this.walkSwing)) * 1.1;
      const arm = Math.sin(this.walkSwing) * 2;
      this.body.y = -bob;
      this.weapon.y = -24 + arm;
      this.shadow.scaleX = 1 + Math.abs(arm) * 0.02;
    } else {
      this.body.y = Math.sin(time * 0.003) * 0.45;
    }
  }

  #attack(player) {
    this.الحالة = 'attack';
    this.scene.tweens.add({ targets: this.weapon, angle: 45, duration: 60, yoyo: true });

    if (this.config.رام) {
      const dir = player.x > this.x ? 1 : -1;
      const shot = this.scene.add.rectangle(this.x + dir * 32, this.y - 90, 10, 3, 0xe0be9a, 1);
      this.scene.tweens.add({
        targets: shot,
        x: shot.x + dir * 220,
        duration: 520,
        onUpdate: () => {
          if (Math.abs(shot.x - player.x) < 20 && Math.abs((this.y - 110) - player.y) < 70) {
            player.takeDamage(this.config.الضرر);
            shot.destroy();
          }
        },
        onComplete: () => shot.destroy(),
      });
    } else {
      player.takeDamage(this.config.الضرر);
    }
    this.scene.time.delayedCall(160, () => { if (!this.مات) this.الحالة = 'idle'; });
    return null;
  }

  takeDamage(amount, fromDir = 1) {
    if (this.مات) return false;
    this.الصحة -= amount;
    this.knockback = fromDir * 180;
    AudioSystem.playHitEnemy();
    this.fx.hitSpark(this.x, this.y-85);
    this.scene.tweens.add({ targets: this.body, alpha: 0.25, duration: 45, yoyo: true, repeat: 2 });
    if (this.الصحة <= 0) {
      this.#die();
      return true;
    }
    return false;
  }

  #die() {
    AudioSystem.playEnemyDeath();
    this.fx.pulse(140,0.08);
    this.مات = true;
    this.الحالة = 'death';
    this.scene.tweens.add({ targets: this, alpha: 0, y: this.y + 8, duration: 320, onComplete: () => this.destroy() });
  }
}
