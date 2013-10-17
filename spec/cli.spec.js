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
var CLI = require("../lib/cli"),
    webworks = require("../webworks"),
    cordova = require("cordova"),
    path = require("path"),
    conf = require("../lib/utils/conf"),
    cordovaUtils = require(path.join(conf.NODE_MODULES_DIR,'cordova/src/util'));

describe("webworks cli", function () {

    beforeEach(function () {
        spyOn(cordova, "on");
        spyOn(process, "on");
    });

    describe("help", function () {
        beforeEach(function () {
            spyOn(webworks, "help");
        });

        it("will call help for undefined command", function () {
            new CLI(["node", "webworks"]);
            expect(webworks.help).toHaveBeenCalledWith(undefined);
        });

        it("will call help for the help command", function () {
            new CLI(["node", "webworks", "help"]);
            expect(webworks.help).toHaveBeenCalledWith(undefined);
        });

        it("will call help for the subject with the help command", function () {
            new CLI(["node", "webworks", "help", "subject"]);
            expect(webworks.help).toHaveBeenCalledWith("subject");
        });

        it("will call help on the command for args with a -h", function () {
            new CLI(["node", "webworks", "command", "one", "two", "-h", "three"]);
            expect(webworks.help).toHaveBeenCalledWith("command");
        });
    });

    describe("version", function () {
        beforeEach(function () {
            spyOn(webworks, "version");
        });

        it("will call version for version command", function () {
            new CLI(["node", "webworks", "version"]);
            expect(webworks.version).toHaveBeenCalled();
        });

        it("will call version for args with --version", function () {
            new CLI(["node", "webworks", "command", "--version"]);
            expect(webworks.version).toHaveBeenCalled();
        });

        it("will call help for args with a -v", function () {
            new CLI(["node", "webworks", "command", "one", "two", "-v", "three"]);
            expect(webworks.version).toHaveBeenCalled();
        });
    });

    describe("create", function () {
        beforeEach(function () {
            spyOn(webworks, "create");
        });

        it("will call cretae for create command", function () {
            new CLI(["node", "webworks", "create"]);
            expect(webworks.create).toHaveBeenCalled();
        });

        it("will call cretae with all args except --verbose", function () {
            new CLI(["node", "webworks","--verbose", "create", "one", "-d", "two", "three"]);
            expect(webworks.create).toHaveBeenCalledWith("one", "-d", "two", "three");
        });
    });

    describe("commands taking a list of targets", function () {
        var COMMANDS = ["platform", "plugin"];

        beforeEach(function () {
            COMMANDS.forEach(function (command) {
                spyOn(webworks, command);
            });
        });

        it("will call the commands with the first argument followed by the remaining in an array", function () {
            COMMANDS.forEach(function (command) {
                new CLI(["node", "webworks", command, "subCommand", "platform1", "platform2"]);
                expect(webworks[command]).toHaveBeenCalledWith("subCommand", ["platform1", "platform2"]);
            });
        });

        it("will call consume --verbose argument", function () {
            COMMANDS.forEach(function (command) {
                new CLI(["node", "webworks", "--verbose", command, "subCommand", "platform1", "-d", "platform2"]);
                expect(webworks[command]).toHaveBeenCalledWith("subCommand", ["platform1", "-d", "platform2"]);
            });
        });
    });

    describe("project commands with their own webworks version", function () {
        var IGNORE_LIST = ["help", "version", "create", "plugin", "platform"];

        function runTest (extraArgs, expectFunction) {
            spyOn(cordovaUtils, "isCordova").andReturn(true);
            spyOn(cordovaUtils, "listPlatforms").andReturn(["blackberry10", "ios", "android"]);
            Object.getOwnPropertyNames(webworks).forEach(function (wwCommand) {
                if (IGNORE_LIST.indexOf(wwCommand) === -1) {
                    spyOn(webworks, wwCommand);
                    new CLI(["node", "webworks", wwCommand].concat(extraArgs));
                    expectFunction(wwCommand);
                }
            });
        }

        it("will call commands with all non-cli arguments passed through", function () {
            runTest(["blackberry10", "-d", "abcd1234"], function (command) {
                expect(webworks[command]).toHaveBeenCalledWith({verbose: false, platforms: ["blackberry10"], options: ["-d", "abcd1234"]});
            });
        });

        it("will consume the first instance of --verbose", function () {
            runTest(["--verbose", "blackberry10", "-d", "abcd1234", "--verbose"], function (command) {
                expect(webworks[command]).toHaveBeenCalledWith({verbose: true, platforms: ["blackberry10"], options: ["-d", "abcd1234", "--verbose"]});
            });
        });
    });
});
