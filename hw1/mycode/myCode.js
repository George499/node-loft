const fs = require("fs").promises;
const { createReadStream, createWriteStream } = require("fs");
const path = require("path");
const program = require("./commander");
const inputFolder = `${program.folder}`;
const outputFolder = `${program.output}`;

async function getFiles(dir) {
  let outputFiles = [];
  const files = await fs.readdir(dir);
  for (i of files) {
    const name = path.join(dir, i);
    const isThis = await fs.stat(name);
    if (isThis.isDirectory()) {
      const filesSubDir = await getFiles(name);
      outputFiles = [...filesSubDir, ...outputFiles];
    } else {
      outputFiles.push(name);
    }
  }
  return outputFiles;
}

function isAccessible(path) {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
}
function getNameFilesAndPath(item, folder) {
  const name = path.basename(item);
  const firstLetter = name.substr(0, 1).toLowerCase();
  const dirName = path.join(folder, firstLetter);
  return { name, dirName };
}
async function sortFiles() {
  let files = await getFiles(inputFolder);

  if (!(await isAccessible(outputFolder))) {
    await fs.mkdir(outputFolder);
  }
  for (i of files) {
    const nameAndPath = getNameFilesAndPath(i, outputFolder);
    if (!(await isAccessible(nameAndPath.dirName))) {
      await fs.mkdir(nameAndPath.dirName);
    }
  }
  const promiseFiles = files.map(item => {
    return new Promise(async (resolve, reject) => {
      const nameAndPath = getNameFilesAndPath(item, outputFolder);
      const readable = createReadStream(item);
      const writeable = createWriteStream(
        path.join(nameAndPath.dirName, nameAndPath.name)
      );
      readable.pipe(writeable);
      writeable.on("finish", () => {
        resolve();
      });
      writeable.on("error", err => {
        reject(err.message);
      });
      readable.on("error", err => {
        reject(err.message);
      });
    });
  });

  await Promise.all(promiseFiles.map(item => item.catch(console.log)));
}

(async () => {
  if (inputFolder) {
    try {
      await sortFiles();
      console.log(`Copied to ${outputFolder}`);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  } else {
    console.log(`Folder ${outputFolder} doesn't exist`);
  }
})();
