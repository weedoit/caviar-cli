var CaviarCli;
(function (CaviarCli) {
    var Command = (function () {
        function Command(args) {
            this.arguments = [];
            this.flags = [];
            this.parseFlagsAndArguments(args);
        }
        Command.prototype.hasFlag = function (flag) {
            return this.flags.indexOf(flag) >= 0;
        };
        Command.prototype.run = function () {
        };
        Command.prototype.parseFlagsAndArguments = function (args) {
            var len = args.length, cur, x;
            for (x = 0; x < len; x += 1) {
                cur = args[x];
                if (cur.indexOf('--') === 0) {
                    this.flags.push(cur);
                }
                else {
                    this.arguments.push(cur);
                }
            }
        };
        return Command;
    })();
    CaviarCli.Command = Command;
})(CaviarCli || (CaviarCli = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../command.ts" />
var CaviarCli;
(function (CaviarCli) {
    var Commands;
    (function (Commands) {
        var Controller = (function (_super) {
            __extends(Controller, _super);
            function Controller() {
                _super.apply(this, arguments);
            }
            Controller.prototype.run = function () {
            };
            return Controller;
        })(CaviarCli.Command);
        Commands.Controller = Controller;
    })(Commands = CaviarCli.Commands || (CaviarCli.Commands = {}));
})(CaviarCli || (CaviarCli = {}));
/// <reference path="../command.ts" />
var CaviarCli;
(function (CaviarCli) {
    var Commands;
    (function (Commands) {
        var colors = require('colors');
        var Create = (function (_super) {
            __extends(Create, _super);
            function Create() {
                _super.apply(this, arguments);
                this.bundle = null;
                this.name = null;
                this.path = null;
                this.platforms = [];
            }
            Create.prototype.run = function () {
                var that = this, git = require("nodegit");
                this.parseParams();
                if (this.validateParams()) {
                    console.log(colors.green('Downloading Caviar source files...'));
                    return this.downloadFiles(function () {
                        that.downloadBowerDependencies(function () {
                            if (that.hasFlag('--with-cordova')) {
                                that.createCordovaProject(function () {
                                    console.log(colors.green('Done!'));
                                });
                            }
                            else {
                                that.buildManifestFile(function () {
                                    console.log(colors.green('Done!'));
                                });
                            }
                        });
                    });
                }
            };
            Create.prototype.parseParams = function () {
                this.path = this.arguments[0] || null;
                this.bundle = this.arguments[1] || null;
                this.name = this.arguments[2] || null;
                if (this.hasFlag('--ios')) {
                    this.platforms.push('ios');
                }
                if (this.hasFlag('--android')) {
                    this.platforms.push('android');
                }
            };
            Create.prototype.validateParams = function () {
                return this.path !== null;
            };
            Create.prototype.downloadFiles = function (callback, error) {
                var ghdownload = require('github-download');
                ghdownload('https://github.com/weedoit/caviar', this.path).on('error', error || function () {
                }).on('end', callback);
            };
            Create.prototype.downloadBowerDependencies = function (callback) {
                console.log(colors.green('Downloading Bower dependencies...'));
                this.exec('cd ' + this.path + ' && bower install', callback);
            };
            Create.prototype.buildManifestFile = function (callback) {
                var that = this, fs = require('fs'), manifestFilePath = this.path + '/.caviar';
                console.log(colors.green('Buildding manifest file...'));
                fs.readFile(manifestFilePath, function (err, data) {
                    if (err)
                        throw err;
                    var content = data.toString();
                    if (that.name !== null) {
                        content = content.replace(/(name:\s")(.*)(")/, '$1' + that.name + '$3');
                    }
                    if (that.bundle !== null) {
                        content = content.replace(/(bundle:\s")(.*)(")/, '$1' + that.bundle + '$3');
                    }
                    if (that.platforms.length > 0) {
                        content = content.replace(/(platforms:\s)(\[\])/, '$1' + JSON.stringify(that.platforms));
                    }
                    fs.writeFile(manifestFilePath, content, function (err) {
                        if (err)
                            throw err;
                        callback();
                    });
                });
            };
            Create.prototype.createCordovaProject = function (callback) {
                var commands = [];
                commands.push('cordova create ' + this.path + '/.cordova ' + this.bundle + ' ' + this.name);
                if (this.platforms.length > 0) {
                    commands.push('cd ' + this.path + '/.cordova');
                    commands.push('cordova platform add ' + this.platforms.join(' '));
                }
                console.log(colors.green('Building Cordova project...'));
                this.exec(commands.join(' && '), callback);
            };
            Create.prototype.exec = function (command, callback) {
                var sys = require('sys'), exec = require('child_process').exec, puts;
                puts = function (error, stdout, stderr) {
                    if (error === null) {
                        callback();
                    }
                    else {
                        sys.puts(stderr);
                    }
                };
                exec(command, puts);
            };
            return Create;
        })(CaviarCli.Command);
        Commands.Create = Create;
    })(Commands = CaviarCli.Commands || (CaviarCli.Commands = {}));
})(CaviarCli || (CaviarCli = {}));
/// <reference path="../command.ts" />
var CaviarCli;
(function (CaviarCli) {
    var Commands;
    (function (Commands) {
        var Help = (function (_super) {
            __extends(Help, _super);
            function Help() {
                _super.apply(this, arguments);
            }
            Help.prototype.run = function () {
            };
            return Help;
        })(CaviarCli.Command);
        Commands.Help = Help;
    })(Commands = CaviarCli.Commands || (CaviarCli.Commands = {}));
})(CaviarCli || (CaviarCli = {}));
/// <reference path="../command.ts" />
var CaviarCli;
(function (CaviarCli) {
    var Commands;
    (function (Commands) {
        var Model = (function (_super) {
            __extends(Model, _super);
            function Model() {
                _super.apply(this, arguments);
            }
            Model.prototype.run = function () {
            };
            return Model;
        })(CaviarCli.Command);
        Commands.Model = Model;
    })(Commands = CaviarCli.Commands || (CaviarCli.Commands = {}));
})(CaviarCli || (CaviarCli = {}));
/// <reference path="../command.ts" />
var CaviarCli;
(function (CaviarCli) {
    var Commands;
    (function (Commands) {
        var Plugin = (function (_super) {
            __extends(Plugin, _super);
            function Plugin() {
                _super.apply(this, arguments);
            }
            Plugin.prototype.run = function () {
            };
            return Plugin;
        })(CaviarCli.Command);
        Commands.Plugin = Plugin;
    })(Commands = CaviarCli.Commands || (CaviarCli.Commands = {}));
})(CaviarCli || (CaviarCli = {}));
/// <reference path="../command.ts" />
var CaviarCli;
(function (CaviarCli) {
    var Commands;
    (function (Commands) {
        var View = (function (_super) {
            __extends(View, _super);
            function View() {
                _super.apply(this, arguments);
            }
            View.prototype.run = function () {
            };
            return View;
        })(CaviarCli.Command);
        Commands.View = View;
    })(Commands = CaviarCli.Commands || (CaviarCli.Commands = {}));
})(CaviarCli || (CaviarCli = {}));
/// <reference path="command.ts" />
/// <reference path="commands/create.ts" />
/// <reference path="commands/controller.ts" />
/// <reference path="commands/model.ts" />
/// <reference path="commands/view.ts" />
/// <reference path="commands/plugin.ts" />
/// <reference path="commands/help.ts" />
var CaviarCli;
(function (CaviarCli) {
    var CommandParser = (function () {
        function CommandParser(args) {
            this.command = null;
            this.arguments = [];
            this.commands = [
                'create',
                'controller',
                'c',
                'model',
                'm',
                'view',
                'v',
                'plugin',
                'p',
                'help',
                'h'
            ];
            this.arguments = args.slice(3);
            this.command = args[2] || null;
        }
        CommandParser.prototype.isValidCommand = function () {
            return this.command !== null && this.commands.indexOf(this.command) >= 0;
        };
        CommandParser.prototype.getCommand = function () {
            var Commands = CaviarCli.Commands;
            switch (this.command) {
                case 'create':
                    return new Commands.Create(this.arguments);
                case 'controller':
                case 'c':
                    return new Commands.Controller(this.arguments);
                case 'model':
                case 'm':
                    return new Commands.Model(this.arguments);
                case 'view':
                case 'v':
                    return new Commands.View(this.arguments);
                case 'plugin':
                case 'p':
                    return new Commands.Plugin(this.arguments);
                case 'h':
                case 'help':
                    return new Commands.Help(this.arguments);
            }
            return null;
        };
        return CommandParser;
    })();
    CaviarCli.CommandParser = CommandParser;
})(CaviarCli || (CaviarCli = {}));
/// <reference path="typings/node/node.d.ts" />
/// <reference path="parser.ts" />
var CaviarCli;
(function (CaviarCli) {
    function run() {
        var parser = new this.CommandParser(process.argv), command;
        if (parser.isValidCommand()) {
            command = parser.getCommand();
            command.run();
        }
    }
    CaviarCli.run = run;
})(CaviarCli || (CaviarCli = {}));
CaviarCli.run();
