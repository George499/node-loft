const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const homeRoutes = require("./router/home");
const adminRoutes = require('./router/admin')
const loginRoutes = require("./router/login");
const path = require("path");

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs"
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRoutes);
app.use("/login", loginRoutes);
app.use("/admin", adminRoutes)
app.use("/admin/skills", adminRoutes)
app.use("/admin/upload", adminRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
