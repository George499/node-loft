const { Router } = require('express')
const router = Router()
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Joi = require('@hapi/joi')
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ users: {}, skills: {}, products: [], emails: [] }).write()

router.get('/', async (req, res) => {
  console.log(req.session)
  res.render('login', { msglogin: req.flash('email') })
})

router.post('/', function (req, res) {
  const currentUser = db.get('users').value()
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(3).max(10).required(),
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    console.log(error)
    req.flash('email', error.message)
    res.redirect('/login')
  } else {
    if (
      currentUser.password === req.body.password &&
      currentUser.email === req.body.email
    ) {
      req.session.isAuth = true
      console.log(req.session)
      res.redirect('/admin')
      //   req.session.save((err) => {
      //     if (err) {
      //       throw err
      //     }
      //     //   req.body = {
      //     //     message: 'Done',
      //     //     status: 'OK',
      //     //   }
      //   })
    } else {
      req.status = 403
      req.flash('email', 'Forbiden')
      res.redirect('/login')
    }
  }
})

module.exports = router
