var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (req.db) {
       req.db.collection('meta').find().toArray((err, docs) => {
           if(err) {
               console.error(err);
           } else {
               res.json(docs);
               res.status(200);
               res.send();
           }
       });
    } else {
        res.json([]);
        res.status(200);
        res.send();
    }
});

module.exports = router;