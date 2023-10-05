const callController = (controllerFunction, data, res, next) => {
    controllerFunction(data)
        .then((result) => res.send(result))
        .catch((error) => {
            res.status(error.code);
            res.send({ error: error.message });
            next();
        });
};

module.exports = {
    callController
};