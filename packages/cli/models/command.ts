import { CommandWorkspace, CommandContext } from "./command.interface";

export abstract class Command {
    public workspace: CommandWorkspace;

    constructor(
        context: CommandContext
    ) {
        this.workspace = context.workspace;
    }
}