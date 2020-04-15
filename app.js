const Koa = require('koa')
const app = new Koa()
const static = require('koa-static')
const session = require('koa-session')
const FileStore = require('koa-filestore');
const Pug = require('koa-pug')
const fs = require('fs')
const path = require('path')
const errorHandler = require('./helpers/error')
const config = require('./config')
const flash = require('koa-better-flash');

new Pug({
  viewPath: path.resolve(__dirname, './views'),
  pretty: false,
  basedir: './views',
  noCache: true,
  app: app,
})
app.use(static('./public'))
const router = require('./routes')
app
  .use(session(app, { signed: false }, {
    store: new FileStore({
      cacheDir: './session/',
      maxAge: 86400000
    })
  }))
  .use(flash())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(errorHandler)

const port = process.env.PORT || 5000
app.listen(port, () => {
  try {
    if (!fs.existsSync(config.upload)) {
      fs.mkdirSync(config.upload)
    }
    console.log('Server start on port: ', port)
  } catch (error) {
    if (error) {
      process.on('exit');
    }
  }
})
