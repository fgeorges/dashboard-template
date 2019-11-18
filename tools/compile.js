#!/usr/bin/env node

const fs      = require('fs');
const path    = require('path');
const hbs     = require('handlebars');
const helpers = require('../src/views/helpers/index');

require('handlebars-layouts').register(hbs);

// ensure known territory (the root of the package)
process.chdir(path.resolve(__dirname, '..'));

function ensure(dir) {
    try {
        fs.mkdirSync(dir);
    }
    catch ( err ) {
        if ( err.code !== 'EEXIST' ) {
            throw err;
        }
    }
}

function read(file) {
    return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
    fs.writeFileSync(file, content, 'utf8');
}

function setup() {
    hbs.registerPartial('layout',  read('src/views/partials/layout.hbs'));
    hbs.registerPartial('navbar',  read('src/views/partials/navbar.hbs'));
    hbs.registerPartial('sidebar', read('src/views/partials/sidebar.hbs'));
    Object.keys(helpers).forEach(k => hbs.registerHelper(k, helpers[k]));
}

function compile(name) {
    console.log(`compile ${name}`);
    const template = hbs.compile(read(`src/views/pages/${name}.hbs`));
    // TODO: Save in dist/${name}.html...
    write(`dist/${name}.html`, template({}));
}

function copy(dir) {
    console.log(`copy ${dir}`);
    ensure(`dist/${dir}`);
    fs.readdirSync(`src/views/${dir}`, {withFileTypes:true}).forEach(entry => {
        if ( ! entry.isFile() ) {
            return;
        }
        write(`dist/${dir}/${entry.name}`, read(`src/views/${dir}/${entry.name}`));
    });
}

setup();
compile('charts');
compile('icons');
compile('index');
compile('maps_google');
compile('notifications');
compile('tables');
compile('typography');

copy('fonts');
copy('fonts/flaticon');
copy('images');
copy('js');
