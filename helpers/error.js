module.exports = async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      await ctx.render('error', {
        status: ctx.response.status,
        error: ctx.response.message,
      })
    }
  } catch (err) {
    // TODO: Must be logger
    console.log(err)
    ctx.status = err.statusCode || err.status || 500
    await ctx.render('error', {
      status: ctx.response.status,
      error: ctx.response.message,
    })
  }
}
