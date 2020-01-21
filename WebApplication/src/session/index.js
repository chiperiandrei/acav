const LocalStorage = require('node-localstorage').LocalStorage;
const storage = new LocalStorage('./storage');

const isAuthorized = (req, res, next) => {
    if (req.session.wa && req.session.user) {
        next();
    } else if (req.body && req.body.wa) {
        const key = req.body.wa.token;
        const data = JSON.parse(storage.getItem(key));
        if (data) {
            req.session.wa = data.wa;
            req.session.user = data.user;
            storage.removeItem(key);
        }
        next();
    } else if (req.query.wa) {
        const key = req.query.wa;
        const data = JSON.parse(storage.getItem(key));
        if (data) {
            req.session.wa = data.wa;
            req.session.user = data.user;
            storage.removeItem(key);
        }
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = { isAuthorized, storage };