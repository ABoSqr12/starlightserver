import { DialogueBox } from '../ui/DialogueBox.js';
import { gameState } from '../state.js';

export class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.dialogueBox = null;
    this.active = false;
  }

  play(lines, onFinish = () => {}) {
    const mode = gameState.النمط_المختار || 'نمط القصة';
    if (!this.dialogueBox) {
      this.dialogueBox = new DialogueBox(this.scene, {
        mode,
        onFinish: () => {
          this.active = false;
          if (mode === 'نمط القصة') this.scene.time.timeScale = 1;
          onFinish();
        },
      });
    }

    const adapted = lines.map((line) => this.#adaptLine(line));
    this.active = true;

    if (mode === 'نمط القصة') this.scene.time.timeScale = 0;
    this.scene.time.delayedCall(0, () => {
      if (mode === 'نمط القصة') this.scene.time.timeScale = 1;
      this.dialogueBox.show(adapted, mode);
      if (mode === 'نمط القصة') this.scene.time.timeScale = 0.0001;
    });
  }

  update() {
    if (!this.dialogueBox) return;
    this.dialogueBox.update();
  }

  #adaptLine(line) {
    const char = gameState.الشخصية_المختارة || 'المسافر';
    let text = line.النص || '';
    if (char === 'المسافرة') {
      text = text.replaceAll('وصلتَ', 'وصلتِ').replaceAll('أنتَ', 'أنتِ').replaceAll('قاتلتَ', 'قاتلتِ');
    }
    return { المتحدث: line.المتحدث, النص: text };
  }
}
