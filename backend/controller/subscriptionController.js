const subscriptionModel = require('../model/subscriptionModel');

const addSubscription = async(subscriptionData) => {
    const subscription = new subscriptionModel();
    return await subscription.add(subscriptionData);
}

const updateSubscription = async (subscriptionData) => {
    const subscription = new subscriptionModel();
    const updatedEntry = await subscription.update(subscriptionData);
    return {
        updatedEntry
    }
};

const deleteSubscription = async(subscriptionData) => {
    const subscription = new subscriptionModel();
    const updatedEntry = await subscription.delete(subscriptionData);
    return {
        updatedEntry
    }
}

module.exports = {
    addSubscription,
    updateSubscription,
    deleteSubscription
};
