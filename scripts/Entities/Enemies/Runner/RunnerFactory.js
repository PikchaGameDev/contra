import Runner from "./Runner.js";

export default class RunnerFactory {
  worldContainer;

  constructor(worldContainer) {
    this.worldContainer = worldContainer;
  }

  create(x, y) {
    const runner = new Runner(this.worldContainer);

    runner.x = x;
    runner.y = y;

    return runner;
  }
}
