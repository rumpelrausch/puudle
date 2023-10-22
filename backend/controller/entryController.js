const entryModel = require('../model/entryModel');

const getEntryList = async (requestParams) => {
    const entry = new entryModel();
    return (
        await entry.list(requestParams.fromDate)
    ).map((myEntry) => {
        return {
            ...myEntry,
            secondsOld: Math.floor((new Date().getTime() - Date.parse(myEntry.createdAt)) / 1000)
        }
    });
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
    const myEntry = await entry.get(entryId);
    myEntry.secondsOld = Math.floor((new Date().getTime() - Date.parse(myEntry.createdAt)) / 1000);
    return myEntry;
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
