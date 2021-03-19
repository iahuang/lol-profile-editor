const fse = require("fs-extra");
console.log("Copying static files...");
const srcDir = `client/static`;
const destDir = `build/static`;
fse.copySync(srcDir, destDir);
fse.copySync("build/client/bundle.js", "build/static/bundle.js")
