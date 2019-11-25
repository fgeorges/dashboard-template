"use strict";

// Inspired from: https://github.com/mjhea0/node-koa-api/blob/master/src/server/index.js

const koa     = require('koa');
const logger  = require('koa-logger');
const views   = require('koa-views');
const hbs     = require('handlebars');
const mount   = require('koa-mount');
const serve   = require('koa-static');
const fs      = require('fs');
const path    = require('path');

// provide the hbs helper `extend`
require('handlebars-layouts').register(hbs);

function registerPartials(partials, dir) {
    fs.readdirSync(dir, {withFileTypes: true}).forEach(entry => {
        const child = path.join(dir, entry.name);
        if ( entry.isDirectory() ) {
            registerPartials(partials, child);
        }
        else if ( entry.name.endsWith('.hbs') ) {
            const name = entry.name.slice(0, -4);
            console.log(`Register partial ${name} from ${child}`);
            partials[name] = child;
        }
        else {
            throw new Error(`Neither dir or hbs, in ${dir}: ${entry.name}`);
        }
    });
}

function handlebarsOptions(dir) {
    console.log(`Register helpers from views/helpers/index`);
    const partials = {};
    registerPartials(partials, dir);
    return {
        partials,
        helpers: require('./views/helpers/index'),
        cache:   true
    }
}

module.exports = {
    start: (params) => {
        // the server
        const app = new koa();

        app.use(logger());

        app.use(mount('/fonts',        serve(path.join(params.views, 'fonts'))));
        app.use(mount('/images',       serve(path.join(params.views, 'images'))));
        app.use(mount('/js',           serve(path.join(params.views, 'js'))));
        app.use(mount('/css',          serve(path.join(params.dist, 'css'))));
        app.use(mount('/node_modules', serve(path.join(params.dist, 'node_modules'))));

        // setup handlebars
        const options = handlebarsOptions(path.join(params.views, 'partials'));
        app.use(views(
            path.join(params.views, 'pages'),
            { options, extension: 'hbs', map: {hbs: 'handlebars'} }));

        // routes
        app.use(require('./routes/index').routes());

        // start the server
        app.listen(params.port, () => {
            console.log(`Server listening on port: ${params.port}`);
            console.log(`Dist dir  : ${params.dist}`);
            console.log(`Views dir : ${params.views}`);
        });
    }
};
