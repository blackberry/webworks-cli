var optimist      = require('optimist'),
    cordova       = require('cordova'),
    cordovaCLI    = require('../node_modules/cordova/src/cli'),
    cordovaUtils  = require('../node_modules/cordova/src/util'),
    path          = require('path'),
    TARGET_SCRIPT = path.join("platforms", "blackberry10", "cordova", "lib", "target");

module.exports = function CLI(args) {
    args = args || process.argv;

    console.log(args);

    var projectRoot = cordovaUtils.isCordova(process.cwd()),
        command = args[2],
        projectPath;


    console.log(command);

    if (command == "target"  && projectRoot) {
        process.argv.splice(1,1);
        require(path.join(projectRoot, TARGET_SCRIPT));
    } else {
        new cordovaCLI(process.argv);
        if (command == "create") {
            projectPath = path.resolve(args[3]);
            console.log("Project Path ", projectPath);
            process.chdir(projectPath);
            cordova.platform("add", "blackberry10");
        }
    }
};
