const eventModel = require('../model/eventModel');

const getEventList = async () => {
    const event = new eventModel();
    return await event.list();
};

const addEvent = async (body) => {
    const event = new eventModel();
    await event.add(body);
    return event.document;
};

const updateEvent = async (body) => {
    const event = new eventModel();
    const numUpdated = await event.update(body);
    return { numUpdated };
};

const getEvent = async (eventId) => {
    const event = new eventModel();
    return await event.get(eventId);
};

const deleteEvent = async (eventId) => {
    const event = new eventModel();
    const numRemoved = await event.delete(eventId);
    return { numRemoved };
};

module.exports = {
    getEventList,
    addEvent,
    getEvent,
    deleteEvent,
    updateEvent
};
