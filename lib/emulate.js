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
    path                    = require("path"),
    async                   = require("async"),
    utils                   = require("./utils/utils"),
    conf                    = require("./utils/conf"),
    cordovaUtils,
    DEFAULT_OPTIONS         = {platforms: [], options: ["--emulator"]};
    CORDOVA_BB_RUN          = path.join("platforms", "blackberry10", "cordova", "run");

try {
    cordovaUtils            = require(path.join(conf.NODE_MODULES_DIR, 'cordova', 'node_modules', 'cordova-lib', 'src', 'cordova', 'util'));
} catch (e) {
    cordovaUtils            = require(path.join(conf.NODE_MODULES_DIR, 'cordova', 'src', 'util'));
}

module.exports = function run(options, callback) {
    var projectRoot = cordovaUtils.isCordova(process.cwd()),
        runTasks = [],
        args;

    options = utils.preProcessOptions(options, callback, DEFAULT_OPTIONS);
    callback = options.callback;
    delete options.callback;

    if (options.platforms.indexOf("blackberry10") !== -1 || options.platforms.length > 1) {
        options.platforms = options.platforms.filter(function (platformName) { return platformName !== "blackberry10";});
        //If there are other platforms to be run
        if (options.platforms > 0) {
            runTasks.push(cordova.emulate.bind(this,options));
        } else {
            runTasks.push(cordova.prepare.bind(this));
        }

        args = options.options.slice(0);
        runTasks.push(utils.spawn.bind(this, path.join(projectRoot, CORDOVA_BB_RUN)  + (utils.isWindows() ? ".bat" : ""),
                                       args, {stdio: "inherit", _customOptions: {silent: true}}));

    } else {
        runTasks.push(cordova.emulate.bind(this,options));
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
