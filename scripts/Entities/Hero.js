import { Container, Graphics } from "../../pixi/pixi.mjs";

export default class Hero extends Container {
  GRAVITY_FORCE = 0.01;
  velocityX = 0;
  velocityY = 0;

  constructor() {
    super();

    const view = new Graphics();

    view.lineStyle(1, 0xff0000);
    view.drawRect(0, 0, 20, 60);

    this.addChild(view);
  }

  update() {
    this.velocityX += this.GRAVITY_FORCE;
    this.velocityY += this.GRAVITY_FORCE;

    this.y += this.velocityY;
    this.x += this.velocityX;
  }

  stay() {
    this.velocityY = 0;
    this.velocityX = 0;
  }
}
