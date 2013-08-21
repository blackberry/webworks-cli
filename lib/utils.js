/*
 *  Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require('fs'),
    path = require('path'),
    wrench = require('wrench'),
    conf = require("./conf"),
    CORDOVA_DIR = '.cordova',
    _self;

_self = {
    findHomePath : function () {
        return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    },

    getCordovaDir: function () {
        var cordovaPath = path.join(_self.findHomePath(), CORDOVA_DIR);

        if (!fs.existsSync(cordovaPath)) {
            fs.mkdirSync(cordovaPath);
        }

        return cordovaPath;
    },

    quotify : function (property) {
        //wrap in quotes if it's not already wrapped
        if (property.indexOf("\"") === -1) {
            return "\"" + property + "\"";
        } else {
            return property;
        }
    },

    fetchBlackBerry: function () {
        var cli_platforms = require('../node_modules/cordova/platforms'),
            bbVersion = cli_platforms.blackberry10.version,
            wwwVersion = cli_platforms.www.version,
            cliBBLib = path.join(_self.getCordovaDir(), "lib", "blackberry10", "cordova", bbVersion ),
            cliWWWLib = path.join(_self.getCordovaDir(), "lib", "www", "cordova", wwwVersion );

        if (!fs.existsSync(cliBBLib)) {
            wrench.mkdirSyncRecursive(cliBBLib, 0775);
            wrench.copyDirSyncRecursive(conf.CORDOVA_BB_DIR, cliBBLib);

            //Re-Adding execution permissions
            wrench.chmodSyncRecursive(path.join(cliBBLib, "bin"), 0775);
        }

        if (!fs.existsSync(cliWWWLib)) {
            wrench.mkdirSyncRecursive(cliWWWLib, 0775);
            wrench.copyDirSyncRecursive(conf.CORDOVA_HELLO_WORLD_DIR, cliWWWLib);
        }
    }
};

module.exports = _self;
