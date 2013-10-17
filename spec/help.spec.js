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
var webworks = require('../webworks'),
    fs = require("fs"),
    path = require("path"),
    HELP_PATH = path.join(__dirname, "..", "res", "help");

describe('help', function() {
    beforeEach(function () {
        spyOn(fs, "readFileSync").andReturn({toString:function () {}});
        spyOn(console, "log");
    });

    it('should require the default help with no arguments', function () {
        webworks.help();
        expect(fs.readFileSync).toHaveBeenCalledWith(HELP_PATH + path.sep + "default.txt");
    });

    it('should attempt to load the help for the argument provided', function () {
        spyOn(fs, "existsSync");
        webworks.help("foo");
        expect(fs.existsSync).toHaveBeenCalledWith(HELP_PATH + path.sep + "foo.txt");
    });
});
