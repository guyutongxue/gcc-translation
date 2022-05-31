export interface ReplaceOption {
  color: boolean;
  version: string;
}

function loadSource(version: string) {
  const sources = [];
  switch (version) {
    case "11.2.0": {
      sources.push(
        import("./data/11.2.0.json"),
        import("./data/c-family_c-common.json"),
        import("./data/cp_constranit.json"),
        import("./data/cp_error.json")
      );
      break;
    }
    case "12.1.0": {
      sources.push(
        import("./data/help_spaces.json"),
        import("./data/12.1.0.json"),
        import("./data/c-family_c-common.json"),
        import("./data/cp_error.json")
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
  val: string,
  opt: Partial<ReplaceOption> = {}
) {
  const DEFAULT_OPTIONS = {
    color: false,
    version: "11.2.0",
  };
  const options = {
    ...DEFAULT_OPTIONS,
    ...opt,
  };

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
