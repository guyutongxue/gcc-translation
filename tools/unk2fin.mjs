// @ts-check

// 此文件将翻译好的 not_tracked.json 与此前已知的翻译合并为完整的翻译文件。

import * as fs from "node:fs";

const raw = JSON.parse(fs.readFileSync("../data/raw_result.json", "utf-8"));
const g11 = JSON.parse(fs.readFileSync("../src/11.2.0.json", "utf-8"));
const unt = JSON.parse(fs.readFileSync("../data/not_tracked.json", "utf-8"));

const g12 = [];

for (const item of raw) {
  let found = g11.find(({ id }) => id === item.msgid);
  if (typeof found === "undefined") {
    found = unt.find(({ id }) => id === item.msgid);
  }
  found && g12.push(found);
}

fs.writeFileSync(
  "../src/12.1.0.json",
  JSON.stringify(g12, null, 2)
);
