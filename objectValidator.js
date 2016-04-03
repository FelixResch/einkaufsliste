
var validator = require('validator');

function validate (obj, def) {
    //TODO validate all required fields exist
    var fields = [];
    for(var i = 0; i < def.fields.length; i++) {
        var field = def.fields[i];
        fields.push(field.name);
        if(field.required) {
            if(!obj[field.name]) {
                //console.log('Required field ' + field.name + ' not found!');
                return false;
            }
        }
        if(obj[field.name]) {
            if(field.type) {
                if(field.type == 'email') {
                    if(!validator.isEmail(obj[field.name])) {
                        //console.log('Field ' + field.name + ' is not an email (' + obj[field.name] + ')');
                        return false;
                    }
                } else if (field.type == 'uuid') {
                    if(!validator.isUUID(obj[field.name])) {
                        //console.log('Field ' + field.name + ' is not an uuid (' + obj[field.name] + ')');
                        return false;
                    }
                }
            }
        }
    }
    if(def.strict) { //Only accept fields that are in the definition
        var keys = Object.keys(obj);
        for(var i = 0; i < keys.length; i++) {
            if(fields.indexOf(keys[i]) < 0) {
                //console.log('Field ' + keys[i] + ' is not a defined field');
                return false;
            }
        }
    }
    return true;
}

function validateUpdate(obj, def) {
    var fields = [];
    for(var i = 0; i < def.fields.length; i++) {
        var field = def.fields[i];
        fields.push(field.name);
        if(obj[field.name]) {
            if(field.type) {
                if(field.type == 'email') {
                    if(!validator.isEmail(obj[field.name])) {
                        //console.log('Field ' + field.name + ' is not an email (' + obj[field.name] + ')');
                        return false;
                    }
                } else if (field.type == 'uuid') {
                    if(!validator.isUUID(obj[field.name])) {
                        //console.log('Field ' + field.name + ' is not an uuid (' + obj[field.name] + ')');
                        return false;
                    }
                }
            }
        }
    }
    if(def.strict) { //Only accept fields that are in the definition
        var keys = Object.keys(obj);
        for(var i = 0; i < keys.length; i++) {
            if(fields.indexOf(keys[i]) < 0) {
                //console.log('Field ' + keys[i] + ' is not a defined field');
                return false;
            }
        }
    }
    return true;
}
module.exports = {
    check: (obj, def) => {
        if(Array.isArray(obj)) {
            var ok = true;
            for(var j = 0; j < obj.length; j++) {
                ok &= validate(obj[j], def);
            }
            return ok;
        } else {
            return validate(obj, def);
        }
    },
    update: (obj, def) => {
        if (Array.isArray(obj)) {
            var ok = true;
            for (var j = 0; j < obj.length; j++) {
                ok &= validateUpdate(obj[j], def);
            }
            return ok;
        } else {
            return validateUpdate(obj, def);
        }
    }
};