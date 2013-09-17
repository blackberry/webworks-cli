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
var path            = require('path'),
    fs              = require('fs'),
    help            = require("./help"),
    cordova         = require('cordova'),
    utils           = require('./utils'),
    platform        = require("./platform"),
    DEFAULT_NAME    = "WebWorks Application",
    DEFAULT_ID      = "webworks.default";

/**
 * Usage:
 * create(args) - input from the CLI
 * create(dir) - creates in the specified directory
 * create(dir, name) - as above, but with specified name
 * create(dir, id, name) - you get the gist
 **/
module.exports = function create (dir, id, name) {
    if (arguments.length === 0) {
        return help("create");
    }

    var args = Array.prototype.slice.call(arguments, 0),
        projectPath,
        callback;

    //We came from the CLI
    if (Array.isArray(dir)) {
        //Chop off node webworks create
        args = dir.slice(3);
    }

    if (typeof args[args.length-1] == 'function') {
        callback = args.pop();
    }

    projectPath = path.resolve(args[0]);
    if (fs.existsSync(projectPath)) {
        console.log("Cannot create a project at " + projectPath + ". Directory already exists.");
    } else {

        if (args.length == 1) {
            dir = args.shift();
            id = DEFAULT_ID;
            name = DEFAULT_NAME;
        } else if (args.length == 2) {
            dir = args.shift();
            id = args.shift();
            name = DEFAULT_NAME;
        } else {
            dir = args.shift();
            id = args.shift();
            name = args.shift();
        }

        cordova.create(
            dir,
            id,
            name,
            function (err) {
                if (!err && fs.existsSync(projectPath)) {
                    process.chdir(projectPath);
                    platform("add", ["blackberry10"]);
                }
                if (callback) callback();
            }
        );
    }

};
