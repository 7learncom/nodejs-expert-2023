const esm = require('./esm.mjs');

function greeting() {
    console.log('Hi, this is a CJS module!');
}

module.exports = {
    greeting,
};
