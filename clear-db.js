var db = require('./app/db.js');
setTimeout(function () {
    db.dbDelete();
}, 2000);
