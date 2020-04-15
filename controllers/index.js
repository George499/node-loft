const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const rename = promisify(fs.rename)

module.exports.index = async (ctx, next) => {
  const _skills = db.get('skills').value()
  const _products = db.get('products').value()[0]
  skills = [
    {
      number: _skills.age,
      text: 'Возраст начала занятий на скрипке',
    },
    {
      number: _skills.concerts,
      text: 'Концертов отыграл',
    },
    {
      number: _skills.cities,
      text: 'Максимальное число городов в туре',
    },
    {
      number: _skills.years,
      text: 'Лет на сцене в качестве скрипача',
    },
  ]
  products = [
    {
      src: _products.imgpath,
      name: _products.name,
      price: _products.price,
    }
  ]
  await ctx.render('pages/index', { msgemail: ctx.flash('email')[0], skills, products })
}

module.exports.skillsUpdate = async (ctx, next) => {
  await db.set('skills', ctx.request.body).write()
  next()
}

module.exports.uploadUpdate = async (ctx, next) => {
  let product = {
    imgpath: path.join('assets/img', ctx.file.originalname),
    name: ctx.request.body.name,
    price: ctx.request.body.price,
  }
  rename(ctx.file.path, path.join('public', product.imgpath))
  db.get('products').push(product).write()
  next()
}

module.exports.contactMe = async (ctx, next) => {
  await db.get('emails').push(ctx.request.body).write()
  next()
}

module.exports.login = async (ctx) => {
  await ctx.render('pages/login', { msglogin: ctx.flash('login')[0] })
}

module.exports.admin = async (ctx, next) => {
  if (ctx.session.isAuth) {
    await ctx.render('pages/admin', { msgskill: ctx.flash('skill')[0], msgfile: ctx.flash('file')[0] })
  } else {
    ctx.redirect('./login')
  }
}

module.exports.auth = async (ctx, next) => {
  const user = db.get('users').value()
  const { email, password } = ctx.request.body
  if (
    user.password === password &&
    user.email === email
  ) {
    ctx.session.isAuth = true
  } else {
    ctx.status = 403
    ctx.flash('login', 'Error')
  }
  next()
}
