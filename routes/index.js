const express = require('express')
const router = express.Router()
const tokens = require('../auth/tokens')
const secret = require('../auth/config.json')
const passport = require('passport')
const db = require('../models')
const helper = require('../helpers/serialize')
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const rename = promisify(fs.rename)
const path = require('path')


const auth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (!user || err) {
            res.status(401).json({
                code: 401,
                message: 'Unauthorized',
            })
        } else {
            next()
        }
    })(req, res, next)
}

router.post('/registration', async (req, res) => {

    const { username } = req.body
    const user = await db.getUserByName(username)

    if (user) {
        return res.status(400).json({})
    }
    try {
        const newUser = await db.createUser(req.body)
        const token = await tokens.createTokens(newUser, secret.secret)
        res.json({
            ...helper.serializeUser(newUser),
            ...token,
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
})

router.post('/login', async (req, res, next) => {
    passport.authenticate(
        'local',
        { session: false },
        async (err, user, info) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.status(400).json({})
            }
            if (user) {
                const token = await tokens.createTokens(user, secret.secret)
                res.json({
                    ...helper.serializeUser(user),
                    ...token,
                })
            }
        },
    )(req, res, next)
})

router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.headers['authorization']
    const data = await tokens.refreshTokens(refreshToken, db, secret.secret)
    res.json({ ...data })
})

router.get('/profile', auth, async (req, res) => {
    const token = req.headers['authorization']
    const user = await tokens.getUserByToken(token, db, secret.secret)
    res.json({
        ...helper.serializeUser(user),
    })
})
// TODO 
router.patch('/profile', upload.single('avatar'), auth, async (req, res, next) => {
    try {
        rename(req.file.path, path.join('build', req.file.originalname))
        const image = path.join(__dirname, 'build')

        const body = Object.assign(req.body, { image: image })
        const token = req.headers['authorization']
        const user = await tokens.getUserByToken(token, db, secret.secret)
        await db.updateUserProfile(user._id, body)
        res.json({
            ...helper.serializeUser(user),
        })

    } catch (e) {
        next(e)
    }
})

router
    .get('/users', auth, async (req, res) => {
        const users = await db.getUsers()
        res.json(users.map((user) => helper.serializeUser(user)))
    })
    .patch('/users/:id/permission', auth, async (req, res, next) => {
        try {
            const user = await db.updateUserPermission(req.params.id, req.body)
            res.json({
                ...helper.serializeUser(user)
            })
        }
        catch (e) {
            next(e)
        }
    })
    .delete('/users/:id', auth, async (req, res) => {
        await db.deleteUser(req.params.id)
        res.json({})
    })

router
    .get('/news', auth, async (req, res, next) => {
        try {
            const news = await db.getNews()
            return res.json(news)
        } catch (e) {
            next(e)
        }
    })
    .post('/news', auth, async (req, res, next) => {
        try {
            const token = req.headers['authorization']
            const user = await tokens.getUserByToken(token, db, secret.secret)
            await db.createNews(req.body, helper.serializeUser(user))
            const news = await db.getNews()
            res.json(news)
        } catch (e) {
            next(e)
        }
    })
    .patch('/news/:id', auth, async (req, res, next) => {
        try {
            await db.updateNews(req.params.id, req.body)
            const news = await db.getNews()
            res.json(news)
        } catch (e) {
            next(e)
        }
    })
    .delete('/news/:id', auth, async (req, res, next) => {
        try {
            await db.deleteNews(req.params.id)
            const news = await db.getNews()
            res.json(news)
        } catch (e) {
            next(e)
        }
    })

module.exports = router
