const express = require("express");
const app = express();
const flash = require('connect-flash');
const session = require('express-session')
const FileStore = require('express-session')
const exphbs = require("express-handlebars");
const homeRoutes = require("./router/home");
const adminRoutes = require('./router/admin')
const loginRoutes = require("./router/login");
const path = require("path");
const config = require('./config')
const varHelper = require('./helpers/variables')
const fs = require('fs')

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: ".hbs"
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        expires: new Date(Date.now() + 3600000) //1 Hour
    })
)
app.use(varHelper)
app.use(flash());
app.use("/", homeRoutes);
app.use("/login", loginRoutes);
app.use("/admin", adminRoutes)
app.use("/admin/skills", adminRoutes)
app.use("/admin/upload", adminRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
    if (!fs.existsSync(config.upload)) {
        fs.mkdirSync(config.upload)
    }
    console.log('Server start on port: ', port)
})

