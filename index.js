const target = require("./main_11.2.0.json");
const missing = require("./patches");

// @ts-check
function replaceGccDiagnostics(
    /** @type {string} */ val,
    /** @type {{ color: boolean } | undefined} */ options) {
    if (typeof options === "undefined") {
        options = {
            color: false
        };
    }

    let translation = [
        ...target,
        ...missing
    ].sort((a, b) => {
        return b.pattern.length - a.pattern.length
    });

    val = val.replace(/' \{aka '(.+?)'\}/g, " __AKA@$1@AKA__'");
    if (options.color === true) {
        val = val.replace(/'\x1b\[01m\x1b\[K(.+?)\x1b\[m\x1b\[K'/g, "__APOS@$1@APOS__")
        translation.forEach(v => {
            v.pattern = v.pattern.replace(/'(.+?)'/g, "__APOS@$1@APOS__");
        });
    }

    for (let i = 0; i < translation.length; i++) {
        const kv = translation[i];
        const regexp = new RegExp(kv.pattern, "g");
        val = val.replace(regexp, kv.replacement);
    }

    if (options.color === true) {
        val = val.replace(/'(.+?)'/g, "'\x1b[01m\x1b[K$1\x1b[m\x1b[K'")
    }
    val = val.replace(/ __AKA@(.+?)@AKA__'/g, "' {即 '$1'}");

    return val;
}

module.exports = {
    replaceGccDiagnostics
}