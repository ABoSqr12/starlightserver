import { AudioSystem } from '../systems/AudioSystem.js';

export class DialogueBox {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.onFinish = options.onFinish || (() => {});
    this.mode = options.mode || 'نمط القصة';
    this.dialogue = [];
    this.index = 0;
    this.charIndex = 0;
    this.isTyping = false;
    this.fullLine = '';

    const w = scene.scale.width;
    const h = scene.scale.height;

    this.dim = scene.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.36).setDepth(300).setVisible(false);
    this.panel = scene.add.rectangle(w / 2, h - 90, w - 30, 160, 0x111a32, 0.96).setStrokeStyle(2, 0x5d76b3, 1).setDepth(301).setVisible(false);
    this.speaker = scene.add.text(w - 48, h - 156, '', {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '24px', color: '#9fd0ff',
      align: 'right',
    }).setOrigin(1, 0.5).setDepth(302).setVisible(false);

    this.text = scene.add.text(w - 48, h - 120, '', {
      fontFamily: 'Tahoma, Arial, sans-serif',
      fontSize: '27px',
      color: '#f2f7ff',
      align: 'right',
      wordWrap: { width: w - 120, useAdvancedWrap: true },
      rtl: true,
    }).setOrigin(1, 0).setDepth(302).setVisible(false);

    this.hint = scene.add.text(44, h - 38, 'اضغط Enter للمتابعة', {
      fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '18px', color: '#cadbff',
    }).setOrigin(0, 0.5).setDepth(302).setVisible(false);

    this.enter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  show(dialogueLines, mode = 'نمط القصة') {
    this.mode = mode;
    this.dialogue = dialogueLines;
    this.index = 0;
    this.dim.setVisible(true);
    this.panel.setVisible(true);
    this.speaker.setVisible(true);
    this.text.setVisible(true);
    this.hint.setVisible(true);
    this.#playOpenTone();
    this.#startLine();
  }

  update() {
    if (!this.panel.visible) return;
    if (Phaser.Input.Keyboard.JustDown(this.enter)) {
      if (this.isTyping && this.mode === 'نمط السرعة') {
        this.text.setText(this.fullLine);
        this.charIndex = this.fullLine.length;
        this.isTyping = false;
        return;
      }
      if (this.isTyping) return;
      this.index += 1;
      if (this.index >= this.dialogue.length) return this.hide();
      this.#startLine();
    }
  }

  hide() {
    this.dim.setVisible(false);
    this.panel.setVisible(false);
    this.speaker.setVisible(false);
    this.text.setVisible(false);
    this.hint.setVisible(false);
    this.onFinish();
  }

  #startLine() {
    const item = this.dialogue[this.index];
    this.speaker.setText(item.المتحدث || '');
    this.fullLine = item.النص || '';
    this.charIndex = 0;
    this.text.setText('');
    this.isTyping = true;

    this.scene.time.addEvent({
      repeat: this.fullLine.length,
      delay: this.mode === 'نمط السرعة' ? 12 : 28,
      callback: () => {
        if (!this.isTyping) return;
        this.charIndex += 1;
        this.text.setText(this.fullLine.slice(0, this.charIndex));
        if (this.charIndex % 3 === 0) AudioSystem.playTypeTick(this.scene);
        if (this.charIndex >= this.fullLine.length) this.isTyping = false;
      },
    });
  }

  #playOpenTone() {
    AudioSystem.playDialogueOpen(this.scene);
  }
}
