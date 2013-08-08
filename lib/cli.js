var optimist                = require('optimist'),
    cordova                 = require('cordova'),
    cordovaCLI              = require('../node_modules/cordova/src/cli'),
    cordovaUtils            = require('../node_modules/cordova/src/util'),
    path                    = require('path'),
    fs                      = require('fs'),
    shell                   = require('shelljs'),
    CORDOVA_BLACKBERRY_PATH = path.join(cordovaUtils.libDirectory, "blackberry10", "cordova", "3.0.0"),
    CHECK_REQS_PATH         = path.join(CORDOVA_BLACKBERRY_PATH, "bin", "check_reqs"),
    TARGET_PATH             = path.join(CORDOVA_BLACKBERRY_PATH, "bin", "lib", "target");  //CHANGE TO BIN SCRIPT

module.exports = function CLI(args) {
    args = args || process.argv;

    var projectRoot = cordovaUtils.isCordova(process.cwd()),
        command = args[2],
        projectPath,
        checkReqsResult;

    if (fs.existsSync(CORDOVA_BLACKBERRY_PATH)) {
        checkReqsResult  = shell.exec(CHECK_REQS_PATH, {silent: true});
        if (checkReqsResult.code !== 0) {
            console.error(checkReqsResult.output);
            process.exit(checkReqsResult.code);
        }
    }

    if (command == "target"  && projectRoot) {
        process.argv.splice(1,1);
        require(TARGET_PATH);
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
    } else if (command == "about") {
        shell.exec("cat " + path.join(__dirname, "logo.txt"));
    } else if (command == "ripple") {
        console.log("WHY??????");
    } else {
        if (command == "serve" && args.length === 3) {
            process.argv.push("blackberry10");
        }
        new cordovaCLI(process.argv);
    }
};
