var express = require("express");
const app = express();

app.get("/", function(req, res) {
  res.send(`<!doctype>
  <html>
    <head>
    <meta charset='utf-8'>
    <title> Основы Node </title>
    </head>
    <body>
    <h1>Шаблон</h1>
    <button onclick='alert("Нажми меня")'>Push</button>
    </body>
    </html>
  `);
});

app.listen(3000, () => console.log("Сервер работает"));
