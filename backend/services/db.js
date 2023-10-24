const nedb = require('nedb-core');
const fs = require('fs');

const dbFileName = `${__dirname}/../dbdata/database.jsonl`;
const db = new nedb({
  filename: dbFileName,
  timestampData: true,
  autoload: true
});

if (!fs.existsSync(dbFileName)) {
  db.insert({});
}

const sync = () => {
  db.persistence.compactDatafile();
};

const persistDays = (days) => {
  db.ensureIndex({ fieldName: 'dateObject', expireAfterSeconds: days * 86400 }, err => { });
};

const findOneAsync = (query, projection = {}) => {
  return new Promise((resolve) => {
    db.findOne(query, projection, (err, doc) => {
      if (err) {
        throw new Error(err);
      }
      resolve(doc);
    });
  });
};

const findAsync = (query, projection = {}) => {
  return new Promise((resolve) => {
    db.find(query, projection, (err, doc) => {
      if (err) {
        throw new Error(err);
      }
      resolve(doc);
    });
  });
};

const updateAsync = (query, newData) => {
  return new Promise((resolve) => {
    db.update(query, newData, (err, doc) => {
      if (err) {
        throw new Error(err);
      }
      sync();
      resolve(doc);
    });
  });
};

const insertAsync = (doc) => {
  return new Promise((resolve) => {
    db.insert(doc, (err, doc) => {
      if (err) {
        throw new Error(err);
      }
      sync();
      resolve(doc);
    });
  });
};

const removeAsync = (query, options = {}) => {
  return new Promise((resolve) => {
    db.remove(query, options, (err, numRemoved) => {
      if (err) {
        throw new Error(err);
      }
      resolve(numRemoved);
    });
  });
};

module.exports = {
  ...db,
  ensureIndex: db.ensureIndex,
  persistDays,
  sync,
  findAsync,
  findOneAsync,
  updateAsync,
  insertAsync,
  removeAsync
};
