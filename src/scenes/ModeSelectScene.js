import { gameState, resetGameState, setSelectedMode } from '../state.js';

export class ModeSelectScene extends Phaser.Scene {
  constructor() {
    super('ModeSelectScene');
    this.selectedMode = null;
  }

  create() {
    this.cameras.main.setBackgroundColor('#0d1225');
    this.add.text(this.scale.width / 2, 62, 'اختر نمط اللعب', {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '44px', color: '#edf4ff',
    }).setOrigin(0.5);

    const cards = [
      {
        key: 'نمط القصة',
        title: 'نمط القصة',
        desc: 'لمن يريد أن يسمع الحكاية كما كُتبت.\nالوقت يتوقف أثناء الحوارات.',
      },
      {
        key: 'نمط السرعة',
        title: 'نمط السرعة',
        desc: 'لمن يريد بلوغ النهاية بأسرع وقت.\nالوقت لا يرحم المترددين.',
      },
    ];

    this.cardViews = cards.map((card, i) => this.#createCard(190 + i * 360, 260, 320, 260, card));
    this.selectedMode = gameState.النمط_المختار || cards[0].key;
    this.#updateSelection();

    this.#makeButton(280, 490, 'رجوع', () => this.scene.start('MainMenuScene'));
    this.#makeButton(680, 490, 'متابعة', () => {
      if (!this.selectedMode) return;
      resetGameState();
      setSelectedMode(this.selectedMode);
      this.scene.start('CharacterSelectScene');
    });
  }

  #createCard(x, y, w, h, card) {
    const bg = this.add.rectangle(x, y, w, h, 0x1a2649, 0.95).setStrokeStyle(3, 0x334f8d, 1);
    const art = this.add.graphics();
    art.fillStyle(0x111a34, 1).fillRect(x - 130, y - 95, 260, 90);
    for (let i = 0; i < 26; i += 1) {
      art.fillStyle(0xd6e8ff, Phaser.Math.FloatBetween(0.3, 0.9));
      art.fillRect(x - 124 + i * 10, y - 88 + Phaser.Math.Between(0, 72), 2, 2);
    }
    art.fillStyle(0x0a1022, 1).fillRect(x - 24, y - 56, 48, 52);
    art.fillStyle(0x4e76c7, 0.35).fillRect(x - 14, y - 42, 28, 38);

    const title = this.add.text(x, y + 20, card.title, {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '34px', color: '#f2f7ff',
    }).setOrigin(0.5);

    const desc = this.add.text(x, y + 85, card.desc, {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '21px', color: '#d3e5ff', align: 'center',
      wordWrap: { width: w - 30 },
    }).setOrigin(0.5);

    const zone = this.add.rectangle(x, y, w, h, 0x000000, 0).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => {
      this.selectedMode = card.key;
      this.#updateSelection();
    });

    return { card, bg, title, desc };
  }

  #updateSelection() {
    this.cardViews.forEach((v) => {
      const on = v.card.key === this.selectedMode;
      v.bg.setStrokeStyle(on ? 5 : 3, on ? 0x8ed1ff : 0x334f8d, 1);
      v.bg.setFillStyle(on ? 0x253a70 : 0x1a2649, 0.97);
      v.title.setColor(on ? '#ffffff' : '#f2f7ff');
      v.desc.setColor(on ? '#e6f3ff' : '#d3e5ff');
    });
  }

  #makeButton(x, y, label, onClick) {
    const b = this.add.text(x, y, label, {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '30px', color: '#ffffff', backgroundColor: '#2a3f73',
      padding: { left: 18, right: 18, top: 8, bottom: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    b.on('pointerover', () => b.setStyle({ backgroundColor: '#3b589a' }));
    b.on('pointerout', () => b.setStyle({ backgroundColor: '#2a3f73' }));
    b.on('pointerdown', onClick);
  }
}
