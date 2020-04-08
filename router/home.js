const { Router } = require("express");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const router = Router();

router.get("/", async (req, res) => {
  const skills = await db.get('skills').value()
  const products = await db.get('products').value()
  res.render("index", {
    skills,
    products
  });
})

router.post('/', async (req, res) => {
  await db.set('emails', req.body).write();
  console.log('Письмо успешно отправлено');
  res.redirect('/')
});


module.exports = router;
