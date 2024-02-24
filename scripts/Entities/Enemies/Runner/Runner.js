import RunnerView from "./RunnerView.js";

const States = {
  stay: "stay",
  jump: "jump",
  flyDown: "flyDown",
};

export default class Runner {
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

  view;

  #prevPoint = { x: 0, y: 0 };

  constructor(stage) {
    this.view = new RunnerView();
    stage.addChild(this.view);

    this.state = States.jump;
    this.view.showJump();

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
          this.view.showFall();
        } else {
          this.view.showJump();
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

    this.y = platformY - this.view.collisionBox.height;
  }

  jump() {
    if (this.isJumpState() || this.state === States.flyDown) return;

    this.state = States.jump;
    this.velocityY -= this.JUMP_FORCE;

    this.view.showJump();
  }

  isJumpState() {
    return this.state === States.jump;
  }

  setView(buttonContext) {
    this.view.flip(this.movement.x);

    if (this.isJumpState() || this.state === States.flyDown) {
      return;
    }

    if (buttonContext.arrowLeft || buttonContext.arrowRight) {
      this.view.showRun();
    }
  }

  removeFromParent() {
    if (this.view.parent !== null) {
      this.view.removeFromParent();
    }
  }

  get x() {
    return this.view.x;
  }

  set x(x) {
    this.view.x = x;
  }

  get y() {
    return this.view.y;
  }

  set y(y) {
    this.view.y = y;
  }

  get prevPoint() {
    return this.#prevPoint;
  }

  get collisionBox() {
    return this.view.getCollisionBox();
  }
}
