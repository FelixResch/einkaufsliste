
var obfuscate = require('email-obfuscator');

function obf(obj, config) {
    if(config && Array.isArray(config) && config.length > 0) {
        for(var i = 0; i < config.length; i++) {
            if(config[i].field) {
                if(config[i].type) {
                    if(config[i].type == 'email'){
                        obj[config[i].field] = obfuscate(obj[config[i].field]);
                    }
                } else {
                    delete obj[config[i].field];
                }
            }
        }
    }
}

module.exports = (obj, config) => {
    if(Array.isArray(obj)) {
        for(var j = 0; j < obj.length; j++) {
            obf(obj[j], config);
        }
    } else {
        obf(obj, config);
    }
};