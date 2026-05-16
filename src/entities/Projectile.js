export class Projectile extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, dir) {
    super(scene, x, y, 14, 3, 0xd9e6ff, 1);
    scene.add.existing(this);
    this.direction = dir;
    this.speed = 420;
    this.life = 1100;
    this.setStrokeStyle(1, 0x7a8cae, 1);
  }

  update(delta) {
    const dt = delta / 1000;
    this.x += this.direction * this.speed * dt;
    this.life -= delta;
    if (this.life <= 0 || this.x < -30 || this.x > this.scene.scale.width + 30) {
      this.destroy();
    }
  }
}
