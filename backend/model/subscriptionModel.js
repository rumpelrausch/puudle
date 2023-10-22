const db = require('../services/db.js');
const entryModel = require('../model/entryModel');
const BackendError = require('../util/backendError');

const MIN_USERNAME_LENGTH = 2;
const MAX_COMMENT_LENGTH = 100;

class subscriptionModel {
    #entry;

    #allowedStates = {
        suggested: 1,
        confirmed: 2,
        rejected: 3,
        maybe: 4
    };

    #fieldList = [
        'userName',
        'state',
        'comment'
    ]

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
            if (userName.length < MIN_USERNAME_LENGTH) {
                throw new BackendError(`userName must contain at least ${MIN_USERNAME_LENGTH} characters`, 400);
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
            if (comment.length > MAX_COMMENT_LENGTH) {
                throw new BackendError(`comment must not be longer that ${MAX_COMMENT_LENGTH} characters`, 400);
            }
            return comment;
        }
    }

    async getValidatedSubscription(subscriptionData) {
        const validatedSubscription = {};
        for (const fieldName of this.#fieldList) {
            validatedSubscription[fieldName] = await this.validate(fieldName, subscriptionData[fieldName] || '');
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
        await this.#entry.update(entryData, true);
        return await this.#entry.get(subscriptionData.entryId);
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
        await this.#entry.update(entryData, true);
        return await this.#entry.get(subscriptionData.entryId);
    }

    async delete(subscriptionData) {
        const entryData = await this.#entry.get(subscriptionData.entryId);
        const subscriptionList = entryData.subscriptions || [];
        const subscriptionIndex = this.findSubscription(subscriptionData, subscriptionList);
        if (subscriptionIndex === false) {
            throw new BackendError(`subscription does not exist`, 400);
        }
        subscriptionList.splice(subscriptionIndex, 1);
        entryData.subscriptions = subscriptionList;
        await this.#entry.update(entryData, true);
        return await this.#entry.get(subscriptionData.entryId);
    }
}

module.exports = subscriptionModel;
