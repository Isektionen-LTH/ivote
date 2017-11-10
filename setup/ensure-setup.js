module.exports = function ensureSetup() {
    try {
        const config = require('../config.json');
        const credentials = require('../credentials.json'); 
    } catch(e) {
        console.log('First run cd setup && node . to setup');
        process.exit(0);
    }
};