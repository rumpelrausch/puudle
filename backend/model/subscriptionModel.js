const db = require('../services/db.js');
const entryModel = require('../model/entryModel');
const BackendError = require('../util/backendError');

class subscriptionModel {
    #entry;

    #allowedStates = {
        suggested: 1,
        accepted: 2,
        rejected: 3,
        maybe: 4
    };

    #fieldList = {
        userName: { required: true },
        state: { required: true },
        comment: { required: false }
    };

    constructor() {
        this.#entry = new entryModel();
    }

    trimField(fieldName, fieldValue) {
        if (typeof fieldValue !== 'string') {
            throw new BackendError(`${fieldName} must be a string`, 400);
        }
        return fieldValue.trim();
    }

    validate(fieldName, fieldValue) {
        if (fieldName === 'userName') {
            const userName = this.trimField(fieldName, fieldValue);
            if (userName.length < 2) {
                throw new BackendError('userName must contain at least 2 characters', 400);
            }
            return userName;
        }

        if (fieldName === 'state') {
            const state = this.trimField(fieldName, fieldValue);
            if (!this.#allowedStates[state]) {
                throw new BackendError(`state is not correct`, 400);
            }
            return state;
        }

        if (fieldName === 'comment') {
            const comment = this.trimField(fieldName, fieldValue);
            if (comment.length > 100) {
                throw new BackendError('comment must not be longer that 100 characters', 400);
            }
            return comment;
        }
    }

    async getValidatedSubscription(subscriptionData) {
        const validatedSubscription = {};
        for (const fieldName in this.#fieldList) {
            const field = this.#fieldList[fieldName];
            if (field.required || subscriptionData[fieldName]) {
                validatedSubscription[fieldName] = await this.validate(fieldName, subscriptionData[fieldName]);
            }
        }
        return validatedSubscription;
    };

    findSubscription(subscriptionData, subscriptionList) {
        let foundPosition = 0;
        for (const subscription of subscriptionList) {
            if (subscription.userName === subscriptionData.userName) {
                return foundPosition;
            }
            foundPosition++;
        }
        return false;
    }

    async add(subscriptionData) {
        const entryData = await this.#entry.get(subscriptionData.entryId);
        const subscriptionList = entryData.subscriptions || [];
        const newSubscription = await this.getValidatedSubscription(subscriptionData);
        if (this.findSubscription(newSubscription, subscriptionList) !== false) {
            throw new BackendError(`subscription already exists`, 409);
        }
        entryData.subscriptions.push(newSubscription);
        const numUpdated = await this.#entry.update(entryData);
        return { numUpdated };
    }

    async update(subscriptionData) {
        const entryData = await this.#entry.get(subscriptionData.entryId);
        const subscriptionList = entryData.subscriptions || [];
        const newSubscription = await this.getValidatedSubscription(subscriptionData);
        const subscriptionIndex = this.findSubscription(newSubscription, subscriptionList);
        if (subscriptionIndex === false) {
            throw new BackendError(`subscription does not exist`, 400);
        }
        subscriptionList[subscriptionIndex] = newSubscription;
        entryData.subscriptions = subscriptionList;
        await this.#entry.update(entryData);
        return await this.#entry.get(subscriptionData.entryId);
    }

    async delete(subscriptionData) {
        const entryData = await this.#entry.get(subscriptionData.entryId);
        const subscriptionList = entryData.subscriptions || [];
        const subscriptionIndex = this.findSubscription(subscriptionData, subscriptionList);
        if (subscriptionIndex === false) {
            throw new BackendError(`subscription does not exist`, 400);
        }
        delete subscriptionList[subscriptionIndex];
        entryData.subscriptions = subscriptionList;
        await this.#entry.update(entryData);
        return await this.#entry.get(subscriptionData.entryId);
    }
}

module.exports = subscriptionModel;
