const { Router } = require("express");
const router = Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path')
const Joi = require('@hapi/joi');

const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)


router.get("/", (req, res) => {
    res.render("admin", { msgskill: req.flash('skills'), msgskill: req.flash('upload') });
});

router.post('/skills', async (req, res) => {
    const schema = Joi.object().keys({
        age: Joi
            .string()
            .min(0)
            .max(3)
            .required(),
        concerts: Joi
            .string()
            .required(),
        cities: Joi
            .string()
            .required(),
        years: Joi
            .string()
            .required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        req.flash('skills', error.message)
        res.redirect("/admin")
    }
    await db.set('skills', req.body).write();
    res.redirect('/admin')
});

router.post('/upload', upload.single('photo'), async (req, res) => {

    let product = {
        imgpath: path.join('uploads', req.file.originalname),
        name: req.body.name,
        price: req.body.price
    }
    const schema = Joi.object().keys({
        name: Joi
            .string()
            .min(1)
            .max(10)
            .required(),
        imgpath: Joi
            .number()
            .integer()
            .min(1),
        price: Joi
            .number()
            .integer()
            .min(1)
            .required(),
    })

    const { error, value } = schema.validate(req.body);
    if (error) {
        await unlinkAsync(req.file.path)
        db.get('products').pop(product).write()
        req.flash('upload', error.message)
    }
    db.get('products').push(product).write();
    res.redirect('/admin')
})

module.exports = router;


// msgfile
// msgskill