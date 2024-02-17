import Hero from "./Entities/Hero.js";
import KeyboardProcessor from "./Entities/KeyboardProcessor.js";
import PlatformFactory from "./Entities/Platforms/PlatformFactory.js";

const LEFT = 37;
const RIGHT = 39;
const UP = 38;
const DOWN = 40;

const A = 65;
const S = 83;

export default class Game {
  pixiApp = null;

  hero = null;
  platforms = [];

  keyboardProcessor = new KeyboardProcessor(this);

  constructor(pixiApp) {
    this.pixiApp = pixiApp;

    this.hero = this.createHero(100, 100);
    this.pixiApp.stage.addChild(this.hero);

    const platformFactory = new PlatformFactory(pixiApp);

    this.platforms = [
      platformFactory.createPlatform(100, 400),
      platformFactory.createPlatform(300, 450),
      platformFactory.createPlatform(500, 400),
      platformFactory.createPlatform(700, 400),
      platformFactory.createPlatform(900, 450),
      platformFactory.createPlatform(300, 550),
      platformFactory.createPlatform(0, 738),
      platformFactory.createPlatform(200, 738),
      platformFactory.createPlatform(400, 708),
    ];

    this.setKeys();

    this.render();
  }

  setKeys() {
    this.keyboardProcessor.getButton("KeyS").executeDown = () => {
      this.hero.jump();
    };

    this.keyboardProcessor.getButton("ArrowLeft").executeDown = () => {
      this.hero.startLeftMove();
    };

    this.keyboardProcessor.getButton("ArrowRight").executeDown = () => {
      this.hero.startRightMove();
    };

    this.keyboardProcessor.getButton("ArrowLeft").executeUp = () => {
      this.hero.stopLeftMove();
    };

    this.keyboardProcessor.getButton("ArrowRight").executeUp = () => {
      this.hero.stopRightMove();
    };
  }

  createHero(x, y) {
    const hero = new Hero();

    hero.x = x;
    hero.y = y;

    return hero;
  }

  isCheckIntersection(entity, area) {
    return (
      entity.x < area.x + area.width &&
      entity.x + entity.width > area.x &&
      entity.y < area.y + area.height &&
      entity.y + entity.height > area.y
    );
  }

  getPlatformCollisionResult(character, platform, prevPoint) {
    const collisionResult = {
      horizontal: false,
      vertical: false,
    };

    if (!this.isCheckIntersection(character, platform)) {
      return collisionResult;
    }

    const currY = character.y;
    character.y = prevPoint.y;

    if (!this.isCheckIntersection(character, platform)) {
      collisionResult.vertical = true;
      return collisionResult;
    }

    character.y = currY;
    character.x = prevPoint.x;

    collisionResult.horizontal = true;
    return collisionResult;
  }

  update() {
    const prevPoint = { x: this.hero.x, y: this.hero.y };

    this.hero.update();

    this.platforms.forEach((platform) => {
      const collisionResult = this.getPlatformCollisionResult(
        this.hero,
        platform,
        prevPoint
      );

      if (collisionResult.vertical) {
        this.hero.stay();
      }
    });
  }

  render() {
    this.pixiApp.ticker.add(this.update, this);

    document.addEventListener(
      "keydown",
      this.keyboardProcessor.onKeyDown.bind(this.keyboardProcessor)
    );
    document.addEventListener(
      "keyup",
      this.keyboardProcessor.onKeyUp.bind(this.keyboardProcessor)
    );

    document.body.appendChild(this.pixiApp.view);
  }
}
