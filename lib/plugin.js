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
    pluginUtils             = require('./pluginUtils');

module.exports = function plugin(command, targets, callback) {

    var projectRoot = cordovaUtils.isCordova(process.cwd()),
        err;

    if (!projectRoot) {
        err = new Error('Current working directory is not a WebWorks-based project.');
        if (callback) return callback(err);
        else throw err;
    }

    //We were called directly from the CLI
    if (Array.isArray(command)) {
        if (typeof command[command.length -1] === "function") {
            callback = command.pop();
        }
        targets = command.slice(4);
        command = command[3];
    }

    if (command == "add") {
        targets = pluginUtils.updateTargets(targets);
    }

    cordova.plugin(command, targets, callback);

};
