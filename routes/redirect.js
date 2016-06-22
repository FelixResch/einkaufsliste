var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    res.redirect('https://youtu.be/qCJSNMqub8g');
});

module.exports = router;