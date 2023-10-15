const db = require('../services/db.js');
const BackendError = require('../util/backendError');

const MIN_ENTRYNAME_LENGTH = 3;

class EntryModel {
    #type = 'entry';
    #document;
    #allowedUpdateFields = [
        'entryName',
        'date',
        'subscriptions'
    ];

    validate(fieldName, fieldValue) {
        if (fieldName === 'entryName') {
            if (typeof fieldValue !== 'string') {
                throw new BackendError(`${fieldName} must be a string`, 400);
            }
            if (fieldValue.trim().length < MIN_ENTRYNAME_LENGTH) {
                throw new BackendError(`entryName must contain at least ${MIN_ENTRYNAME_LENGTH} characters`, 400);
            }
            return;
        }

        if (fieldName === 'date') {
            if (typeof fieldValue !== 'string') {
                throw new BackendError(`${fieldName} must be a string`, 400);
            }
            if (!fieldValue.match(/([0-9]{4})-(?:[0-9]{2})-([0-9]{2}) (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/)) {
                throw new BackendError('date must be "YYYY-MM-DD hh:mm"', 400);
            }
            return;
        }
    }

    async validateNewEntry(entryData) {
        let entryName = entryData.entryName;
        let date = entryData.date;

        this.validate('entryName', entryName);
        this.validate('date', date);

        if (await this.exists(entryName, date)) {
            throw new BackendError('entry already exists', 409);
        }
    };

    async get(_id) {
        const query = { type: this.#type, _id };
        const document = await db.findOneAsync(query);
        this.#document = document;
        if (!document) {
            throw new BackendError('entry does not exist', 404);
        }
        return document;
    }

    async add(entryData) {
        await this.validateNewEntry(entryData);
        const entryName = entryData.entryName;
        const date = entryData.date;

        this.#document = await db.insertAsync({
            type: this.#type,
            entryName,
            subscriptions: [],
            date
        });
        db.sync();
    }

    async update(entryData, allowSubscriptionUpdate = false) {
        const existingDoc = await this.get(entryData._id);
        const newDoc = {};

        for (const fieldName of this.#allowedUpdateFields) {
            if (!allowSubscriptionUpdate && fieldName === 'subscriptions') {
                continue;
            }
            if (typeof entryData[fieldName] !== 'undefined') {
                this.validate(fieldName, entryData[fieldName]);
                newDoc[fieldName] = entryData[fieldName];
            }
        }
        const numUpdated = await db.updateAsync({
            type: this.#type,
            _id: entryData._id
        }, {
            ...existingDoc,
            ...newDoc
        });
        db.sync();
        if (numUpdated < 1) {
            throw new BackendError('entry was not updated', 400);
        }
        return await this.get(entryData._id);
    }

    async delete(_id) {
        const numRemoved = await db.removeAsync({ _id });
        db.sync();
        if (numRemoved < 1) {
            throw new BackendError('entry does not exist', 404);
        }
        return numRemoved;
    }

    async exists(entryName, date) {
        const query = { type: this.#type, entryName, date };
        return !!await db.findOneAsync(query);
    }

    async idExists(entryId) {
        const query = { type: this.#type, _id: entryId };
        return !!await db.findOneAsync(query);
    }

    async list(withPastEntries = false) {
        db.sync();
        let query = { type: this.#type };
        if(!withPastEntries) {
            const now = new Date();
            query.date = { $gte: now.toISOString().split('T')[0] };
        }
        return db.findAsync(query);
    }

    get document() { return this.#document; }
}

module.exports = EntryModel;
