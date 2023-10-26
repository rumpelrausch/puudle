const entryModel = require('../model/entryModel');
const watcherModel = require('../model/watcherModel');
const { notify } = require('./notifier');
const entry = new entryModel();
const watcher = new watcherModel();

const CHANGE_WATCHER_INTERVAL_SECONDS = parseInt(process.env.CHANGE_WATCHER_INTERVAL_SECONDS || '60');
const NOTIFY_AFTER_CHANGE_SECONDS = parseInt(process.env.NOTIFY_AFTER_CHANGE_SECONDS || '60');
const NOTIFY_AFTER_CHANGE_COUNT = parseInt(process.env.NOTIFY_AFTER_CHANGE_COUNT || '10');

let lastChange = 0;
let changeCount = 0;

function applyChange(entry) {
  lastChange = new Date().getTime();
  changeCount++;
  const entryDetails = `"${entry.entryName}" ${entry.date}`;
  console.log(`CHANGE detected: ${entryDetails}`);
}

function shallNotify() {
  if (lastChange > 0) {
    if (
      changeCount >= NOTIFY_AFTER_CHANGE_COUNT
      || (new Date().getTime() - lastChange) > NOTIFY_AFTER_CHANGE_SECONDS * 1000
    ) {
      lastChange = 0;
      changeCount = 0;
      return true;
    }
  }
  return false;
}

async function watch() {
  if (shallNotify()) {
    try {
      notify();
    } catch (error) {
      console.error(error);
    }
  }
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
