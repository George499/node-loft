const fs = require("fs");
const path = require("path");

module.exports = function(dist, watcher) {
  function copyFile(file) {
    const indexLetter = 0;
    const firstLetter = file.name[indexLetter].toLowerCase();
    const dir = path.join(dist, firstLetter);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    try {
      fs.copyFileSync(file.path, path.join(dir, file.name));
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  return function readFolder(base) {
    watcher.startProcess(base);
    fs.readdir(base, (err, files) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      for (const item of files) {
        const localBase = path.join(base, item);
        const state = fs.statSync(localBase);
        if (state.isDirectory()) {
          readFolder(localBase);
        } else {
          copyFile({ name: item, path: localBase });
        }
      }
      watcher.endProcess(base);
    });
  };
};
