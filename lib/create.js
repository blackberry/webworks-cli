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
    exit            = require('exit'),
    fs              = require('fs'),
    help            = require("./help"),
    cordova         = require('cordova'),
    utils           = require('./utils/utils'),
    platform        = require("./platform"),
    DEFAULT_NAME    = "WebWorks Application";

/**
 * Usage:
 * create(args) - input from the CLI
 * create(dir) - creates in the specified directory
 * create(dir, id) - with specified id
 * create(dir, id, name) - with name
 * create(dir, id, name, template) - with template
 **/
module.exports = function create (dir, id, name, template, callback) {
    var args = Array.prototype.slice.call(arguments, 0),
        projectPath;

    if (args.length === 0) {
        console.error("Create command called incorrectly");
        help("create");
        exit(1);
    }

    if (typeof args[args.length-1] == 'function') {
        callback = args.pop();
    }

    projectPath = path.resolve(args[0]);
    if (fs.existsSync(projectPath)) {
        console.error("Cannot create a project at " + projectPath + ". Directory already exists.");
        exit(1);
    } else {

        dir = args.shift();
        id = args.shift();
        name = args.shift() || DEFAULT_NAME;
        template = args.shift();

        if (typeof callback !== "function") {
            callback = undefined;
        }

        var options = {
            id: id,
            name: name,
            lib: {
            }
        };

        if (template) {
            options.lib.www = {
                uri: path.resolve(template),
                id: 'custom',
                version: '0'
            }
        }

        cordova.create(
            dir,
            null,
            null,
            options,
            function (err) {
                if (!err && fs.existsSync(projectPath)) {
                    process.chdir(projectPath);
                    process.env.PWD = projectPath;
                    platform("add", ["blackberry10"]);
                }
                if (callback) {
                    callback(err);
                } else if (err) {
                    throw err;
                }
            }
        );
    }

};
