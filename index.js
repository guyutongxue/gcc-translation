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

    if (options.color === true) {
        val = val.replace(/'\x1b\[01m\x1b\[K(.+?)\x1b\[m\x1b\[K'/g, "'$1'")
    }
    val = val.replace(/' \{aka '(.+?)'\}/g, " __AKA@$1@AKA__'");

    for (let i = 0; i < translation.length; i++) {
        const kv = translation[i];
        const regexp = new RegExp(kv.pattern, "g");
        val = val.replace(regexp, kv.replacement);
    }

    val = val.replace(/ __AKA@(.+?)@AKA__'/g, "' {即 '$1'}");
    if (options.color === true) {
        // (?<!^ *\d* \|.*) means that quote's line should not start with
        // "   \d | "
        // which is a pretty-printed source code
        val = val.replace(/(?<!^ *\d* \|.*)'(.*?)'/gm, "'\x1b[01m\x1b[K$1\x1b[m\x1b[K'")
    }

    return val;
}

module.exports = {
    replaceGccDiagnostics
}