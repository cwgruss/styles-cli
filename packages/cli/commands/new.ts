import { isDirectory } from "../core/node/fs";
import { mkdirSync } from "../core/util";
import { stringToFileBuffer, fileBufferToString } from "../core/node/virtual-fs/buffer";
import { FileBuffer } from "../core/node/virtual-fs/file";
import { relative } from "../core/node/virtual-fs/path";
import { SimpleMemoryHost } from "../core/node/virtual-fs/memory";

const [,, ...args] = process.argv;

export function newStylesFolder() {
    console.log(`==== ${args} =====`);
    console.log(`==== CWD: ${ process.cwd() } ====`);
    const newDir: string = `${process.cwd()}/${args[0]}`;
    if(!isDirectory(newDir)) {
        const host = new SimpleMemoryHost();
        host.write(`${newDir}/text.scss`, stringToFileBuffer('Hello World')).toPromise()
            .then(_ =>{
                setTimeout((_) => {
                    host.read(`${newDir}/text.scss`).subscribe((file: FileBuffer) => {
                        const content = fileBufferToString(file);
                        console.log(content);
                    })
                }, 1000);
            });

    }else {
        throw new Error(`${newDir} already exists.`)
    }
    console.log(newDir);
}