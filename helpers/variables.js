module.exports = function (req, res, next) {
    res.locals.isAuthed = req.session.isAuth

    next()
}