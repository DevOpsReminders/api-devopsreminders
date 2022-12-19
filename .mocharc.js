'use strict';

module.exports = {
    require:['ts-node/register','tsconfig-paths/register'],
    recursive:true,
    color: true,
    diff: true,
    exit: false, // could be expressed as "'no-exit': true"
    extension: ['ts'],
    'node-option': [], // without leading "--", also V8 flags
    package: './package.json',
    reporter: 'spec',
    'reporter-option': [], // array, not object
    slow: '75',
    sort: true,
    spec: ['tests/unit/**/*.spec.ts'], // the positional arguments!
    timeout: '2000', // same as "timeout: '2s'"
    ui: 'bdd',
};