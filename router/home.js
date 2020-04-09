const { Router } = require("express");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const Joi = require('@hapi/joi');

const router = Router();

router.get("/", async (req, res) => {
  const skills = await db.get('skills').value()
  const products = await db.get('products').value()
  res.render("index", {
    skills,
    products,
    msgsemail: req.flash('home')
  });
})

router.post('/', async (req, res) => {
  const schema = Joi.object().keys({
    email: Joi
      .string()
      .trim()
      .email()
      .required(),
    name: Joi
      .string()
      .max(10)
      .required(),
    message: Joi
      .string()
      .max(100)
      .required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    req.flash('home', error.message)
  }
  await db.set('emails', req.body).write();
  console.log('Письмо успешно отправлено');
  res.redirect('/')
});


module.exports = router;
