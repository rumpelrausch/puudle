const express = require("express");
const routeLoader = require('./routing/routeLoader.js');
const db = require('./services/db.js');
const Event = require('./model/eventModel');

db.persistDays(30);

const app = express();
routeLoader.load(app);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`API is listening on port ${port}`);
});

(async function () {
         
    // const doc = await db.findOneAsync({ comment: 'blah' });
    // if (doc) {
    //     console.log('found', { id: doc._id });
    //     await db.updateAsync({
    //         _id: doc._id
    //     }, {
    //         $set: {
    //             userName: 'me'
    //         }
    //     });
    // } else {
    //     console.log('insert');
    //     await db.insertAsync({
    //         type: 'event',
    //         comment: 'blah'
    //     });
    // }

    // const m1 = new Event();
    // await m1.add("Alice", '2023');

    // const allEvents = await m1.list();
    // console.log(allEvents);

    // if(!await m1.get('qGyljmJ7WespPU1X')){
    //     console.error('doc not found');
    //     return;
    // }
    // console.log(m1.document);
    
    db.sync();
})();
