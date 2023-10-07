const entryModel = require('../model/entryModel');

const getEntryList = async () => {
    const entry = new entryModel();
    return await entry.list();
};

const addEntry = async (entryData) => {
    const entry = new entryModel();
    await entry.add(entryData);
    return entry.document;
};

const updateEntry = async (entryData) => {
    const entry = new entryModel();
    const updatedEntry = await entry.update(entryData);
    return { 
        updatedEntry
     };
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
