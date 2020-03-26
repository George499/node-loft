const http = require("http");

var INTERVAL = process.argv[2] || 1000;
var TIME = process.argv[3] || 5000;

let clock = {};
let id = 0;

async function consoleDateAndTime(id) {
  clock[id] = setInterval(() => {
    console.log(`Clock ${id}:`, new Date());
  }, INTERVAL);
}

function stopClock(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      clearInterval(clock[id]);
      resolve(new Date());
    }, TIME);
  });
}

async function serverHandler(request, response) {
  id++;
  let result;
  if (request.method === "GET" && request.url !== "/favicon.ico") {
    try {
      consoleDateAndTime(id);
      result = await stopClock(id);
    } catch (error) {
      console.error(error);
    }
  }
  response.end(`Current Date id ${id} : ${result}`);
}
http.createServer(serverHandler).listen(3000);
