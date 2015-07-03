/// <reference path="command.ts" />
/// <reference path="commands/create.ts" />
/// <reference path="commands/controller.ts" />
/// <reference path="commands/model.ts" />
/// <reference path="commands/view.ts" />
/// <reference path="commands/plugin.ts" />
/// <reference path="commands/help.ts" />

module CaviarCli {
    export class CommandParser {
        command: string = null;

        arguments: Array<string> = [];

        commands: Array<string> = [
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

        constructor (args: Array<string>) {
            this.arguments = args.slice(3);
            this.command = args[2] || null;
        }

        isValidCommand () : boolean {
            return this.command !== null && this.commands.indexOf(this.command) >= 0;
        }

        getCommand () : Command {
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
        }
    }
}