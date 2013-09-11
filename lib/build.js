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
    CORDOVA_BB_BUILD          = path.join("platforms", "blackberry10", "cordova", "build");

module.exports = function run(options, callback) {
    var projectRoot = cordovaUtils.isCordova(process.cwd()),
        runTasks = [],
        args;

    options = utils.preProcessOptions(options, callback);
    callback = options.callback;
    delete options.callback;

    if (options.platforms.indexOf("blackberry10") !== -1 || options.platforms.length > 1) {
        options.platforms = options.platforms.filter(function (platformName) { return platformName !== "blackberry10";});
        //If there are other platforms to be run
        if (options.platforms > 0) {
            runTasks.push(cordova.build.bind(this,options));
        } else {
            runTasks.push(cordova.prepare.bind(this));
        }

        args = options.options.slice(0);
        if (args.indexOf("--query") === -1) {
            args.push("--query");
        }

        runTasks.push(utils.spawn.bind(this, path.join(projectRoot, CORDOVA_BB_BUILD)  + (utils.isWindows() ? ".bat" : ""),
                                       args, {stdio: "inherit", _customOptions: {silent: true}}));

    } else {
        runTasks.push(cordova.build.bind(this,options));
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
