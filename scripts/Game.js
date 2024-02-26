import Hero from "./Entities/Hero/Hero.js";
import KeyboardProcessor from "./KeyboardProcessor.js";
import PlatformFactory from "./Entities/Platforms/PlatformFactory.js";
import Camera from "./Camera.js";
import { Container } from "../libs/pixi.mjs";
import BulletFactory from "./Entities/Bullets/BulletFactory.js";
import RunnerFactory from "./Entities/Enemies/Runner/RunnerFactory.js";
import HeroFactory from "./Entities/Hero/HeroFactory.js";
import Physics from "./Physics.js";

const LEFT = 37;
const RIGHT = 39;
const UP = 38;
const DOWN = 40;

const A = 65;
const S = 83;

export default class Game {
  pixiApp = null;

  hero = null;

  camera;

  runnerFactory;
  bulletFactory;
  heroFactory;

  platforms = [];

  entities = [];

  worldContainer;

  keyboardProcessor = new KeyboardProcessor(this);

  constructor(pixiApp) {
    this.pixiApp = pixiApp;

    this.worldContainer = new Container();
    this.pixiApp.stage.addChild(this.worldContainer);

    this.heroFactory = new HeroFactory(this.worldContainer);

    this.hero = this.heroFactory.create(100, 100);

    this.entities = [this.hero];

    const platformFactory = new PlatformFactory(this.worldContainer);

    const box = platformFactory.createBox(400, 708);
    box.isStep = true;

    this.platforms = [
      platformFactory.createPlatform(100, 400),
      platformFactory.createPlatform(500, 400),
      platformFactory.createPlatform(700, 400),
      platformFactory.createPlatform(1100, 400),
      platformFactory.createPlatform(300, 550),
      platformFactory.createBox(0, 738),
      platformFactory.createBox(200, 738),
      box,
    ];

    this.setKeys();

    const cameraSettings = {
      target: this.hero,
      world: this.worldContainer,
      screenSize: this.pixiApp.screen,
      maxWorldWidth: this.worldContainer.width,
      isBackScrollX: true,
    };

    this.render();

    this.camera = new Camera(cameraSettings);
    this.bulletFactory = new BulletFactory(this.worldContainer, this.entities);
    this.runnerFactory = new RunnerFactory(this.worldContainer);
    this.entities.push(this.runnerFactory.create(800, 150));
  }

  update() {
    this.entities.forEach((entity, i) => {
      entity.update();

      if (entity.type === "hero" || entity.type === "characterEnemy") {
        this.checkDamage(entity);
        this.checkPlatforms(entity);
      }

      this.checkEntityStatus(entity, i);
    });

    this.camera.update();
  }

  checkDamage(entity) {
    const damagers = this.entities.filter(
      (damager) =>
        (entity.type === "characterEnemy" && damager.type === "heroBullet") ||
        (entity.type === "hero" &&
          (damager.type === "enemyBullet" || damager.type === "characterEnemy"))
    );

    for (let damager of damagers) {
      if (
        Physics.isCheckIntersection(damager.collisionBox, entity.collisionBox)
      ) {
        entity.dead();

        if (damager.type !== "characterEnemy") {
          damager.dead();
        }

        break;
      }
    }
  }

  checkPlatforms(character) {
    if (character.isDead) {
      return;
    }

    this.platforms.forEach((platform) => {
      if (character.isJumpState() && platform.type !== "box") {
        return;
      }

      this.checkPlatformCollision(character, platform);
    });
  }

  setKeys() {
    this.keyboardProcessor.getButton("KeyA").executeDown = () => {
      this.bulletFactory.createBullet(this.hero.bulletContext);
    };
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

  checkPlatformCollision(character, platform) {
    const prevPoint = character.prevPoint;
    const collisionResult = Physics.getOrientCollisionResult(
      character.collisionBox,
      platform,
      prevPoint
    );

    if (collisionResult.vertical) {
      character.y = prevPoint.y;
      character.stay(platform.y);
    }

    if (collisionResult.horizontal && platform.type === "box") {
      if (platform.isStep) {
        character.stay(platform.y);
      } else {
        character.x = prevPoint.x;
      }
    }
  }

  checkEntityStatus(entity, index) {
    if (entity.isDead || this.isScreenOut(entity)) {
      entity.removeFromStage();
      this.entities.splice(index, 1);
    }
  }

  isScreenOut(entity) {
    return (
      entity.x > this.pixiApp.screen.width - this.worldContainer.x ||
      entity.x < -this.worldContainer.x ||
      entity.y > this.pixiApp.screen.height ||
      entity.y < 0
    );
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
