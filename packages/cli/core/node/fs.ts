import { statSync, Stats } from "fs";


export function isFile(filePath: string): boolean {
    let stat: Stats;
    try {
        stat = statSync(filePath);
        return stat.isFile() || stat.isFIFO();
    }catch(error) {
        if(error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) {
            return false;
        }
        throw error;
    }
}

export function isDirectory(filePath: string): boolean {
    let stat: Stats;
    try {
        stat = statSync(filePath);
        return stat.isDirectory();
    }catch(error) {
        if(error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) {
            return false;
        }
        throw error;
    }
}