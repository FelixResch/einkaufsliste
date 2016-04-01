
function obf(obj, config) {
    if(config && Array.isArray(config) && config.length > 0) {
        for(var i = 0; i < config.length; i++) {
            if(config[i].field) {
                delete obj[config[i].field];
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