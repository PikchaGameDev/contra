import { Container, Graphics } from "../../pixi/pixi.mjs";

const States = {
  stay: "stay",
  jump: "jump",
  flyDown: "flydown",
};

export default class Hero extends Container {
  GRAVITY_FORCE = 0.2;
  SPEED = 3;
  JUMP_FORCE = 9;

  velocityX = 0;
  velocityY = 0;

  movement = {
    x: 0,
    y: 0,
  };

  directionContext = {
    left: 0,
    right: 0,
  };

  state = States.stay;

  constructor() {
    super();

    const view = new Graphics();

    view.lineStyle(1, 0xffff00);
    view.drawRect(0, 0, 20, 90);

    this.addChild(view);
  }

  update() {
    this.velocityX = this.movement.x * this.SPEED;
    this.x += this.velocityX;

    if (this.velocityY > 0 && this.isJumpState()) {
      this.state = States.flyDown;
    }

    this.velocityY += this.GRAVITY_FORCE;
    this.y += this.velocityY;
  }

  stay(platformY) {
    this.state = States.stay;
    this.velocityY = 0;

    this.y = platformY - this.height;
  }

  jump() {
    if (this.state === States.jump || this.state === States.flyDown) return;

    this.state = States.jump;
    this.velocityY -= this.JUMP_FORCE;
  }

  throwDown() {
    console.log("jump");
    this.state = States.jump;
  }

  isJumpState() {
    return this.state === States.jump;
  }

  startLeftMove() {
    this.directionContext.left = -1;

    if (this.directionContext.right) {
      this.movement.x = 0;

      return;
    }

    this.movement.x = -1;
  }

  startRightMove() {
    this.directionContext.right = 1;
    this.movement.x = 1;
  }

  stopLeftMove() {
    this.directionContext.left = 0;
    this.movement.x = this.directionContext.right;
  }

  stopRightMove() {
    this.directionContext.right = 0;
    this.movement.x = this.directionContext.left;
  }

  rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  getRect() {
    this.rect.x = this.x;
    this.rect.y = this.y;
    this.rect.width = this.width;
    this.rect.height = this.height;

    return this.rect;
  }
}
