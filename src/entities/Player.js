import { AssetFactory } from '../systems/AssetFactory.js';
import { Projectile } from './Projectile.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { CinematicSystem } from '../systems/CinematicSystem.js';

export class Player extends Phaser.GameObjects.Container {
  constructor(scene, x, y, selectedCharacter, selectedClass) {
    super(scene, x, y);
    scene.add.existing(this);

    AssetFactory.createMaleTravelerTexture(scene);
    AssetFactory.createFemaleTravelerTexture(scene);

    const base = selectedCharacter === 'المسافرة' ? 'لاعب_المسافرة' : 'لاعب_المسافر';
    this.الكلاس = selectedClass || 'رونين';
    this.textureKey = this.#pickClassTexture(scene, base, this.الكلاس);

    this.bodySprite = scene.add.sprite(0, 0, this.textureKey).setOrigin(0.5, 1);
    this.shadow = scene.add.ellipse(0, 2, 54, 16, 0x000000, 0.28).setOrigin(0.5, 0.5);
    this.weaponPrimary = scene.add.rectangle(18, -32, 20, 4, 0xd0dbff, 0.95).setOrigin(0.5, 0.5);
    this.weaponSecondary = scene.add.rectangle(-14, -26, 12, 3, 0xb99961, 0.9).setOrigin(0.5, 0.5);

    this.add([this.shadow, this.bodySprite, this.weaponPrimary, this.weaponSecondary]);
    this.setSize(48, 64);

    this.الحالة = 'idle';
    this.اتجاه_النظر = 'يمين';
    this.الصحة_القصوى = this.الكلاس === 'طليعة الصحراء' ? 125 : this.الكلاس === 'صياد ستارلايت' ? 82 : 100;
    this.الصحة = this.الصحة_القصوى;
    this.السرعة = this.الكلاس === 'طليعة الصحراء' ? 135 : this.الكلاس === 'صياد ستارلايت' ? 205 : 170;
    this.الضرر = this.الكلاس === 'صياد ستارلايت' ? 17 : this.الكلاس === 'طليعة الصحراء' ? 13 : 15;
    this.الدفاع = this.الكلاس === 'طليعة الصحراء' ? 10 : this.الكلاس === 'صياد ستارلايت' ? 4 : 7;
    this.فرصة_حرجة = this.الكلاس === 'صياد ستارلايت' ? 0.3 : 0.1;
    this.السهام = this.الكلاس === 'رونين' ? 6 : this.الكلاس === 'صياد ستارلايت' ? 5 : 4;
    this.زمن_تهدئة_الاندفاع = this.الكلاس === 'صياد ستارلايت' ? 650 : 900;
    this.آخر_اندفاع = -9999;
    this.آخر_هجوم_أساسي = -9999;
    this.آخر_هجوم_ثانوي = -9999;
    this.تهدئة_هجوم_أساسي = 280;
    this.تهدئة_هجوم_ثانوي = 420;
    this.مات = false;

    this.projectiles = [];

    this.keys = scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      primary: Phaser.Input.Keyboard.KeyCodes.J,
      secondary: Phaser.Input.Keyboard.KeyCodes.K,
      hurt: Phaser.Input.Keyboard.KeyCodes.H,
      dash: Phaser.Input.Keyboard.KeyCodes.L,
    });

    this.#styleWeapons();
    this.walkSwing = 0;
    this.fx = new CinematicSystem(scene);
  }

  #pickClassTexture(scene, base, selectedClass) {
    if (selectedClass === 'طليعة الصحراء') return AssetFactory.createDesertVanguardVariant(scene, base);
    if (selectedClass === 'صياد ستارلايت') return AssetFactory.createStarlightHunterVariant(scene, base);
    return AssetFactory.createRoninVariant(scene, base);
  }

  #styleWeapons() {
    if (this.الكلاس === 'رونين') {
      this.weaponPrimary.setSize(22, 4).setFillStyle(0xc7d8ff, 1);
      this.weaponSecondary.setSize(13, 3).setFillStyle(0xd6b674, 1);
    } else if (this.الكلاس === 'طليعة الصحراء') {
      this.weaponPrimary.setSize(20, 6).setFillStyle(0xb8c4d3, 1);
      this.weaponSecondary.setSize(11, 11).setFillStyle(0x6f87a7, 1);
    } else {
      this.weaponPrimary.setSize(12, 3).setFillStyle(0xbfd9ff, 1);
      this.weaponSecondary.setSize(12, 3).setFillStyle(0xbfd9ff, 1);
      this.weaponSecondary.x = -18;
    }
  }

  update(time, delta, arenaWidth = 960) {
    if (this.مات) return;
    const dt = delta / 1000;
    let dx = 0;

    if (this.keys.left.isDown || this.keys.a.isDown) dx -= 1;
    if (this.keys.right.isDown || this.keys.d.isDown) dx += 1;

    if (Phaser.Input.Keyboard.JustDown(this.keys.primary)) this.#basicAttack(time);
    if (Phaser.Input.Keyboard.JustDown(this.keys.secondary)) this.#secondaryAttack(time);
    if (Phaser.Input.Keyboard.JustDown(this.keys.hurt)) this.takeDamage(14);
    if (Phaser.Input.Keyboard.JustDown(this.keys.dash)) this.#dash(time);

    if (dx !== 0 && !['dash', 'attack', 'bowShot'].includes(this.الحالة)) {
      this.x += dx * this.السرعة * dt;
      this.اتجاه_النظر = dx > 0 ? 'يمين' : 'يسار';
      this.setScale(dx > 0 ? 4 : -4, 4);
      if (this.الحالة !== 'hurt') this.الحالة = 'walk';
    } else if (this.الحالة === 'walk') {
      this.الحالة = 'idle';
    }

    this.x = Phaser.Math.Clamp(this.x, 120, arenaWidth - 120);
    this.#animateByState(time);
    this.#updateProjectiles(delta);
  }

  #updateProjectiles(delta) {
    this.projectiles = this.projectiles.filter((p) => p.active);
    this.projectiles.forEach((p) => p.update(delta));
  }

  #animateByState(time) {
    if (this.الحالة === 'walk') {
      this.walkSwing += 0.22;
      const foot = Math.sin(this.walkSwing) * 1.8;
      this.bodySprite.y = -Math.abs(Math.sin(this.walkSwing)) * 1.2;
      this.weaponPrimary.y = -32 + foot;
      this.shadow.scaleX = 1 + Math.abs(foot) * 0.02;
    } else if (this.الحالة === 'idle') {
      this.bodySprite.y = Math.sin(time * 0.004) * 0.8;
      this.shadow.scaleX = 1;
    }
  }

  #basicAttack(time) {
    if (time - this.آخر_هجوم_أساسي < this.تهدئة_هجوم_أساسي || this.الحالة === 'death') return;
    this.آخر_هجوم_أساسي = time;
    this.الحالة = 'attack';

    AudioSystem.playSword();
    this.fx.slash(this.x, this.y-90, this.اتجاه_النظر==='يمين'?1:-1);
    if (this.الكلاس === 'رونين') this.#slashEffect(0xd7e6ff);
    if (this.الكلاس === 'طليعة الصحراء') this.#slashEffect(0xe7d2a5);
    if (this.الكلاس === 'صياد ستارلايت') this.#slashEffect(0xb8d8ff);

    this.scene.tweens.add({ targets: this.weaponPrimary, angle: 55, duration: 70, yoyo: true, repeat: 1 });
    this.scene.time.delayedCall(180, () => { if (!this.مات) this.الحالة = 'idle'; });
  }

  #secondaryAttack(time) {
    if (time - this.آخر_هجوم_ثانوي < this.تهدئة_هجوم_ثانوي || this.الحالة === 'death') return;
    this.آخر_هجوم_ثانوي = time;

    if (this.الكلاس === 'طليعة الصحراء') {
      AudioSystem.playHeavy();
      this.#shieldEffect();
      this.الحالة = 'bowShot';
      this.scene.time.delayedCall(210, () => this.#slashEffect(0xf0d8a8));
      this.scene.time.delayedCall(320, () => { if (!this.مات) this.الحالة = 'idle'; });
      return;
    }

    if (this.السهام <= 0) return;
    this.السهام -= 1;
    this.الحالة = 'bowShot';
    AudioSystem.playArrow();
    this.fx.arrowTrail(this.x + (this.اتجاه_النظر==='يمين'?55:-55), this.y-120, this.اتجاه_النظر==='يمين'?1:-1);
    this.#shootArrow();
    this.scene.tweens.add({ targets: this.weaponSecondary, scaleX: 1.35, duration: 90, yoyo: true });
    this.scene.time.delayedCall(160, () => { if (!this.مات) this.الحالة = 'idle'; });
  }

  #shootArrow() {
    const dir = this.اتجاه_النظر === 'يمين' ? 1 : -1;
    const arrow = new Projectile(this.scene, this.x + dir * 55, this.y - 120, dir);
    this.projectiles.push(arrow);
  }

  #slashEffect(color) {
    const dir = this.اتجاه_النظر === 'يمين' ? 1 : -1;
    const fx = this.scene.add.ellipse(this.x + dir * 46, this.y - 120, 14, 44, color, 0.45);
    fx.setAngle(dir > 0 ? 22 : -22);
    this.scene.tweens.add({ targets: fx, alpha: 0, scaleX: 2, duration: 140, onComplete: () => fx.destroy() });
  }

  #shieldEffect() {
    const dir = this.اتجاه_النظر === 'يمين' ? 1 : -1;
    const shield = this.scene.add.arc(this.x + dir * 30, this.y - 112, 24, 260, 100, false, 0x8cb4d9, 0.3);
    shield.setStrokeStyle(3, 0xc5def3, 1);
    this.scene.tweens.add({ targets: shield, alpha: 0, duration: 260, onComplete: () => shield.destroy() });
  }

  #dash(time) {
    if (time - this.آخر_اندفاع < this.زمن_تهدئة_الاندفاع || this.الحالة === 'death') return;
    this.آخر_اندفاع = time;
    AudioSystem.playDash();
    this.الحالة = 'dash';
    const dir = this.اتجاه_النظر === 'يمين' ? 1 : -1;

    if (this.الكلاس === 'صياد ستارلايت') {
      const shade = this.scene.add.rectangle(this.x, this.y - 110, 42, 54, 0x2a1238, 0.35);
      this.scene.tweens.add({ targets: shade, alpha: 0, scaleX: 1.8, duration: 180, onComplete: () => shade.destroy() });
    }

    this.scene.tweens.add({ targets: this, x: this.x + dir * 90, duration: 120, ease: 'Cubic.Out' });
    this.fx.dashDust(this.x, this.y-8, dir);
    this.scene.tweens.add({ targets: this.bodySprite, scaleX: 1.2, scaleY: 0.88, duration: 120, yoyo: true });
    this.scene.time.delayedCall(170, () => { if (!this.مات) this.الحالة = 'idle'; });
  }

  takeDamage(rawDamage) {
    if (this.مات) return;
    const actual = Math.max(1, rawDamage - this.الدفاع);
    this.الصحة -= actual;
    this.الحالة = 'hurt';
    this.scene.tweens.add({ targets: this.bodySprite, alpha: 0.25, duration: 55, yoyo: true, repeat: 2 });
    if (this.الصحة <= 0) return this.#die();
    this.scene.time.delayedCall(220, () => { if (!this.مات) this.الحالة = 'idle'; });
  }

  #die() {
    this.مات = true;
    this.الحالة = 'death';
    this.scene.tweens.add({ targets: this, angle: this.اتجاه_النظر === 'يمين' ? 72 : -72, alpha: 0.45, duration: 350 });
    this.scene.tweens.add({ targets: this.shadow, alpha: 0.1, duration: 350 });
  }
}
