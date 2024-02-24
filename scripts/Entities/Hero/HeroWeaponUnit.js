export default class HeroWeaponUnit {
  bulletAngle;

  #bulletContext = {
    x: 0,
    y: 0,
    angle: 0,
  };

  heroView;

  constructor(view) {
    this.heroView = view;
  }

  setBulletAngle(buttonContext, isJump) {
    if (buttonContext.arrowLeft || buttonContext.arrowRight) {
      if (buttonContext.arrowUp) {
        this.bulletAngle = -45;
      } else if (buttonContext.arrowDown) {
        this.bulletAngle = 45;
      } else {
        this.bulletAngle = 0;
      }
    } else {
      if (buttonContext.arrowUp) {
        this.bulletAngle = -90;
      } else if (buttonContext.arrowDown && isJump) {
        this.bulletAngle = 90;
      } else {
        this.bulletAngle = 0;
      }
    }
  }

  get bulletContext() {
    this.#bulletContext.x = this.heroView.x + this.heroView.bulletPointShift.x;
    this.#bulletContext.y = this.heroView.y + this.heroView.bulletPointShift.y;
    this.#bulletContext.angle = this.heroView.isFlipped
      ? this.bulletAngle * -1 + 180
      : this.bulletAngle;
    return this.#bulletContext;
  }
}
