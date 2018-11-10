export interface CommandWorkspace {
    root: string;
    configFile?: string;
}

export interface CommandContext {
    workspace: CommandWorkspace;
}

export type Value = string | number | boolean | ( string | number | boolean )[];

export interface CommandArguments {
    [argName: string]: Value | undefined;
}

export interface CommandInterface<T extends CommandArguments> {
    printHelp(args: T): Promise<any>;
    validateArguments(args: T): Promise<any>;
    run(args: T): Promise<any>;
}