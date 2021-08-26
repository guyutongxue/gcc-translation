const fs = require("fs");
const { replaceGccDiagnostics } = require("../index.js");

const diag = fs.readFileSync("./test_diag.txt", "utf8");

console.log(replaceGccDiagnostics(diag));