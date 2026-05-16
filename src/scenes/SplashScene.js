export class SplashScene extends Phaser.Scene {
  constructor() {
    super('SplashScene');
    this.isLeaving = false;
  }

  create() {
    this.cameras.main.fadeIn(700, 0, 0, 0);

    this.#drawSky();
    this.#drawMoon();
    this.#drawDistantGate();
    this.#drawMist();
    this.#createLightParticles();

    const title = this.add
      .text(this.scale.width / 2, this.scale.height * 0.3, 'ستارلايت: ما دون النجوم', {
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: '52px',
        color: '#eef6ff',
        stroke: '#101a31',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const motto = this.add
      .text(this.scale.width / 2, this.scale.height * 0.43, 'رحلة لا تبدأ من الطريق بل من الداخل', {
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: '28px',
        color: '#d2e7ff',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.add
      .text(this.scale.width / 2, this.scale.height - 28, 'صُنعت بواسطة Ragnar (@abusqr)', {
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: '20px',
        color: '#9fd5ff',
      })
      .setOrigin(0.5);

    this.tweens.add({ targets: title, alpha: 1, duration: 1200, ease: 'Sine.Out' });
    this.tweens.add({ targets: motto, alpha: 1, duration: 1200, delay: 500, ease: 'Sine.Out' });

    this.time.delayedCall(3000, () => this.#leave());

    this.input.keyboard.on('keydown-ENTER', () => this.#leave());
    this.input.keyboard.on('keydown-SPACE', () => this.#leave());
  }

  #leave() {
    if (this.isLeaving) return;
    this.isLeaving = true;

    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.time.delayedCall(620, () => {
      this.scene.start('MainMenuScene');
    });
  }

  #drawSky() {
    const g = this.add.graphics();
    const cell = 12;

    for (let y = 0; y < this.scale.height; y += cell) {
      for (let x = 0; x < this.scale.width; x += cell) {
        const shade = Phaser.Math.Between(8, 24) + Math.floor((y / this.scale.height) * 16);
        g.fillStyle(Phaser.Display.Color.GetColor(shade, shade + 4, shade + 14), 1);
        g.fillRect(x, y, cell, cell);
      }
    }

    for (let i = 0; i < 220; i += 1) {
      const x = Phaser.Math.Between(0, this.scale.width - 2);
      const y = Phaser.Math.Between(0, Math.floor(this.scale.height * 0.72));
      const size = Phaser.Math.RND.pick([1, 1, 2]);
      const alpha = Phaser.Math.FloatBetween(0.4, 0.95);
      g.fillStyle(0xe2f1ff, alpha);
      g.fillRect(x, y, size, size);
    }
  }

  #drawMoon() {
    const moon = this.add.graphics();
    moon.fillStyle(0xdbe8ff, 1);
    moon.fillCircle(810, 94, 48);
    moon.fillStyle(0xc5d8fa, 0.6);
    moon.fillCircle(790, 84, 10);
    moon.fillCircle(834, 102, 8);
    moon.fillCircle(815, 120, 6);

    const maskShadow = this.add.graphics();
    maskShadow.fillStyle(0x0d1223, 0.55);
    maskShadow.fillCircle(826, 78, 52);
  }

  #drawDistantGate() {
    const gate = this.add.graphics();
    gate.fillStyle(0x0b1020, 1);
    gate.fillRect(430, 260, 100, 180);
    gate.fillStyle(0x080d1b, 1);
    gate.fillRect(448, 280, 64, 160);
    gate.fillStyle(0x111936, 1);
    gate.fillRect(462, 294, 36, 146);

    const aura = this.add.rectangle(480, 350, 90, 158, 0x5b8cff, 0.1);
    this.tweens.add({
      targets: aura,
      alpha: { from: 0.05, to: 0.2 },
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  #drawMist() {
    const mist = this.add.graphics();
    for (let i = 0; i < 7; i += 1) {
      mist.fillStyle(0x9bb7e6, 0.08);
      mist.fillEllipse(160 + i * 120, 430 + (i % 2) * 18, 220, 64);
    }

    this.tweens.add({
      targets: mist,
      x: 12,
      duration: 2800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  #createLightParticles() {
    const particles = this.add.particles(0, 0, '__WHITE', {
      x: { min: 430, max: 530 },
      y: { min: 300, max: 460 },
      lifespan: 1500,
      speedY: { min: -20, max: -6 },
      speedX: { min: -6, max: 6 },
      quantity: 1,
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.45, end: 0 },
      tint: 0xb5d7ff,
      frequency: 110,
      blendMode: 'ADD',
    });
    particles.setDepth(10);
  }
}
