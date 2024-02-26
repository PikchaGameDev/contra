import Entity from "../../Entity.js";

const States = {
  stay: "stay",
  jump: "jump",
  flyDown: "flyDown",
};

export default class Runner extends Entity {
  GRAVITY_FORCE = 0.2;
  SPEED = 3;
  JUMP_FORCE = 9;

  velocityX = 0;
  velocityY = 0;

  movement = {
    x: 0,
    y: 0,
  };

  state;

  #prevPoint = { x: 0, y: 0 };

  type = "characterEnemy";

  constructor(view) {
    super(view);

    this.state = States.jump;
    this._view.showJump();

    this.movement.x = -1;
  }

  update() {
    this.#prevPoint.x = this.x;
    this.#prevPoint.y = this.y;

    this.velocityX = this.movement.x * this.SPEED;
    this.x += this.velocityX;

    if (this.velocityY > 0) {
      if (!(this.isJumpState() || this.state === States.flyDown)) {
        if (Math.random() > 0.4) {
          this._view.showFall();
        } else {
          this._view.showJump();
          this.jump();
        }
      }

      if (this.velocityY > 0) {
        this.state = States.flyDown;
      }
    }

    this.velocityY += this.GRAVITY_FORCE;
    this.y += this.velocityY;
  }

  stay(platformY) {
    if (this.isJumpState() || this.state === States.flyDown) {
      const fakeButtonContext = {
        arrowLeft: this.movement.x === -1,
        arrowRight: this.movement.x === 1,
      };

      this.state = States.stay;

      this.setView(fakeButtonContext);
    }

    this.state = States.stay;
    this.velocityY = 0;

    this.y = platformY - this._view.collisionBox.height;
  }

  jump() {
    if (this.isJumpState() || this.state === States.flyDown) return;

    this.state = States.jump;
    this.velocityY -= this.JUMP_FORCE;

    this._view.showJump();
  }

  isJumpState() {
    return this.state === States.jump;
  }

  setView(buttonContext) {
    this._view.flip(this.movement.x);

    if (this.isJumpState() || this.state === States.flyDown) {
      return;
    }

    if (buttonContext.arrowLeft || buttonContext.arrowRight) {
      this._view.showRun();
    }
  }

  removeFromParent() {
    if (this._view.parent !== null) {
      this._view.removeFromParent();
    }
  }

  get prevPoint() {
    return this.#prevPoint;
  }
}
