const fs = require("fs");
const path = require("path");
const program = require("./commander");

function getFiles(dir, outputFiles) {
  outputFiles = [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, outputFiles);
    } else {
      outputFiles.push(name);
    }
  }
  return outputFiles;
}

function sortFiles(files) {
  if (!fs.existsSync(`${program.output}`)) {
    fs.mkdirSync(`${program.output}`);
  }
  files.forEach(function(item) {
    const name = path.basename(item);
    const dirName = `${program.output}` + "/" + name.slice(0, 1);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
    const readable = fs.createReadStream(item);
    const writeable = fs.createWriteStream(dirName + "/" + name);
    readable.pipe(writeable);
  });
}

if (program.folder) {
  sortFiles(getFiles(program.folder));
  console.log(`Copied to ${program.output}`);
} else {
  console.log(`Folder ${program.folder} doesn't exist`);
}
