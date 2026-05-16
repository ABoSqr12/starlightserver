import { gameState, setSelectedCharacter } from '../state.js';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
    this.selectedCharacter = null;
  }

  create() {
    this.cameras.main.setBackgroundColor('#0c1327');
    this.add.text(this.scale.width / 2, 56, 'اختر الشخصية', {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '44px', color: '#edf4ff',
    }).setOrigin(0.5);

    const cards = [
      {
        key: 'المسافر',
        name: 'المسافر',
        desc: 'شاب حنطي البشرة، ملامحه سعودية حادة، شارب كثيف، بنية قوية معتدلة، وندبة تمر قرب عينه.',
      },
      {
        key: 'المسافرة',
        name: 'المسافرة',
        desc: 'فتاة بيضاء البشرة، ملامحها سعودية حادة، بنية قوية معتدلة، وعلى يديها ندبات قديمة.',
      },
    ];

    this.cardViews = cards.map((c, i) => this.#createCard(190 + i * 360, 258, 320, 285, c));
    this.selectedCharacter = gameState.الشخصية_المختارة || cards[0].key;
    this.#updateSelection();

    this.#makeButton(280, 500, 'رجوع', () => this.scene.start('ModeSelectScene'));
    this.#makeButton(680, 500, 'متابعة', () => {
      setSelectedCharacter(this.selectedCharacter);
      this.scene.start('ClassSelectScene');
    });
  }

  #createCard(x, y, w, h, card) {
    const bg = this.add.rectangle(x, y, w, h, 0x1a274b, 0.97).setStrokeStyle(3, 0x385899, 1);

    const art = this.add.graphics();
    art.fillStyle(0x121b35, 1).fillRect(x - 128, y - 120, 256, 110);
    const skin = card.key === 'المسافر' ? 0x9d7a59 : 0xf0d4c0;
    art.fillStyle(0x1d2f5e, 1).fillRect(x - 18, y - 86, 36, 52);
    art.fillStyle(skin, 1).fillRect(x - 20, y - 106, 40, 28);
    if (card.key === 'المسافر') {
      art.fillStyle(0x2d1e17, 1).fillRect(x - 14, y - 93, 28, 4);
      art.fillStyle(0x5e2b22, 1).fillRect(x + 8, y - 94, 7, 10);
    } else {
      art.fillStyle(0x673935, 1).fillRect(x - 18, y - 86, 36, 7);
      art.fillStyle(0xc49b88, 1).fillRect(x - 23, y - 69, 46, 7);
    }

    const name = this.add.text(x, y + 8, card.name, {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '34px', color: '#f3f7ff',
    }).setOrigin(0.5);

    const desc = this.add.text(x, y + 84, card.desc, {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '20px', color: '#d6e7ff', align: 'center',
      wordWrap: { width: w - 30 },
    }).setOrigin(0.5);

    const zone = this.add.rectangle(x, y, w, h, 0x000000, 0).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => { this.selectedCharacter = card.key; this.#updateSelection(); });

    return { card, bg, name, desc };
  }

  #updateSelection() {
    this.cardViews.forEach((v) => {
      const on = v.card.key === this.selectedCharacter;
      v.bg.setStrokeStyle(on ? 5 : 3, on ? 0x9fdcff : 0x385899, 1);
      v.bg.setFillStyle(on ? 0x254076 : 0x1a274b, 0.98);
    });
  }

  #makeButton(x, y, label, onClick) {
    const b = this.add.text(x, y, label, {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '30px', color: '#fff', backgroundColor: '#2c4278',
      padding: { left: 18, right: 18, top: 8, bottom: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    b.on('pointerover', () => b.setStyle({ backgroundColor: '#3d5da5' }));
    b.on('pointerout', () => b.setStyle({ backgroundColor: '#2c4278' }));
    b.on('pointerdown', onClick);
  }
}
