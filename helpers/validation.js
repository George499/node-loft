const Joi = require('@hapi/joi')
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)


module.exports.isValidSkills = async (ctx, next) => {
  const schema = Joi.object().keys({
    age: Joi.string().min(0).max(3).required(),
    concerts: Joi.string().required(),
    cities: Joi.string().required(),
    years: Joi.string().required(),
  })
  const { error } = schema.validate(ctx.request.body)
  if (error) {
    ctx.flash('skill', error.message)
  }
  next()
}

module.exports.isValidUpload = async (ctx, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(1).max(10).required(),
    imgpath: Joi.number().integer().min(1),
    price: Joi.number().integer().min(1).required(),
  })
  const { error } = schema.validate(ctx.request.body)
  if (error) {
    ctx.flash('file', error.message)
    await unlinkAsync(ctx.file.path)
    ctx.redirect('/admin')
  } else {
    next()
  }
}

module.exports.isValidEmail = async (ctx, next) => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    message: Joi.string()
      .max(1200)
      .required(),
  })
  const { error } = schema.validate(ctx.request.body)
  if (error) {
    // const message = error.details.map((el) => el.message).join('; ')    
    ctx.flash('email', error.message)
  }
  next()

}

module.exports.isValidAuth = (ctx, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(3).max(10).required(),
  })
  const { error } = schema.validate(ctx.request.body)

  if (error) {
    const message = error.details.map((el) => el.message).join('; ')
    ctx.status = 400
    ctx.flash('login', message)
  }
  next()
}
