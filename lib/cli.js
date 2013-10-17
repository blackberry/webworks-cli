var cordova                 = require('cordova'),
    path                    = require('path'),
    fs                      = require('fs'),
    optimist                = require('optimist'),
    conf                    = require("./utils/conf"),
    cli_platforms           = require(path.join(conf.NODE_MODULES_DIR, 'cordova/platforms')),
    cordovaCLI              = require(path.join(conf.NODE_MODULES_DIR, 'cordova/src/cli')),
    cordovaUtils            = require(path.join(conf.NODE_MODULES_DIR, 'cordova/src/util')),
    webworks                = require("../webworks"),
    webworksUtils           = require("./utils/utils"),
    CORDOVA_BLACKBERRY_PATH = path.join(cordovaUtils.libDirectory, "blackberry10", "cordova", cli_platforms.blackberry10.version),
    TARGET_PATH             = path.join(CORDOVA_BLACKBERRY_PATH, "bin", "lib", "target");  //CHANGE TO BIN SCRIPT


function nonCLIEntry (opts) {
    cordova.on('results', console.log);
    process.on('uncaughtException', function(err){
        if (opts.verbose) {
            console.error(err.stack);
        } else {
            console.error(err);
        }
        process.exit(1);
    });
    if (opts.verbose) {
        cordova.on('log', console.log);
        cordova.on('warn', console.warn);
    }
}

module.exports = function CLI(args) {
    process.argv = args || process.argv;

    //Optimist settings must match those of cordova
    var opts = optimist(process.argv)
                    .boolean("help")
                    .alias("h", "help")
                    .boolean("verbose")
                    .boolean("version")
                    .alias("v", "version")
                    .argv,
        filteredOpts = process.argv.slice(2),
        command,
        projectPath,
        checkReqsResult;

    //Prefetch data
    webworksUtils.fetchBlackBerry();
    //Filter verbose from the arguments
    if (opts.verbose) {
        if (filteredOpts.indexOf("--verbose") !== -1) {
            filteredOpts.splice(filteredOpts.indexOf("--verbose"), 1);
        }
    }

    command = filteredOpts.shift();

    if (opts.help || command === "help" || !command) {
        if (command === "help") {
            //If the user typed webworks help then likely the next arg is the subject
            command = filteredOpts[0];
        }
        //Otherwise the current command is as good a guess as any.
        webworks.help(command);
    } else if (opts.version || command === "version") {
        webworks.version();
    } else if (command == "target") {
        process.argv.splice(1,1);
        require(TARGET_PATH);
    } else if (command == "about") {
        console.log(fs.readFileSync(path.join(__dirname, "logo.txt")).toString());
    } else if (command === "create") {
        nonCLIEntry(opts);
        webworks.create.apply(this, filteredOpts);
    } else if (command === "platform" || command === "plugin") {
        nonCLIEntry(opts);
        webworks[command](filteredOpts.shift(), filteredOpts);
    } else if (webworks[command]) {
        //project commands that we override
        nonCLIEntry(opts);
        //push verbose back on instead of sending a re-sliced
        //args incase verbose was in a bizaare location
        if (opts.verbose) {
            filteredOpts.push("--verbose");
        }
        webworks[command](webworksUtils.preProcessOptions(filteredOpts));
    } else {
        if (command == "serve" && args.length === 3) {
            process.argv.push("blackberry10");
        }
        new cordovaCLI(process.argv);
    }
};
