#!/usr/bin/env node

const [,, ...args] = process.argv;

export function newStylesFolder() {
    console.log(`==== ${args} =====`);
    console.log(`==== CWD: ${ process.cwd() } ====`);
}