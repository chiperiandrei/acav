const LocalStorage = require('node-localstorage').LocalStorage;
const storage = new LocalStorage('./storage');

const isAuthorized = (req, res, next) => {
    if (req.session.wa && req.session.user) {
        next();
    } else if (req.body && req.body.wa) {
        const data = JSON.parse(storage.getItem(req.body.wa.token));
        req.session.wa = data.wa;
        req.session.user = data.user;
        next();
    } else if (req.query.wa) {
        const data = JSON.parse(storage.getItem(req.query.wa));
        req.session.wa = data.wa;
        req.session.user = data.user;
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = { isAuthorized, storage };