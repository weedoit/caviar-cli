/// <reference path="typings/node/node.d.ts" />
/// <reference path="parser.ts" />


module CaviarCli {

    export function run () {
        var parser: CommandParser = new this.CommandParser(process.argv),
            command: Command;

        if (parser.isValidCommand()) {
            command = parser.getCommand();
            command.run();
        }
    }

}

CaviarCli.run();