const { Router } = require("express");
const router = Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path')

router.get("/", (req, res) => {
    res.render("admin");
});

router.post('/skills', function (req, res) {
    db.set('skills', req.body).write();
    res.render('admin')

});

router.post('/upload', upload.single('photo'), (req, res) => {
    let product = {
        imgpath: path.join('uploads', req.file.originalname),
        name: req.body.name,
        price: req.body.price
    }
    db.get('products').push(product).write();
    res.render('admin')
})

module.exports = router;
