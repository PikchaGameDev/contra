import Entity from "../Entity.js";
import HeroWeaponUnit from "./HeroWeaponUnit.js";

const States = {
  stay: "stay",
  jump: "jump",
  flyDown: "flyDown",
};

export default class Hero extends Entity {
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

  state;

  isLay;
  isUp;

  #prevPoint = { x: 0, y: 0 };

  heroWeaponUnit;

  type = "hero";

  constructor(view) {
    super(view);

    this.heroWeaponUnit = new HeroWeaponUnit(this._view);

    this.state = States.jump;
    this._view.showStay();
  }

  update() {
    this.#prevPoint.x = this.x;
    this.#prevPoint.y = this.y;

    this.velocityX = this.movement.x * this.SPEED;
    this.x += this.velocityX;

    if (this.velocityY > 0) {
      if (!(this.state === States.jump || this.state === States.flyDown)) {
        this._view.showFall();
      }

      this.state = States.flyDown;
    }

    this.velocityY += this.GRAVITY_FORCE;
    this.y += this.velocityY;
  }

  stay(platformY) {
    if (this.state === States.jump || this.state === States.flyDown) {
      const fakeButtonContext = {};

      fakeButtonContext.arrowLeft = this.movement.x === -1;
      fakeButtonContext.arrowRight = this.movement.x === 1;
      fakeButtonContext.arrowDown = this.isLay;
      fakeButtonContext.arrowUp = this.isUp;
      this.state = States.stay;

      this.setView(fakeButtonContext);
    }

    this.state = States.stay;
    this.velocityY = 0;

    this.y = platformY - this._view.collisionBox.height;
  }

  jump() {
    if (this.state === States.jump || this.state === States.flyDown) return;

    this.state = States.jump;
    this.velocityY -= this.JUMP_FORCE;

    this._view.showJump();
  }

  throwDown() {
    this.state = States.jump;

    this._view.showFall();
  }

  isJumpState() {
    return this.state === States.jump;
  }

  startLeftMove() {
    this.directionContext.left = -1;

    if (this.directionContext.right > 0) {
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

  setView(buttonContext) {
    this._view.flip(this.movement.x);
    this.isLay = buttonContext.arrowDown;
    this.isUp = buttonContext.arrowUp;

    this.heroWeaponUnit.setBulletAngle(buttonContext, this.isJumpState());

    if (this.isJumpState() || this.state === States.flyDown) {
      return;
    }

    if (buttonContext.arrowLeft || buttonContext.arrowRight) {
      if (buttonContext.arrowUp) {
        this._view.showRunUp();
      } else if (buttonContext.arrowDown) {
        this._view.showRunDown();
      } else {
        this._view.showRun();
      }
    } else {
      if (buttonContext.arrowUp) {
        this._view.showStayUp();
      } else if (buttonContext.arrowDown) {
        this._view.showLay();
      } else {
        this._view.showStay();
      }
    }
  }

  get prevPoint() {
    return this.#prevPoint;
  }

  get bulletContext() {
    return this.heroWeaponUnit.bulletContext;
  }
}
