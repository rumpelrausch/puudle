const entryModel = require('../model/entryModel');

const getEntryList = async () => {
    const entry = new entryModel();
    return await entry.list();
};

const addEntry = async (body) => {
    const entry = new entryModel();
    await entry.add(body);
    return entry.document;
};

const updateEntry = async (body) => {
    const entry = new entryModel();
    const numUpdated = await entry.update(body);
    return { numUpdated };
};

const getEntry = async (entryId) => {
    const entry = new entryModel();
    return await entry.get(entryId);
};

const deleteEntry = async (entryId) => {
    const entry = new entryModel();
    const numRemoved = await entry.delete(entryId);
    return { numRemoved };
};

module.exports = {
    getEntryList,
    addEntry,
    getEntry,
    deleteEntry,
    updateEntry
};
