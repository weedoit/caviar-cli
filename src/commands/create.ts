/// <reference path="../command.ts" />
module CaviarCli.Commands {
    var colors = require('colors');

    export class Create extends CaviarCli.Command {
        bundle: string = null;

        name: string = null;

        path: string = null;

        platforms: Array<string> = [];

        run () {
            var that = this,
                git = require("nodegit");

            this.parseParams();

            if (this.validateParams()) {
                console.log(colors.green('Downloading Caviar source files...'));

                return this.downloadFiles(function () {
                    that.downloadBowerDependencies(function () {
                        if(that.hasFlag('--with-cordova')) {
                            that.createCordovaProject(function () {
                                console.log(colors.green('Done!'));
                            });
                        } else {
                            that.buildManifestFile(function () {
                                console.log(colors.green('Done!'));
                            });
                        }
                    });
                });
            }
        }

        parseParams () {
            this.path = this.arguments[0] || null;
            this.bundle = this.arguments[1] || null;
            this.name = this.arguments[2] || null;

            if (this.hasFlag('--ios')) {
                this.platforms.push('ios');
            }

            if (this.hasFlag('--android')) {
                this.platforms.push('android');
            }
        }

        validateParams () : boolean {
            return this.path !== null;
        }

        downloadFiles (callback: Function, error?: Function) : void {
            var ghdownload = require('github-download');

            ghdownload('https://github.com/weedoit/caviar', this.path)
                .on('error', error || function () {})
                .on('end', callback);
        }

        downloadBowerDependencies (callback: Function) {
            console.log(colors.green('Downloading Bower dependencies...'));
            this.exec('cd ' + this.path + ' && bower install', callback);
        }

        buildManifestFile (callback: Function) : void {
            var that = this,
                fs = require('fs'),
                manifestFilePath = this.path + '/.caviar';

            console.log(colors.green('Buildding manifest file...'));

            fs.readFile(manifestFilePath, function (err, data) {
                if (err) throw err;

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
                    if (err) throw err;
                    callback();
                });
            });
        }

        createCordovaProject (callback: Function) {
            var commands: Array<String> = [];
            commands.push('cordova create ' + this.path + '/.cordova ' + this.bundle + ' ' + this.name);

            if (this.platforms.length > 0) {
                commands.push('cd ' + this.path + '/.cordova');
                commands.push('cordova platform add ' + this.platforms.join(' '));
            }

            console.log(colors.green('Building Cordova project...'));
            this.exec(commands.join(' && '), callback);
        }

        exec (command: string, callback: Function) {
            var sys = require('sys'),
                exec = require('child_process').exec,
                puts: Function;

            puts = function (error, stdout, stderr) {
                if (error === null) {
                    callback();
                } else {
                    sys.puts(stderr);
                }
            }

            exec(command, puts);
        }
    }
}