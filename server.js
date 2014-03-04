#!/usr/bin/env node --harmony

'use strict';

const connect = require('connect');
const path = require('path');
const hood = require('hood');

const STATIC_OPTIONS = {
    root: path.join(process.cwd(), 'app'),
    maxAge: 86400000,
    redirect: false
};

const app = connect()
    .use(connect.static(STATIC_OPTIONS.root, STATIC_OPTIONS))
    .use(connect.compress())
    .use(hood.hsts({
        maxAge: 31536000
    }))
    .use(hood.nosniff())
    .use(hood.xframe());

app.listen(process.env.PORT || 5000);
