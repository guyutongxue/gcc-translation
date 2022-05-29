import * as fs from "node:fs";
import { replaceGccDiagnostics } from "../index.mjs";

const diag = fs.readFileSync("./help.txt", "utf8");

console.log(replaceGccDiagnostics(diag, {
    version: "12.1.0"
}));