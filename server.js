#!/usr/bin/env node --harmony

'use strict';

const connect = require('connect');
const st = require('st');
const strftime = require('strftime');
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

function cacheHeaders(req, res, next) {
    const exp = strftime('%a, %d %b %Y %H:%M:%S GMT',
                (new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)));
    res.setHeader('Expires', exp);
    next();
}

const app = connect()
    .use(hood.hsts({
        maxAge: 31536000
    }))
    .use(cacheHeaders)
    .use(hood.nosniff())
    .use(hood.xframe())
    .use(st(STATIC_OPTIONS));

app.listen(process.env.PORT || 9000);
