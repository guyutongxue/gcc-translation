import * as fs from "node:fs";
import { replaceGccDiagnostics } from "../index.mjs";

const diag = fs.readFileSync("./very_long.txt", "utf8");

console.log(replaceGccDiagnostics(diag));