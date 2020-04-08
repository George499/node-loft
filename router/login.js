const { Router } = require("express");
const router = Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: {}, skills: {}, products: [], emails: [] }).write();

router.get("/", async (req, res) => {
    res.render("login");
});

router.post('/', function (req, res) {
    const currentUser = db.get('users').value();
    if (currentUser.password === req.body.password) {
        res.render('admin')
    } else {
        res.render('login')
    }
})

module.exports = router;