import Hero from "./Entities/Hero.js";
import Platform from "./Entities/Platform.js";

export default class Game {
  pixiApp = null;

  hero = null;
  platforms = [];

  constructor(pixiApp) {
    this.pixiApp = pixiApp;

    this.hero = this.createHero(100, 100);
    this.pixiApp.stage.addChild(this.hero);

    this.platforms = [
      this.createPlatform(50, 400),
      this.createPlatform(200, 450),
      this.createPlatform(400, 400),
    ];

    this.pixiApp.stage.addChild(this.platforms[0]);
    this.pixiApp.stage.addChild(this.platforms[1]);
    this.pixiApp.stage.addChild(this.platforms[2]);

    this.render();
  }

  createPlatform(x, y) {
    const platform = new Platform();

    platform.x = x;
    platform.y = y;

    return platform;
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

  update() {
    const prevPoint = { x: this.hero.x, y: this.hero.y };

    this.hero.update();

    this.platforms.forEach((platform) => {
      if (!this.isCheckIntersection(this.hero, platform)) {
        return;
      }

      const currY = this.hero.y;
      this.hero.y = prevPoint.y;

      if (!this.isCheckIntersection(this.hero, platform)) {
        this.hero.stay();
        return;
      }

      this.hero.y = currY;
      this.hero.x = prevPoint.x;
    });
  }

  render() {
    this.pixiApp.ticker.add(this.update, this);

    document.body.appendChild(this.pixiApp.view);
  }
}
