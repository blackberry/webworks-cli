/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/
var cordova                 = require('cordova'),
    cordovaUtils            = require('../node_modules/cordova/src/util'),
    conf                    = require("./conf"),
    path                    = require("path"),
    async                   = require("async"),
    utils                   = require("./utils"),
    DEFAULT_OPTIONS         = {platforms: [], options: ["--device"]};
    CORDOVA_BB_RUN          = path.join("platforms", "blackberry10", "cordova", "run");

module.exports = function run(options, callback) {
    var projectRoot = cordovaUtils.isCordova(process.cwd()),
        runTasks = [],
        bbRunArgs,
        platforms,
        cmd,
        err;

    if (!projectRoot) {
        err = new Error('Current working directory is not a WebWorks-based project.');
        if (callback) return callback(err);
        else throw err;
    }

    platforms = cordovaUtils.listPlatforms(projectRoot);
    options = options || DEFAULT_OPTIONS;

    //We came from the CLI
    if (Array.isArray(options)) {
        args = options.slice(3);
        if (args.length > 1 && typeof args[length - 1] === "function") {
            callback = args.pop();
        }
        options = DEFAULT_OPTIONS;
        // Filter all non-platforms into options
        args.forEach(function(option, index) {
            if (platforms.hasOwnProperty(option)) {
                options.platforms.push(option);
            } else {
                options.options.push(option);
            }
        });

    }

    if (!options.platforms || options.platforms.length === 0) {
        options.platforms = platforms;
    }

    if (options.platforms.indexOf("blackberry10") !== -1 || options.platforms.length > 1) {
        options.platforms = options.platforms.filter(function (platformName) { return platformName !== "blackberry10";});
        //If there are other platforms to be run
        if (options.platforms > 0) {
            runTasks.push(cordova.run.bind(this,options));
        } else {
            runTasks.push(cordova.prepare.bind(this));
        }

        bbRunArgs = options.options.slice(0);
        bbRunArgs.push("--query");

        runTasks.push(utils.spawn.bind(this, CORDOVA_BB_RUN, bbRunArgs, {cwd: projectRoot, stdio: "inherit", customOptions: {silent: true}}));

    } else {
        runTasks.push(cordova.run.bind(this,options));
    }

    async.series(
        runTasks,
        function (err, results) {
            if (callback) {
                callback(err || results);
            }
        }
    );

};
