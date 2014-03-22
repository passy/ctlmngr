#!/usr/bin/env node --harmony

'use strict';

const connect = require('connect');
var st = require('st');
const path = require('path');
const hood = require('hood');

const STATIC_OPTIONS = {
    path: path.join(process.cwd(), 'dist'),
    index: 'index.html',
    cache: {
        max: 1024 * 1024 * 64,
        maxAge: 1000 * 60 * 24 * 7
    }
};

const app = connect()
    .use(hood.hsts({
        maxAge: 31536000
    }))
    .use(hood.nosniff())
    .use(hood.xframe())
    .use(st(STATIC_OPTIONS));

app.listen(process.env.PORT || 9000);
