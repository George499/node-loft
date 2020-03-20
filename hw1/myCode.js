const fs = require("fs");
const path = require("path");

function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

function sortFiles(files) {
  if (!fs.existsSync("./result")) {
    fs.mkdirSync("./result");
  }
  files.forEach(function(item) {
    const name = path.basename(item);
    const dirName = "./result/" + name.slice(0, 1);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
    const readable = fs.createReadStream(item);
    const writeable = fs.createWriteStream(dirName + "/" + name);
    readable.pipe(writeable);
  });
}

sortFiles(getFiles("./image"));
