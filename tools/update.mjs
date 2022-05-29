// @ts-check

// 此文件读取 raw_result.json（由 generate_raw.ipynb 生成），查找尚未翻译的字段到 not_tracked.json。

import * as fs from "node:fs";

const rawResult = fs.readFileSync("../data/raw_result.json", "utf-8");
const rawJson = JSON.parse(rawResult);

const oldMain = fs.readFileSync("../src/11.2.0.json", "utf-8");
const oldJson = JSON.parse(oldMain);

const notTracked = [];

for (const item of rawJson) {
  const found = oldJson.find(({ id }) => id === item.msgid);
  if (typeof found === "undefined") {
    notTracked.push({
      id: item.msgid,
      pattern: item.msgid
        .replace(/\./g, "\\.")
        .replace(/\*/g, "\\*")
        .replace(/\?/g, "\\?")
        .replace(/\+/g, "\\+")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/\[/g, "\\[")
        .replace(/\]/g, "\\]")
        .replace(/\{/g, "\\{")
        .replace(/\}/g, "\\}")
        .replace(/\^/g, "\\^")
        .replace(/\$/g, "\\$")
        .replace(/\|/g, "\\|")
        .replace(/\\"/g, '"')
        .replace(/%</g, "'")
        .replace(/%>/g, "'"),
      replacement: item.msgstr,
    });
  }
}

fs.writeFileSync(
  "../data/not_tracked_2.json",
  JSON.stringify(notTracked, null, 2)
);
