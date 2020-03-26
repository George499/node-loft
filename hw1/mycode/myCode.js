const fs = require("fs");
const path = require("path");
const program = require("./commander");
const inputFolder = `${program.folder}`;
const outputFolder = `${program.output}`;

function getFiles(dir) {
  const outputFiles = [];
  const files = fs.readdirSync(dir);
  files.map(i => {
    const name = path.join(dir, i);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, outputFiles);
    } else {
      outputFiles.push(name);
    }
  });
  return outputFiles;
}

async function sortFiles() {
  let files = await getFiles(inputFolder);
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }
  files.map(item => {
    const name = path.basename(item);
    const firstLetter = name.substr(0, 1).toLowerCase();
    const dirName = path.join(outputFolder, firstLetter);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
    const readable = fs.createReadStream(item);
    const writeable = fs.createWriteStream(path.join(dirName, name));
    readable.pipe(writeable);
  });
}

if (program.folder) {
  try {
    sortFiles();
    console.log(`Copied to ${outputFolder}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
} else {
  console.log(`Folder ${outputFolder} doesn't exist`);
}
