// @ts-check

// 对 not_tracked 内的 pattern 做处理后，或许可以得到一些已经翻译过的 pattern。此文件查找这些 pattern，使用已有的翻译替换。

import * as fs from "node:fs";

const g11 = JSON.parse(fs.readFileSync("../src/11.2.0.json", "utf-8"));
const unt = JSON.parse(fs.readFileSync("../data/not_tracked.json", "utf-8"));



for (const i of unt) {
    const found = g11.find(({ pattern }) => pattern === i.pattern);
    if (typeof found !== "undefined") {
        i.replacement = found.replacement;
        console.log(i);
    }
}

fs.writeFileSync(
    "../data/not_tracked_2.json",
    JSON.stringify(unt, null, 2)
)