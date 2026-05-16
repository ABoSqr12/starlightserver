import { SaveSystem } from '../systems/SaveSystem.js';
import { AudioSystem } from '../systems/AudioSystem.js';
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
    this.starLayers = [];
    this.menuButtons = [];
  }

  create() {
    AudioSystem.ensure(this);
    AudioSystem.playMenuMusic();
    AudioSystem.playMenuOpen();
    this.#drawBackdrop();
    this.#createAnimatedStars();
    this.#createTitle();
    const pf = SaveSystem.loadProfile();
    if (!pf.اسم_اللاعب) SaveSystem.saveProfile({ اسم_اللاعب: 'ابن النجوم' });
    this.#createMenuButtons();
    this.#createCredit();
  }

  update() {
    this.starLayers.forEach((layer) => {
      layer.children.iterate((star) => {
        star.x -= layer.speed;
        if (star.x < -3) {
          star.x = this.scale.width + Phaser.Math.Between(0, 40);
          star.y = Phaser.Math.Between(8, this.scale.height * 0.72);
        }
      });
    });
  }

  #drawBackdrop() {
    const g = this.add.graphics();
    const tile = 12;
    for (let y = 0; y < this.scale.height; y += tile) {
      for (let x = 0; x < this.scale.width; x += tile) {
        const shade = Phaser.Math.Between(8, 22) + Math.floor((y / this.scale.height) * 18);
        g.fillStyle(Phaser.Display.Color.GetColor(shade, shade + 3, shade + 12), 1);
        g.fillRect(x, y, tile, tile);
      }
    }

    const moon = this.add.graphics();
    moon.fillStyle(0xdce9ff, 1);
    moon.fillCircle(820, 90, 46);
    moon.fillStyle(0xc3d5f2, 0.65);
    moon.fillCircle(805, 81, 8);
    moon.fillCircle(838, 102, 7);

    const gate = this.add.graphics();
    gate.fillStyle(0x090f1f, 1);
    gate.fillRect(430, 225, 110, 210);
    gate.fillStyle(0x111938, 0.9);
    gate.fillRect(452, 258, 66, 177);

    const gateGlow = this.add.rectangle(485, 342, 90, 170, 0x5b87ff, 0.09);
    this.tweens.add({ targets: gateGlow, alpha: { from: 0.06, to: 0.17 }, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    const shadows = this.add.graphics();
    shadows.fillStyle(0x05070d, 0.7);
    shadows.fillTriangle(80, 430, 210, 340, 280, 430);
    shadows.fillTriangle(250, 430, 380, 345, 470, 430);
    shadows.fillTriangle(620, 430, 760, 335, 870, 430);

    const mist = this.add.graphics();
    for (let i = 0; i < 8; i += 1) {
      mist.fillStyle(0x8faedc, 0.075);
      mist.fillEllipse(80 + i * 120, 438 + (i % 2) * 12, 235, 58);
    }
    this.tweens.add({ targets: mist, x: 16, duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  #createAnimatedStars() {
    const makeLayer = (count, color, speed, size) => {
      const group = this.add.group();
      for (let i = 0; i < count; i += 1) {
        const star = this.add.rectangle(
          Phaser.Math.Between(0, this.scale.width),
          Phaser.Math.Between(8, this.scale.height * 0.72),
          size,
          size,
          color,
          Phaser.Math.FloatBetween(0.45, 0.95),
        );
        group.add(star);
      }
      this.starLayers.push({ children: group, speed });
    };

    makeLayer(75, 0xdceeff, 0.08, 2);
    makeLayer(40, 0xbfd8ff, 0.16, 2);
    makeLayer(20, 0xffffff, 0.24, 3);
  }

  #createTitle() {
    this.add.text(this.scale.width / 2, 86, 'ستارلايت: ما دون النجوم', {
      fontFamily: 'Tahoma, Arial, sans-serif',
      fontSize: '50px',
      color: '#f4f8ff',
      stroke: '#091127',
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 0, color: '#7da8ff', blur: 12, fill: true },
    }).setOrigin(0.5);
  }

  #createMenuButtons() {
    const options = [
      { text: 'ابدأ الرحلة', scene: 'ModeSelectScene' },
      { text: 'ترتيب الخاتمين', scene: 'LeaderboardScene' },
      { text: 'الإعدادات', scene: 'SettingsScene' },
      { text: 'عن اللعبة', scene: 'AboutScene' },
    ];

    options.forEach((option, index) => {
      const y = 210 + index * 74;
      const glow = this.add.rectangle(this.scale.width / 2, y, 330, 58, 0x79acff, 0.08).setAlpha(0.08);
      const btn = this.add.text(this.scale.width / 2, y, option.text, {
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: '34px',
        color: '#ddebff',
        backgroundColor: '#1a2749',
        padding: { left: 24, right: 24, top: 10, bottom: 10 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => {
        this.#playHoverSound();
        btn.setStyle({ color: '#ffffff', backgroundColor: '#2a3f6f' });
        this.tweens.add({ targets: btn, y: y - 3, duration: 120, ease: 'Sine.Out' });
        this.tweens.add({ targets: glow, alpha: 0.22, duration: 120, ease: 'Sine.Out' });
      });

      btn.on('pointerout', () => {
        btn.setStyle({ color: '#ddebff', backgroundColor: '#1a2749' });
        this.tweens.add({ targets: btn, y, duration: 120, ease: 'Sine.Out' });
        this.tweens.add({ targets: glow, alpha: 0.08, duration: 120, ease: 'Sine.Out' });
      });

      btn.on('pointerdown', () => {
        AudioSystem.playButton();
        this.#playClickSound();
        this.tweens.add({ targets: btn, scaleX: 0.97, scaleY: 0.97, duration: 60, yoyo: true, ease: 'Sine.InOut' });
        this.time.delayedCall(120, () => this.scene.start(option.scene));
      });

      this.menuButtons.push(btn);
    });
  }

  #createCredit() {
    this.add.text(this.scale.width / 2, this.scale.height - 24, 'صُنعت بواسطة Ragnar (@abusqr)', {
      fontFamily: 'Tahoma, Arial, sans-serif',
      fontSize: '20px',
      color: '#9ecfff',
    }).setOrigin(0.5);
  }

  #playHoverSound() {
    this.#playTone(220, 0.015, 0.03, 'triangle', 0.015);
  }

  #playClickSound() {
    this.#playTone(165, 0.02, 0.06, 'square', 0.03);
    this.time.delayedCall(35, () => this.#playTone(220, 0.01, 0.05, 'triangle', 0.02));
  }

  #playTone(freq, attack, duration, type, volume) {
    const ctx = this.sound.context;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }
}
