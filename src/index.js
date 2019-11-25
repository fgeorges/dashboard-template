"use strict";

const path = require('path');

require('./server')
    .start({
        port:  process.env.PORT || 1337,
        dist:  path.join(__dirname, '../dist'),
        views: path.join(__dirname, 'views')
    });
