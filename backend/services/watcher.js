const entryModel = require('../model/entryModel');
const watcherModel = require('../model/watcherModel');
const entry = new entryModel();
const watcher = new watcherModel();

const CHANGE_WATCHER_INTERVAL_SECONDS = parseInt(process.env.CHANGE_WATCHER_INTERVAL_SECONDS || '60');

function applyChange(entry) {
  const entryDetails = `"${entry.entryName}" ${entry.date}`;
  console.log(`CHANGE detected: ${entryDetails}`);
}

async function watch() {
  let lastStamp = await watcher.getStamp();
  const latestUpdatedEntry = await entry.getLatestUpdated();
  if (!latestUpdatedEntry) {
    return;
  }
  if (!lastStamp) {
    watcher.setStamp(latestUpdatedEntry.updatedAt);
    return;
  }
  if (latestUpdatedEntry.updatedAt.toString() !== lastStamp.toString()) {
    applyChange(latestUpdatedEntry);
    watcher.setStamp(latestUpdatedEntry.updatedAt);
  }
}

function start() {
  setInterval(watch, CHANGE_WATCHER_INTERVAL_SECONDS * 1000);
}

module.exports = {
  watch,
  start
};
