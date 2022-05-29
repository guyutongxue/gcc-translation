// @ts-check
"use strict";

import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";

/** @type {Record<string, string[]>} */
const sources = {
  "11.2.0": [
    "11.2.0.json",
    "c-family_c-common.json",
    "cp_constranit.json",
    "cp_error.json",
  ],
  "12.1.0": [
    "help_spaces.json",
    "12.1.0.json",
    "c-family_c-common.json",
    "cp_error.json",
  ],
};

export function replaceGccDiagnostics(
  /** @type {string} */ val,
  /** @type {{ color: boolean, version: string } | undefined} */ options
) {
  const DEFAULT_OPTIONS = {
    color: false,
    version: "11.2.0",
  };
  if (typeof options === "undefined") {
    options = DEFAULT_OPTIONS;
  } else {
    options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
  }

  const translation = sources[options.version].flatMap((filename) => {
    const text = fs.readFileSync(
      path.join(fileURLToPath(import.meta.url), "../src", filename),
      "utf-8"
    );
    return JSON.parse(text).sort((a, b) => {
      return b.pattern.length - a.pattern.length;
    });
  });
  if (options.color === true) {
    val = val.replace(/'\x1b\[01m\x1b\[K(.+?)\x1b\[m\x1b\[K'/g, "'$1'");
  }
  val = val.replace(/' \{aka '(.+?)'\}/g, " __AKA@$1@AKA__'");

  for (const kv of translation) {
    const regexp = new RegExp(kv.pattern, "g");
    val = val.replace(regexp, kv.replacement);
  }

  val = val.replace(/ __AKA@(.+?)@AKA__'/g, "' {即 '$1'}");
  if (options.color === true) {
    // (?<!^ *\d* \|.*) means that quote's line should not start with
    // "   \d | "
    // which is a pretty-printed source code
    val = val.replace(
      /(?<!^ *\d* \|.*)'(.*?)'/gm,
      "'\x1b[01m\x1b[K$1\x1b[m\x1b[K'"
    );
  }

  return val;
}
