const db = require('../services/db.js');

class Event {
    #type = 'event';
    #document;

    async get(_id) {
        const query = { type: this.#type, _id };
        const document = await db.findOneAsync(query);
        this.#document = document;
        return !!document;
    }

    async add(eventName, date) {
        if (!eventName) {
            throw new Error('event name is missing');
        }
        if (!date) {
            throw new Error('event date is missing');
        }

        if(await this.exists(eventName, date)) {
            throw new Error('event already exists');
        }

        this.#document = await db.insertAsync({
            type: this.#type,
            eventName,
            subscriptions: [],
            date
        });
    }

    async exists(eventName, date) {
        const query = { type: this.#type, eventName, date };
        return !!await db.findOneAsync(query);
    }

    async list() {
        const query = { type: this.#type };
        return db.findAsync(query);
    }

    get document() { return this.#document; }
}

module.exports = Event;
