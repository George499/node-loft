var express = require("express");
const app = express();
const LIMIT = 10;
const DELAY = 1000;
let connections = [];
let date = new Date();
let tick = 0;

app.get("/", (req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Trasfer-Encoding", "chunked");
  connections.push(res);
});

function dateToConsole(tick) {
  console.log(`Tick number ${tick}: ${date}`);
}

setTimeout(function run() {
  if (tick > LIMIT) {
    connections.map(res => {
      res.write(`tick #${tick} ${date}: End`);
      res.end();
    });
    tick = 0;
    connections = [];
  }
  connections.map(() => {
    tick++;
    dateToConsole(tick);
  });
  setTimeout(run, DELAY);
}, DELAY);

app.listen(3000, () => console.log("Сервер работает"));
