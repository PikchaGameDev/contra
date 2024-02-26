export default class Physics {
  static getOrientCollisionResult(aaRect, bbRect, aaPrevPoint) {
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

  static isCheckIntersection(entity, area) {
    return (
      entity.x < area.x + area.width &&
      entity.x + entity.width > area.x &&
      entity.y < area.y + area.height &&
      entity.y + entity.height > area.y
    );
  }
}
