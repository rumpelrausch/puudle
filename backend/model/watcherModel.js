const db = require('../services/db.js');

class WatcherModel {
  #type = 'watcher';

  async getStamp() {
    const result = await db.findOneAsync({
      _id: this.#type,
      type: this.#type
    });
    return result && result.stamp ? result.stamp : null;
  }

  async setStamp(stamp) {
    const result = await db.updateAsync({
      type: this.#type,
    }, {
      $set: {
        stamp
      }
    });
    if (!result) {
      await db.insertAsync({
        _id: this.#type,
        type: this.#type,
        stamp
      });
    }
    db.sync();
  }
}

module.exports = WatcherModel;
