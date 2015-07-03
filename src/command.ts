module CaviarCli {
    export class Command {

        arguments: Array<string> = [];

        flags: Array<string> = [];

        constructor (args: Array<string>) {
            this.parseFlagsAndArguments(args);
        }

        protected hasFlag(flag: string) : boolean {
            return this.flags.indexOf(flag) >= 0;
        }

        public run () : void {

        }

        protected parseFlagsAndArguments (args: Array<string>) {
            var len: number = args.length,
                cur: string,
                x: number;

            for (x = 0; x < len; x += 1) {
                cur = args[x];

                if (cur.indexOf('--') === 0){
                    this.flags.push(cur);
                } else {
                    this.arguments.push(cur);
                }
            }
        }
    }
}