const fs = require("fs");
const { replaceGccDiagnostics } = require("../index.js");

const diag = fs.readFileSync("./color.txt", "utf8");

console.log(replaceGccDiagnostics(diag, { color: true }));