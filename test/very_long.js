const fs = require("fs");
const { replaceGccDiagnostics } = require("../index.js");

const diag = fs.readFileSync("./very_long.txt", "utf8");

console.log(replaceGccDiagnostics(diag));