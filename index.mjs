// @ts-check
"use strict";

const ASSERTION = (() => {
  // @ts-ignore
  if (import.meta.env) {
    // Vite
    return undefined;
  } else {
    // Node
    return  {
      assert: {
        type: "json",
      },
    };
  }
})();

function loadSource(/** @type {string} */ version) {
  const sources = [];
  switch (version) {
    case "11.2.0": {
      sources.push(
        import("./src/11.2.0.json", ASSERTION),
        import("./src/c-family_c-common.json", ASSERTION),
        import("./src/cp_constranit.json", ASSERTION),
        import("./src/cp_error.json", ASSERTION)
      );
      break;
    }
    case "12.1.0": {
      sources.push(
        import("./src/help_spaces.json", ASSERTION),
        import("./src/12.1.0.json", ASSERTION),
        import("./src/c-family_c-common.json", ASSERTION),
        import("./src/cp_error.json", ASSERTION)
      );
      break;
    }
  }
  return Promise.all(sources).then((v) =>
    v.flatMap((source) =>
      source.default.sort((a, b) => {
        return b.pattern.length - a.pattern.length;
      })
    )
  );
}

export async function replaceGccDiagnostics(
  /** @type {string} */ val,
  /** @type {Partial<import(".").ReplaceOption> | undefined} */ options
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

  const translation = await loadSource(options.version);
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
