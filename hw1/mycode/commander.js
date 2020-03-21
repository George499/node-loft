const { program } = require("commander");

module.exports = program
  .option("-f, --folder <type>", "Input folder for sorting", "./../image")
  .option("-o, --output <type>", "Input output folder", "./dist")
  .option("-d, --delete", "Delete folder for sorting");
