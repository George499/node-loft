const { Router } = require("express");
const router = Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Joi = require('@hapi/joi');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: {}, skills: {}, products: [], emails: [] }).write();

router.get("/", async (req, res) => {
    res.render("login", { msglogin: req.flash('email') });
});

router.post('/', function (req, res) {
    const currentUser = db.get('users').value();
    const schema = Joi.object().keys({
        email: Joi
            .string()
            .trim()
            .email()
            .required(),
        password: Joi
            .string()
            .min(3)
            .max(10)
            .required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        req.flash('email', error.message)
        res.redirect('/login')
    } else {
        req.session.user = currentUser
        if (currentUser.password === req.body.password && currentUser.email === req.body.email) {
            req.session.isAuth = true
            req.session.save(err => {
                if (err) {
                    throw err
                }
                req.body = {
                    message: 'Done',
                    status: 'OK',
                }
                res.redirect('/admin')
            })
        } else {
            req.status = 403
            req.body = {
                message: 'Forbiden',
                status: 'Error',
            }
            req.flash('email', req.body.message)
            res.redirect('/login')
        }
    }
})


module.exports = router;