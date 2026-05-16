import { gameConfig } from './config.js';

function showFallback(message) {
  const root = document.getElementById('game-root');
  if (!root) return;
  root.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#111a30;color:#eef4ff;font-family:Tahoma,Arial,sans-serif;padding:1rem;text-align:center;line-height:1.8">${message}</div>`;
}

window.addEventListener('error', (ev) => {
  showFallback(`حدث خطأ أثناء تشغيل اللعبة.<br>الرجاء إعادة التحميل.<br><small>${ev.message}</small>`);
});

window.addEventListener('load', () => {
  if (!window.Phaser) {
    showFallback('تعذر تحميل محرك اللعبة من الشبكة. حاول تحديث الصفحة.');
    return;
  }
  try {
    new Phaser.Game(gameConfig);
  } catch (err) {
    showFallback(`تعذر بدء اللعبة.<br><small>${err.message}</small>`);
  }
});
