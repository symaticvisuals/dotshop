// take a object and schema and change the object to match the schema
// if the object is not safe to parse, return false
// if the object is safe to parse, return true

import moment from "moment";

const checkParseSafe = (obj, schema) => {
    let safe = true;
    const check = (o, s) => {
        if (typeof o !== 'object' || typeof s !== 'object') {
            return;
        }
        Object.keys(s).forEach((key) => {
            if (typeof s[key] === 'object') {
                if (typeof o[key] !== 'object') {
                    safe = false;
                } else {
                    check(o[key], s[key]);
                }
            } else if (typeof o[key] !== typeof s[key]) {
                safe = false;
            }
        });
    };
    check(obj, schema);
    return safe;
};


// change the values of object according to the schema provided
// eg. if the schema is {a: 'string', b: 'number'} and the object is {a: 1, b: '2'}
// the object will be changed to {a: '1', b: 2}
// eg. if the schema is {a: 'date', b: 'string'} and the object is {a:'2020-01-01', b: 2}
// the object will be changed to {a: new Date('2020-01-01'), b: '2'}

// convert the string in the object to the type specified in the schema
const parseSafe = (obj, schema) => {
    const parse = (o, s) => {
        if (typeof o !== 'object' || typeof s !== 'object') {
            return;
        }
        Object.keys(s).forEach((key) => {
            if (typeof s[key] === 'object') {
                parse(o[key], s[key]);
            } else if (typeof o[key] === 'string') {
                if (s[key] === 'number' && !isNaN(o[key] && o[key] !== '')) {
                    o[key] = Number(o[key]);
                } else if (s[key] === 'date') {
                    o[key] = moment(o[key]).utc().format();
                }
            }
        });
        return o;
    };
    return { success: true, data: parse(obj, schema) };
};

// check the values of the object according to the schema if the value is not null, undefined or empty string
// if the value provided is null, undefined or empty string, it will be returning success = false
// only check the values whose key is present in the array
const checkSafe = (obj, schema, not_null_schema = []) => {

    let safe = true;
    const check = (o, s, nns) => {
        if (typeof o !== 'object' || typeof s !== 'object') {
            return;
        }
        Object.keys(s).forEach((key) => {
            if (typeof s[key] === 'object') {
                check(o[key], s[key], nns);
            } else if (nns.includes(key)) {
                if (o[key] === null || o[key] === undefined || o[key] === '' || o[key] === 'null' || o[key] === 'undefined' || o[key] === '""' || o[key] === ' ' || o[key] === '  ' || o[key] === '   ') {
                    safe = false;
                }
            }
        });
    };
    check(obj, schema, not_null_schema);

    if (safe) {
        return parseSafe(obj, schema);
    }
    else {
        return { success: false, message: 'Please fill all the fields' };
    }
};





export { checkParseSafe, parseSafe, checkSafe };