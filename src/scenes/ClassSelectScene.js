import { gameState, setSelectedClass } from '../state.js';

export class ClassSelectScene extends Phaser.Scene {
  constructor() {
    super('ClassSelectScene');
    this.selectedClass = null;
  }

  create() {
    this.cameras.main.setBackgroundColor('#0c1429');
    this.add.text(this.scale.width / 2, 50, 'اختر الكلاس', {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '44px', color: '#edf5ff',
    }).setOrigin(0.5);

    const classes = [
      { key: 'رونين', desc: 'كاتانا وقوس، متوازن، يبدأ بستة أسهم.', arrows: 6, health: 100, art: 'katana' },
      { key: 'طليعة الصحراء', desc: 'درع وسيف عربي ثقيل أو رمح قصير، دفاع أعلى، حركة أبطأ.', arrows: 4, health: 125, art: 'shield' },
      { key: 'صياد ستارلايت', desc: 'خنجران وقوس قصير، سريع، صحة أقل، فرصة ضربة حرجة أعلى.', arrows: 5, health: 82, art: 'dagger' },
    ];

    this.cardViews = classes.map((c, i) => this.#createCard(170 + i * 310, 265, 290, 320, c));
    this.selectedClass = gameState.الكلاس_المختار || classes[0].key;
    this.#updateSelection();

    this.#makeButton(270, 505, 'رجوع', () => this.scene.start('CharacterSelectScene'));
    this.#makeButton(690, 505, 'متابعة', () => {
      setSelectedClass(this.selectedClass);
      this.scene.start('StoryIntroScene');
    });
  }

  #createCard(x, y, w, h, data) {
    const bg = this.add.rectangle(x, y, w, h, 0x1a274b, 0.98).setStrokeStyle(3, 0x35589f, 1);
    const art = this.add.graphics();
    art.fillStyle(0x111a34, 1).fillRect(x - 112, y - 138, 224, 102);
    this.#drawClassIcon(art, x, y - 86, data.art);

    const title = this.add.text(x, y + 5, data.key, {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '31px', color: '#f2f8ff',
    }).setOrigin(0.5);

    const desc = this.add.text(x, y + 90, data.desc, {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '19px', color: '#d6e7ff', align: 'center',
      wordWrap: { width: w - 28 },
    }).setOrigin(0.5);

    const zone = this.add.rectangle(x, y, w, h, 0, 0).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => {
      this.selectedClass = data.key;
      this.#updateSelection();
    });

    return { data, bg, title, desc };
  }

  #drawClassIcon(g, cx, cy, type) {
    if (type === 'katana') {
      g.fillStyle(0xb7cfff, 1).fillRect(cx - 50, cy + 6, 100, 6);
      g.fillStyle(0x8b5f34, 1).fillRect(cx - 8, cy - 26, 16, 32);
      g.fillStyle(0xd8b97a, 1).fillRect(cx + 12, cy - 18, 52, 5);
      g.fillStyle(0x8a6541, 1).fillRect(cx + 62, cy - 20, 14, 9);
    } else if (type === 'shield') {
      g.fillStyle(0x7f95bf, 1).fillRect(cx - 24, cy - 28, 48, 58);
      g.fillStyle(0x5f75a8, 1).fillRect(cx - 12, cy - 14, 24, 30);
      g.fillStyle(0xadbfe5, 1).fillRect(cx - 58, cy - 3, 116, 8);
      g.fillStyle(0x9f7743, 1).fillRect(cx + 48, cy - 16, 12, 32);
    } else {
      g.fillStyle(0xbfd5ff, 1).fillRect(cx - 56, cy - 4, 44, 6);
      g.fillStyle(0xbfd5ff, 1).fillRect(cx + 12, cy - 4, 44, 6);
      g.fillStyle(0x8e683e, 1).fillRect(cx - 12, cy - 24, 24, 48);
      g.fillStyle(0xcedefc, 1).fillRect(cx - 66, cy - 26, 132, 4);
    }
  }

  #updateSelection() {
    this.cardViews.forEach((v) => {
      const on = v.data.key === this.selectedClass;
      v.bg.setStrokeStyle(on ? 5 : 3, on ? 0x99daff : 0x35589f, 1);
      v.bg.setFillStyle(on ? 0x27427a : 0x1a274b, 0.99);
    });
  }

  #makeButton(x, y, label, onClick) {
    const b = this.add.text(x, y, label, {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '30px', color: '#fff', backgroundColor: '#2a3f73',
      padding: { left: 18, right: 18, top: 8, bottom: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    b.on('pointerover', () => b.setStyle({ backgroundColor: '#3d5ea5' }));
    b.on('pointerout', () => b.setStyle({ backgroundColor: '#2a3f73' }));
    b.on('pointerdown', onClick);
  }
}
