import Runner from "./Runner.js";
import RunnerView from "./RunnerView.js";

export default class RunnerFactory {
  worldContainer;

  constructor(worldContainer) {
    this.worldContainer = worldContainer;
  }

  create(x, y) {
    const runnerView = new RunnerView();
    this.worldContainer.addChild(runnerView);

    const runner = new Runner(runnerView);

    runner.x = x;
    runner.y = y;

    return runner;
  }
}
