"use strict";

const router = new require('koa-router')();
const parser = require('koa-bodyparser')();

const systemFields = new Set([
    '_ctx',
    '_expire',
    '_sessCtx'
]);

router.get('/api/session/field', async (ctx) => {
    ctx.body = {
        fields: Object
            .keys(ctx.session)
            .filter(k => ! systemFields.has(k))
            .map(k => ({name: k, value: ctx.session[k]}))
    };
});

router.post('/api/session/field', parser, async (ctx) => {
    const field = ctx.request.body;
    ctx.session[field.name] = field.value;
    ctx.body = {
        message: `Field "${field.name}" created with value "${field.value}".`,
        name:    field.name,
        value:   field.value
    };
});

router.post('/api/session/field/:name', parser, async (ctx) => {
    const field = ctx.request.body;
    if ( field.name !== ctx.params.name ) {
        throw new Errror(`Names in URL and body differ: ${ctx.params.name} vs ${field.name}`);
    }
    if ( ctx.session[field.name] === undefined ) {
        ctx.body = {
            message: `Field "${field.name}" does not exist.`
        };
    }
    else {
        ctx.session[field.name] = field.value;
        ctx.body = {
            message: `Field "${field.name}" saved.`
        };
    }
});

router.del('/api/session/field/:name', async (ctx) => {
    const name = ctx.params.name;
    if ( ctx.session[name] === undefined ) {
        ctx.body = {
            message: `Field "${name}" does not exist.`
        };
    }
    else {
        delete ctx.session[name];
        ctx.body = {
            message: `Field "${name}" deleted.`
        };
    }
});

module.exports = router;
