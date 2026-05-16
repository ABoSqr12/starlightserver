const KEY = 'starlight_audio_settings_v1';

export class AudioSystem {
  static settings = { مستوى_الصوت: 0.65, الموسيقى: true, المؤثرات: true };
  static ctx = null;
  static started = false;
  static activeNodes = [];

  static ensure(scene) {
    if (!this.ctx) this.ctx = scene.sound?.context || null;
    if (!this.started) {
      scene.input.once('pointerdown', () => this.start());
      scene.input.keyboard.once('keydown', () => this.start());
    }
    this.loadSettings();
  }

  static start() {
    if (!this.ctx || this.started) return;
    this.started = true;
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  static loadSettings() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) this.settings = { ...this.settings, ...JSON.parse(raw) };
    } catch {}
  }
  static saveSettings() { localStorage.setItem(KEY, JSON.stringify(this.settings)); }
  static setSettings(next) { this.settings = { ...this.settings, ...next }; this.saveSettings(); }

  static stopMusic() { this.activeNodes.forEach((n) => n.stop?.()); this.activeNodes = []; }

  static #tone(freq, dur, type = 'triangle', vol = 0.03, slide = null) {
    if (!this.ctx || !this.started || !this.settings.المؤثرات) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, now);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, now + dur);
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(vol * this.settings.مستوى_الصوت, now + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g); g.connect(this.ctx.destination); o.start(now); o.stop(now + dur + 0.02);
  }

  static #music(pattern, bpm = 80, wave = 'triangle', vol = 0.02) {
    if (!this.ctx || !this.started || !this.settings.الموسيقى) return;
    this.stopMusic();
    const beat = 60 / bpm;
    const now = this.ctx.currentTime;
    pattern.forEach((f, i) => {
      const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
      o.type = wave; o.frequency.setValueAtTime(f, now + i * beat);
      g.gain.setValueAtTime(0.0001, now + i * beat);
      g.gain.exponentialRampToValueAtTime(vol * this.settings.مستوى_الصوت, now + i * beat + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * beat + beat * 0.9);
      o.connect(g); g.connect(this.ctx.destination); o.start(now + i * beat); o.stop(now + i * beat + beat);
      this.activeNodes.push(o);
    });
  }

  static playMenuMusic() { this.#music([220, 247, 262, 294, 262, 247, 220, 196], 66, 'triangle', 0.018); }
  static playCombatMusic() { this.#music([196, 220, 247, 220, 262, 220, 294, 247], 108, 'sawtooth', 0.02); }
  static playBossMusic() { this.#music([147, 165, 147, 131, 110, 131, 147, 98], 88, 'square', 0.024); }
  static playRestMusic() { this.#music([262, 294, 330, 349, 330, 294, 262, 220], 64, 'triangle', 0.016); }
  static playEndingMusic() { this.#music([220, 247, 294, 330, 294, 262, 220, 196], 60, 'triangle', 0.015); }

  static playButton() { this.#tone(540, 0.06, 'square', 0.02); }
  static playMenuOpen() { this.#tone(320, 0.13, 'triangle', 0.02, 210); }
  static playSword() { this.#tone(380, 0.08, 'sawtooth', 0.03, 250); }
  static playArrow() { this.#tone(720, 0.07, 'triangle', 0.02, 440); }
  static playHitEnemy() { this.#tone(180, 0.08, 'square', 0.03); }
  static playEnemyDeath() { this.#tone(130, 0.15, 'sawtooth', 0.03, 70); }
  static playBossEntry(scene) { this.ensure(scene); this.#tone(120, 0.8, 'sawtooth', 0.05, 68); }
  static playRoundEnd() { this.#tone(460, 0.13, 'triangle', 0.025, 620); }
  static playNpc() { this.#tone(300, 0.09, 'triangle', 0.018, 350); }
  static playDialogueOpen(scene) { this.ensure(scene); this.#tone(430, 0.16, 'triangle', 0.016, 290); }
  static playTypeTick(scene) { this.ensure(scene); this.#tone(720, 0.04, 'square', 0.008); }
  static playDash() { this.#tone(260, 0.09, 'sawtooth', 0.022, 120); }
  static playHeavy() { this.#tone(95, 0.17, 'square', 0.04); }
  static playFinalReveal() { this.#tone(150, 0.9, 'triangle', 0.04, 62); }
}
