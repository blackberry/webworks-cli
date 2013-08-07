var optimist      = require('optimist'),
    cordova       = require('cordova'),
    cordovaCLI    = require('../node_modules/cordova/src/cli'),
    cordovaUtils  = require('../node_modules/cordova/src/util'),
    path          = require('path'),
    fs            = require('fs'),
    TARGET_SCRIPT = path.join("platforms", "blackberry10", "cordova", "lib", "target");  //CHANGE TO BIN SCRIPT

module.exports = function CLI(args) {
    args = args || process.argv;

    var projectRoot = cordovaUtils.isCordova(process.cwd()),
        command = args[2],
        projectPath;

    //TODO: Run CheckReqs from bin first

    if (command == "target"  && projectRoot) {
        process.argv.splice(1,1);
        require(path.join(projectRoot, TARGET_SCRIPT));
    } else if (command == "create") {
        projectPath = path.resolve(process.argv[3]);
        if (fs.existsSync(projectPath)) {
            console.log("Cannot create a project at " + projectPath + ". Directory already exists.");
        } else {
            new cordovaCLI(process.argv);
            if (fs.existsSync(projectPath)) {
                process.chdir(projectPath);
                cordova.platform("add", "blackberry10");
            }
        }
    } else {
        new cordovaCLI(process.argv);
    }
};
