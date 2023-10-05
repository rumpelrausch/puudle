const db = require('../services/db.js');
const BackendError = require('../util/backendError');

class EventModel {
    #type = 'event';
    #document;
    #allowedUpdateFields = [
        'eventName',
        'date'
    ];

    validate(fieldName, fieldValue) {
        if (fieldName === 'eventName') {
            if (typeof fieldValue !== 'string') {
                throw new BackendError(`${fieldName} must be a string`, 400);
            }
            if (fieldValue.trim().length < 3) {
                throw new BackendError('eventName must contain at least 3 characters', 400);
            }
            return;
        }

        if (fieldName === 'date') {
            if (typeof fieldValue !== 'string') {
                throw new BackendError(`${fieldName} must be a string`, 400);
            }
            if (!fieldValue.match(/([0-9]{4})-(?:[0-9]{2})-([0-9]{2}) (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/)) {
                throw new BackendError("that's not a valid date", 400);
            }
            return;
        }
    }

    async validateNewEvent(eventData) {
        let eventName = eventData.eventName;
        let date = eventData.date;

        eventName = eventName.trim();
        this.validate('eventName', eventName);
        this.validate('date', date);

        if (await this.exists(eventName, date)) {
            throw new BackendError('event already exists', 409);
        }
    };

    async get(_id) {
        const query = { type: this.#type, _id };
        const document = await db.findOneAsync(query);
        this.#document = document;
        if (!document) {
            throw new BackendError('event does not exist', 404);
        }
        return document;
    }

    async add(eventData) {
        await this.validateNewEvent(eventData);
        const eventName = eventData.eventName;
        const date = eventData.date;

        this.#document = await db.insertAsync({
            type: this.#type,
            eventName,
            subscriptions: [],
            date
        });
        db.sync();
    }

    async update(eventData) {
        const existingDoc = await this.get(eventData._id);
        const newDoc = {};

        for (const fieldName of this.#allowedUpdateFields) {
            if (typeof eventData[fieldName] !== 'undefined') {
                this.validate(fieldName, eventData[fieldName]);
                newDoc[fieldName] = eventData[fieldName];
            }
        }
        const numOfUpdated = await db.updateAsync({
            type: this.#type,
            _id: eventData._id
        }, {
            ...existingDoc,
            ...newDoc
        });
        db.sync();
        if (numOfUpdated < 1) {
            throw new BackendError('event was not updated', 400);
        }
        return numOfUpdated;
    }

    async delete(_id) {
        const numRemoved = await db.removeAsync({ _id });
        db.sync();
        if (numRemoved < 1) {
            throw new BackendError('event does not exist', 404);
        }
        return numRemoved;
    }

    async exists(eventName, date) {
        const query = { type: this.#type, eventName, date };
        return !!await db.findOneAsync(query);
    }

    async list() {
        db.sync();
        const query = { type: this.#type };
        return db.findAsync(query);
    }

    get document() { return this.#document; }
}

module.exports = EventModel;
