import { Container, Graphics } from "../../../libs/pixi.mjs";

export default class Bullet extends Container {
  SPEED = 10;

  angle;
  isDead;

  constructor(angle) {
    super();

    this.angle = (angle * Math.PI) / 180;

    const view = new Graphics();

    view.lineStyle(1, 0xffff00);
    view.drawRect(0, 0, 5, 5);

    this.addChild(view);
  }

  update() {
    this.x += this.SPEED * Math.cos(this.angle);
    this.y += this.SPEED * Math.sin(this.angle);
  }
}
