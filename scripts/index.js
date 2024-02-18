import Game from "./Game.js";
import * as PIXI from "../libs/pixi.mjs";

const app = new PIXI.Application({
  width: 1024,
  height: 768,
  background: "#1099bb",
});

new Game(app);
