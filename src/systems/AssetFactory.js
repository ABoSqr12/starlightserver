export class AssetFactory {
  static ensureAll(scene, selectedCharacter = 'المسافر', selectedClass = 'رونين') {
    this.createMaleTravelerTexture(scene);
    this.createFemaleTravelerTexture(scene);
    this.createRoninVariant(scene);
    this.createDesertVanguardVariant(scene);
    this.createStarlightHunterVariant(scene);
    this.createEnemyTexture(scene, 'عدو_ظل');
    this.createBossTexture(scene, 'سيد_الشق');
    this.createFinalSelfTexture(scene, selectedCharacter, selectedClass);
  }

  static createMaleTravelerTexture(scene, key = 'لاعب_المسافر') {
    if (scene.textures.exists(key)) return key;
    const c = scene.textures.createCanvas(key, 32, 48);
    const x = c.context;
    x.imageSmoothingEnabled = false;
    const p = (px, py, w, h, color) => { x.fillStyle = color; x.fillRect(px, py, w, h); };

    p(10, 4, 12, 10, '#9c7652');
    p(11, 7, 3, 2, '#2a1d16'); p(18, 7, 3, 2, '#2a1d16');
    p(12, 11, 8, 2, '#3a2519'); // شارب
    p(20, 8, 1, 4, '#6f312a'); // ندبة
    p(11, 14, 10, 3, '#7f5e45');
    p(9, 17, 14, 12, '#2a3f68');
    p(8, 19, 2, 10, '#9c7652'); p(22, 19, 2, 10, '#9c7652');
    p(9, 29, 14, 8, '#1c2c49');
    p(11, 37, 4, 10, '#40332b'); p(17, 37, 4, 10, '#40332b');
    p(9, 31, 2, 2, '#516fa8'); p(21, 31, 2, 2, '#516fa8');

    c.refresh();
    return key;
  }

  static createFemaleTravelerTexture(scene, key = 'لاعب_المسافرة') {
    if (scene.textures.exists(key)) return key;
    const c = scene.textures.createCanvas(key, 32, 48);
    const x = c.context;
    x.imageSmoothingEnabled = false;
    const p = (px, py, w, h, color) => { x.fillStyle = color; x.fillRect(px, py, w, h); };

    p(9, 3, 14, 11, '#efd5c1');
    p(8, 2, 16, 4, '#59352f'); p(7, 5, 3, 9, '#59352f'); p(22, 5, 3, 9, '#59352f');
    p(11, 7, 3, 2, '#2f221a'); p(18, 7, 3, 2, '#2f221a');
    p(12, 11, 8, 1, '#7e5a51');
    p(9, 17, 14, 12, '#3f2e5f');
    p(8, 19, 2, 10, '#efd5c1'); p(22, 19, 2, 10, '#efd5c1');
    p(8, 23, 2, 1, '#b9837d'); p(22, 25, 2, 1, '#b9837d'); // ندبات يد
    p(9, 29, 14, 8, '#2a2144');
    p(11, 37, 4, 10, '#353042'); p(17, 37, 4, 10, '#353042');

    c.refresh();
    return key;
  }

  static createRoninVariant(scene, baseKey = 'لاعب_المسافر', key = 'كلاس_رونين') {
    if (scene.textures.exists(key)) return key;
    const c = scene.textures.createCanvas(key, 32, 48);
    const x = c.context; x.imageSmoothingEnabled = false;
    x.drawImage(scene.textures.get(baseKey).getSourceImage(), 0, 0);
    x.fillStyle = '#a8c7ff'; x.fillRect(2, 21, 10, 2); // كاتانا
    x.fillStyle = '#805f34'; x.fillRect(1, 20, 2, 4);
    x.fillStyle = '#d2b67a'; x.fillRect(20, 16, 10, 2); // قوس
    x.fillStyle = '#2a1e1f'; x.fillRect(8, 16, 16, 3); // وشاح
    c.refresh(); return key;
  }

  static createDesertVanguardVariant(scene, baseKey = 'لاعب_المسافر', key = 'كلاس_طليعة_الصحراء') {
    if (scene.textures.exists(key)) return key;
    const c = scene.textures.createCanvas(key, 32, 48);
    const x = c.context; x.imageSmoothingEnabled = false;
    x.drawImage(scene.textures.get(baseKey).getSourceImage(), 0, 0);
    x.fillStyle = '#8898af'; x.fillRect(7, 18, 18, 12); // درع
    x.fillStyle = '#5f6d80'; x.fillRect(10, 21, 12, 6);
    x.fillStyle = '#c7d3e0'; x.fillRect(22, 22, 8, 2); // سيف/رمح
    x.fillStyle = '#8b6d3f'; x.fillRect(28, 20, 2, 10);
    c.refresh(); return key;
  }

  static createStarlightHunterVariant(scene, baseKey = 'لاعب_المسافر', key = 'كلاس_صياد_ستارلايت') {
    if (scene.textures.exists(key)) return key;
    const c = scene.textures.createCanvas(key, 32, 48);
    const x = c.context; x.imageSmoothingEnabled = false;
    x.drawImage(scene.textures.get(baseKey).getSourceImage(), 0, 0);
    x.fillStyle = '#181b2f'; x.fillRect(7, 4, 18, 4); // غطاء رأس
    x.fillStyle = '#c2d8ff'; x.fillRect(3, 25, 7, 2); // خنجر
    x.fillStyle = '#c2d8ff'; x.fillRect(22, 25, 7, 2); // خنجر
    x.fillStyle = '#d0b36f'; x.fillRect(19, 17, 9, 2); // قوس
    c.refresh(); return key;
  }

  static createEnemyTexture(scene, key = 'عدو_ظل') {
    if (scene.textures.exists(key)) return key;
    const c = scene.textures.createCanvas(key, 32, 48);
    const x = c.context; x.imageSmoothingEnabled = false;
    const p = (px, py, w, h, color) => { x.fillStyle = color; x.fillRect(px, py, w, h); };
    p(10, 6, 12, 9, '#2f3346'); p(11, 9, 3, 2, '#9b4a5f'); p(18, 9, 3, 2, '#9b4a5f');
    p(9, 16, 14, 13, '#1c1f2d'); p(7, 20, 2, 9, '#2a2d3d'); p(23, 20, 2, 9, '#2a2d3d');
    p(11, 29, 4, 10, '#171a26'); p(17, 29, 4, 10, '#171a26');
    c.refresh(); return key;
  }

  static createBossTexture(scene, bossName = 'سيد_الشق', key = 'بوس_سيد_الشق') {
    if (scene.textures.exists(key)) return key;
    const c = scene.textures.createCanvas(key, 48, 64);
    const x = c.context; x.imageSmoothingEnabled = false;
    const p = (px, py, w, h, color) => { x.fillStyle = color; x.fillRect(px, py, w, h); };
    p(14, 6, 20, 14, '#3c415a'); p(17, 11, 4, 2, '#7a1118'); p(27, 11, 4, 2, '#7a1118');
    p(10, 22, 28, 20, '#24283b'); p(7, 26, 3, 14, '#31374a'); p(38, 26, 3, 14, '#31374a');
    p(14, 42, 8, 16, '#1a1f2f'); p(26, 42, 8, 16, '#1a1f2f');
    p(6, 22, 4, 20, '#8a6b3d'); p(38, 22, 4, 20, '#8a6b3d');
    p(18, 23, 12, 4, '#53608a');
    c.refresh(); return key;
  }

  static createFinalSelfTexture(scene, selectedCharacter = 'المسافر', selectedClass = 'رونين', key = 'الذات_الأخيرة') {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    const base = selectedCharacter === 'المسافرة' ? this.createFemaleTravelerTexture(scene) : this.createMaleTravelerTexture(scene);
    const classKey = selectedClass === 'طليعة الصحراء'
      ? this.createDesertVanguardVariant(scene, base)
      : selectedClass === 'صياد ستارلايت'
        ? this.createStarlightHunterVariant(scene, base)
        : this.createRoninVariant(scene, base);
    const src = scene.textures.get(classKey).getSourceImage();
    const c = scene.textures.createCanvas(key, src.width, src.height);
    const x = c.context; x.imageSmoothingEnabled = false;
    x.drawImage(src, 0, 0);
    x.fillStyle = 'rgba(10,7,16,0.45)'; x.fillRect(0, 0, src.width, src.height);
    x.fillStyle = '#5a1224'; x.fillRect(19, 9, 4, 3); // عين مظلمة متوهجة
    x.fillStyle = '#2c0f18'; x.fillRect(8, 30, 16, 2); // مظهر مكسور
    c.refresh();
    return key;
  }
}
