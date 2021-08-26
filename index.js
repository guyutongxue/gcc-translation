const target = require("./main_11.2.0.json");
const missing = require("./patches");
const translation = [
    ...target,
    ...missing
].sort((a, b) => {
    return b.pattern.length - a.pattern.length
});

function replaceGccDiagnostics(/** @type {string} */ val) {
    
    val = val.replace(/' \{aka '(.+?)'\}/g, " __AKA@$1@AKA__'");

    for (let i = 0; i < translation.length; i++) {
        const kv = translation[i];
        const regexp = new RegExp(kv.pattern, "g");
        val = val.replace(regexp, kv.replacement);
    }

    val = val.replace(/ __AKA@(.+?)@AKA__'/g, "' {即 '$1'}");

    return val;
}

module.exports = {
    replaceGccDiagnostics
}