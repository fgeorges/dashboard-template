"use strict";

// TODO: Replace authentication (setting authuser on the session, etc.) done manually here
// by a middleware to do it.  So extraction of the user is done there.  Then authorization
// will be based on that, but defined on a route-by-route basis (in a first time, when not
// logged in, all pages will be redirected to /login, except / and /login, but each route
// should be able to do specific authorization...)

const router = new require('koa-router')();
//const parser = require('koa-bodyparser')();

//const users = require('./users.json');

router.get('/', async (ctx) => {
    return ctx.render('index', {
        session: ctx.session
    });
});

router.get('/charts', async (ctx) => {
    return ctx.render('charts');
});

router.get('/icons', async (ctx) => {
    return ctx.render('icons');
});

router.get('/session', async (ctx) => {
    return ctx.render('session');
});

// router.get('/login', async (ctx) => {
//     return ctx.render('icons', {
//         authuser: ctx.session.authuser
//     });
// });

// router.post('/login', parser, async (ctx) => {
//     const username = ctx.request.body.user;
//     const user     = users[username];
//     if ( ! user ) {
//         // TODO: Display the login page again, with an extra RED message "wrong credentials".
//         ctx.throw(401, `Wrong credentials using ${username}`, {username});
//     }
//     // set `authuser` on the session
//     ctx.session.authuser = username;
//     ctx.redirect(`/u/${username}`);
// });

// router.get('/logout', async (ctx) => {
//     ctx.session.authuser = null;
//     ctx.redirect('/login');
// });

module.exports = router;
