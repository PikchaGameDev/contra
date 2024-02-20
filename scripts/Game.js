import Hero from "./Entities/Hero/Hero.js";
import KeyboardProcessor from "./KeyboardProcessor.js";
import PlatformFactory from "./Entities/Platforms/PlatformFactory.js";
import Camera from "./Camera.js";
import { Container } from "../libs/pixi.mjs";

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

  camera;

  keyboardProcessor = new KeyboardProcessor(this);

  constructor(pixiApp) {
    this.pixiApp = pixiApp;

    const worldContainer = new Container({ width: 1024, height: 768 });
    this.pixiApp.stage.addChild(worldContainer);

    this.hero = this.createHero(worldContainer, 100, 100);

    const platformFactory = new PlatformFactory(worldContainer);

    const box = platformFactory.createBox(400, 708);
    box.isStep = true;

    this.platforms = [
      platformFactory.createPlatform(100, 400),
      platformFactory.createPlatform(300, 400),
      platformFactory.createPlatform(500, 400),
      platformFactory.createPlatform(700, 400),
      platformFactory.createPlatform(1100, 400),
      platformFactory.createPlatform(300, 550),
      platformFactory.createBox(0, 738),
      platformFactory.createBox(200, 738),
      box,
    ];

    this.setKeys();

    console.log(worldContainer.width);

    const cameraSettings = {
      target: this.hero,
      world: worldContainer,
      screenSize: this.pixiApp.screen,
      maxWorldWidth: worldContainer.width,
      isBackScrollX: true,
    };

    this.render();

    this.camera = new Camera(cameraSettings);
  }

  setKeys() {
    this.keyboardProcessor.getButton("KeyS").executeDown = () => {
      if (
        this.keyboardProcessor.isButtonPressed("ArrowDown") &&
        (!this.keyboardProcessor.isButtonPressed("ArrowLeft") ||
          !this.keyboardProcessor.isButtonPressed("ArrowRight"))
      ) {
        this.hero.throwDown();
      } else {
        this.hero.jump();
      }
    };

    const arrowLeft = this.keyboardProcessor.getButton("ArrowLeft");
    const arrowRight = this.keyboardProcessor.getButton("ArrowRight");
    const arrowUp = this.keyboardProcessor.getButton("ArrowUp");
    const arrowDown = this.keyboardProcessor.getButton("ArrowDown");

    arrowLeft.executeDown = () => {
      this.hero.startLeftMove();
      this.hero.setView(this.getArrowButtonContext());
    };

    arrowLeft.executeUp = () => {
      this.hero.stopLeftMove();
      this.hero.setView(this.getArrowButtonContext());
    };

    arrowRight.executeDown = () => {
      this.hero.startRightMove();
      this.hero.setView(this.getArrowButtonContext());
    };

    arrowRight.executeUp = () => {
      this.hero.stopRightMove();
      this.hero.setView(this.getArrowButtonContext());
    };

    arrowUp.executeDown = () => {
      this.hero.setView(this.getArrowButtonContext());
    };

    arrowUp.executeUp = () => {
      this.hero.setView(this.getArrowButtonContext());
    };

    arrowDown.executeDown = () => {
      this.hero.setView(this.getArrowButtonContext());
    };

    arrowDown.executeUp = () => {
      this.hero.setView(this.getArrowButtonContext());
    };
  }

  getArrowButtonContext() {
    const buttonContext = {};

    buttonContext.arrowLeft =
      this.keyboardProcessor.isButtonPressed("ArrowLeft");
    buttonContext.arrowRight =
      this.keyboardProcessor.isButtonPressed("ArrowRight");
    buttonContext.arrowUp = this.keyboardProcessor.isButtonPressed("ArrowUp");
    buttonContext.arrowDown =
      this.keyboardProcessor.isButtonPressed("ArrowDown");

    return buttonContext;
  }

  createHero(stage, x, y) {
    const hero = new Hero(stage);

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
    const collisionResult = this.getOrientCollisionResult(
      character.collisionBox,
      platform,
      prevPoint
    );

    if (collisionResult.vertical) {
      character.y = prevPoint.y;
    }

    if (collisionResult.horizontal && platform.type === "box") {
      if (platform.isStep) {
        this.hero.stay(platform.y);
      }

      character.x = prevPoint.x;
    }

    return collisionResult;
  }

  getOrientCollisionResult(aaRect, bbRect, aaPrevPoint) {
    const collisionResult = {
      horizontal: false,
      vertical: false,
    };

    if (!this.isCheckIntersection(aaRect, bbRect)) {
      return collisionResult;
    }

    aaRect.y = aaPrevPoint.y;

    if (!this.isCheckIntersection(aaRect, bbRect)) {
      collisionResult.vertical = true;
      return collisionResult;
    }

    collisionResult.horizontal = true;
    return collisionResult;
  }

  update() {
    const prevPoint = { x: this.hero.x, y: this.hero.y };

    this.hero.update();

    this.platforms.forEach((platform) => {
      if (this.hero.isJumpState() && platform.type !== "box") {
        return;
      }

      const collisionResult = this.getPlatformCollisionResult(
        this.hero,
        platform,
        prevPoint
      );

      if (collisionResult.vertical) {
        this.hero.stay(platform.y);
      }
    });

    this.camera.update();
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
