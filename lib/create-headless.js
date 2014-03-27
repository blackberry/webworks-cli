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
    help            = require("./help"),
    create          = require("./create"),
    plugin          = require("./plugin"),
    async           = require("async"),
    wrench          = require("wrench"),
    DEFAULT_ID    = "com.example.HeadlessUI",
    DEFAULT_NAME    = "Headless WebWorks Application";

/**
 * Usage:
 * createHeadless(args) - input from the CLI
 * createHeadless(dir) - creates in the specified directory
 **/
module.exports = function createHeadless (dir, callback) {
    var args = Array.prototype.slice.call(arguments, 0),
        dir = args.shift(),
        template = path.join(__dirname, "..", "templates/headless-template/www/");

    if (!dir) {
        help("create-headless");
        process.exit(0);
    }

    if (typeof args[args.length-1] == 'function') {
        callback = args.pop();
    } else {
        callback = undefined;
    }

    async.series([
        function(asyncCallback) {
            //webworks create using headless template
            create(dir, DEFAULT_ID, DEFAULT_NAME, template, function() {
                asyncCallback();
            });
        },
        function(asyncCallback) {
            var headlessNativeApp = path.join(__dirname, "..", "templates/headless-template/native");

            //copy momentics headless project into app root
            wrench.copyDirRecursive(headlessNativeApp, path.resolve("HeadlessService"), { excludeHiddenUnix: false }, function() {
                asyncCallback();
            });
        },
        function(asyncCallback) {
            //add com.blackberry.invoke plugin
            plugin.apply(this,["add", "com.blackberry.invoke"]);
            asyncCallback();
        }
    ],
    function(err, results) {
        if (callback) {
            callback(err || results);
        }
    });
};
