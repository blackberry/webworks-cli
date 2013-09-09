var cordova                 = require('cordova'),
    cordovaCLI              = require('../node_modules/cordova/src/cli'),
    cordovaUtils            = require('../node_modules/cordova/src/util'),
    webworks                = require("../webworks"),
    path                    = require('path'),
    fs                      = require('fs'),
    optimist                = require('optimist'),
    cli_platforms           = require('../node_modules/cordova/platforms'),
    utils                   = require("./utils"),
    CORDOVA_BLACKBERRY_PATH = path.join(cordovaUtils.libDirectory, "blackberry10", "cordova", cli_platforms.blackberry10.version),
    TARGET_PATH             = path.join(CORDOVA_BLACKBERRY_PATH, "bin", "lib", "target");  //CHANGE TO BIN SCRIPT


function nonCLIEntry () {
    cordova.on('results', console.log);
    process.on('uncaughtException', function(err){
        //TODO: Print the full trace when we handle verbosity
        console.error(err);
        process.exit(1);
    });
}

module.exports = function CLI(args) {
    process.argv = args || process.argv;

    var command = process.argv[2],
        projectPath,
        checkReqsResult,
        localArgs = optimist(process.argv)
                    .boolean("help")
                    .alias("h", "help")
                    .argv;

    //Prefetch data
    utils.fetchBlackBerry();

    if (localArgs.help || command == "help" || !command) {
        var helpOn = localArgs.help ? localArgs._[2] : process.argv;
        webworks.help(helpOn);
    } else if (command == "target") {
        process.argv.splice(1,1);
        require(TARGET_PATH);
    } else if (command == "about") {
        console.log(fs.readFileSync(path.join(__dirname, "logo.txt")).toString());
    } else if (webworks[command]) {
        nonCLIEntry();
        webworks[command](process.argv);
    } else {
        if (command == "serve" && args.length === 3) {
            process.argv.push("blackberry10");
        }
        new cordovaCLI(process.argv);
    }
};
