const Router = require('koa-router')
const router = new Router()
const koaBody = require('koa-body')
const controllers = require('../controllers')
const validation = require('../libs/validation')
const multer = require('@koa/multer');
const upload = multer({ dest: 'uploads/' })

router.get('/', controllers.index)
router.get('/contact-me', controllers.contactMe)
router.get('/login', controllers.login)
router.get('/admin', controllers.admin)

router.post('/admin/skills', koaBody(),
  validation.isValidSkills,
  controllers.skillsUpdate,
  async ctx => await ctx.redirect('/admin')
)

router.post('/login',
  koaBody(),
  validation.isValidAuth,
  controllers.auth,
  async ctx => await ctx.redirect('/admin')
)

router.post('/admin/upload',
  koaBody(),
  upload.single('photo'),
  validation.isValidUpload,
  controllers.uploadUpdate,
  async ctx => await ctx.redirect('/admin')
)

router.post(
  '/',
  koaBody(),
  validation.isValidEmail,
  controllers.contactMe,
  async ctx => await ctx.redirect('/')
)

module.exports = router
