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
    version         = require("./version"),
    help            = require("./help"),
    cordova         = require('cordova'),
    utils           = require('./utils'),
    conf            = require("./conf"),
    shell           = require('shelljs');


/**
 * Usage:
 * create(args) - input from the CLI
 * create(dir) - creates in the specified directory
 * create(dir, name) - as above, but with specified name
 * create(dir, id, name) - you get the gist
 **/
module.exports = function create (dir) {
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

        args.push(function (err) {
            if (!err && fs.existsSync(projectPath)) {
                process.chdir(projectPath);
                cordova.platform("add", "blackberry10");
            }
            if (callback) callback();
        });

        cordova.create.apply(this, args);
    }

};
