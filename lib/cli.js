var cordova                 = require('cordova'),
    cordovaCLI              = require('../node_modules/cordova/src/cli'),
    cordovaUtils            = require('../node_modules/cordova/src/util'),
    webworks                = require("../webworks"),
    path                    = require('path'),
    fs                      = require('fs'),
    shell                   = require('shelljs'),
    optimist                = require('optimist'),
    CORDOVA_BLACKBERRY_PATH = path.join(cordovaUtils.libDirectory, "blackberry10", "cordova", "3.0.0"),
    CHECK_REQS_PATH         = path.join(CORDOVA_BLACKBERRY_PATH, "bin", "check_reqs"),
    TARGET_PATH             = path.join(CORDOVA_BLACKBERRY_PATH, "bin", "lib", "target");  //CHANGE TO BIN SCRIPT

module.exports = function CLI(args) {
    process.argv = args || process.argv;

    var projectRoot = cordovaUtils.isCordova(process.cwd()),
        command = process.argv[2],
        projectPath,
        checkReqsResult,
        localArgs = optimist(process.argv)
                    .boolean("help")
                    .alias("h", "help")
                    .argv;

    if (fs.existsSync(CORDOVA_BLACKBERRY_PATH)) {
        checkReqsResult  = shell.exec(CHECK_REQS_PATH, {silent: true});
        if (checkReqsResult.code !== 0) {
            console.error(checkReqsResult.output);
            process.exit(checkReqsResult.code);
        }
    }

    if (localArgs.help || command == "help" || !command) {
        var helpOn = localArgs.help ? localArgs._[2] : process.argv;
        webworks.help(helpOn);
    } else if (command == "target"  && projectRoot) {
        process.argv.splice(1,1);
        require(TARGET_PATH);
    } else if (command == "create") {
        webworks.create(process.argv);
    } else if (command == "about") {
        shell.exec("cat " + path.join(__dirname, "logo.txt"));
    } else if (command == "ripple") {
        console.log("WHY??????");
    } else if (command == "plugin") {
        webworks.plugin(process.argv);
    } else {
        if (command == "serve" && args.length === 3) {
            process.argv.push("blackberry10");
        }
        new cordovaCLI(process.argv);
    }
};
