export default class KeyboardProcessor {
  keyMap = {
    KeyS: {
      isDown: false,
    },

    KeyA: { isDown: false },
    ArrowLeft: { isDown: false },
    ArrowRight: { isDown: false },
    ArrowDown: { isDown: false },
    ArrowUp: { isDown: false },
  };

  gameContext;

  constructor(gameContext) {
    this.gameContext = gameContext;
  }

  getButton(keyName) {
    return this.keyMap[keyName];
  }

  onKeyDown(key) {
    const button = this.keyMap[key.code];

    if (button) {
      button.isDown = true;

      button.executeDown?.call(this.gameContext);
    }
  }

  onKeyUp(key) {
    const button = this.keyMap[key.code];

    if (button) {
      button.isDown = false;

      button && button.executeUp?.call(this.gameContext);
    }
  }

  isButtonPressed(keyName) {
    return this.keyMap[keyName]?.isDown;
  }
}
