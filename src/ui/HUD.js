export class HUD {
  constructor(scene) {
    this.scene = scene;
    this.root = scene.add.container(0, 0).setDepth(260);

    const w = scene.scale.width;
    this.topBar = scene.add.rectangle(w / 2, 38, w - 24, 62, 0x121a30, 0.9).setStrokeStyle(2, 0x4f6397, 1);
    this.root.add(this.topBar);

    this.healthBg = scene.add.rectangle(w - 180, 56, 180, 14, 0x2a2f45, 1).setOrigin(1, 0.5);
    this.healthFill = scene.add.rectangle(w - 180, 56, 180, 14, 0xa63f3f, 1).setOrigin(1, 0.5);
    this.root.add([this.healthBg, this.healthFill]);

    this.labels = {};
    const items = [
      ['الجولة', w - 36], ['الصحة', w - 230], ['السهام', w - 360], ['الوقت', w - 470],
      ['القتلى', w - 570], ['السقوط', w - 670], ['الكلاس', w - 780], ['النمط', w - 900],
    ];
    items.forEach(([key, x]) => {
      const t = scene.add.text(x, 25, `${key}: --`, { fontFamily: 'Tahoma', fontSize: '18px', color: '#eaf1ff' }).setOrigin(1, 0);
      this.root.add(t);
      this.labels[key] = t;
    });
  }

  update(data) {
    this.labels.الجولة.setText(`الجولة: ${data.الجولة}`);
    this.labels.الصحة.setText(`الصحة: ${data.الصحة}/${data.الصحة_القصوى}`);
    this.labels.السهام.setText(`السهام: ${data.السهام}`);
    this.labels.الوقت.setText(`الوقت: ${data.الوقت}`);
    this.labels.القتلى.setText(`القتلى: ${data.القتلى}`);
    this.labels.السقوط.setText(`السقوط: ${data.السقوط}`);
    this.labels.الكلاس.setText(`الكلاس: ${data.الكلاس}`);
    this.labels.النمط.setText(`النمط: ${data.النمط}`);
    const ratio = Phaser.Math.Clamp(data.الصحة / Math.max(1, data.الصحة_القصوى), 0, 1);
    this.healthFill.width = 180 * ratio;
  }
}
