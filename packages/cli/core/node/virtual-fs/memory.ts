import { FileBuffer, Host, Stats } from "./file";
import { Observable } from "rxjs";
import { Path, normalize, isAbsolute, split, join, NORMALIZED_SEP } from "./path";

let uuid: number = 0;
export interface SimpleMemoryHostStats {
    readonly content: FileBuffer | null;
}

export class SimpleMemoryHost implements Host<{}> {
    protected _cache = new Map<Path, Stats<SimpleMemoryHostStats>>();
    
    protected _newDirStats(): Stats<SimpleMemoryHostStats> {
        return {
            uid: `${uuid++}`,
            isFile() { return false; },
            isDirectory() { return true; },

            atime: new Date(),
            ctime: new Date(),
            mtime: new Date(),
            birthtime: new Date(),
            content: null,
            size: 0
        };
    }

    protected _newFileStats(content: FileBuffer, oldStats?: Stats<SimpleMemoryHostStats>): Stats<SimpleMemoryHostStats> {
        return {
            uid: `${uuid++}`,
            isFile() { return true; },
            isDirectory() { return false; },

            atime: oldStats ? oldStats.atime : new Date(),
            ctime: new Date(),
            mtime: new Date(),
            birthtime: oldStats ? oldStats.birthtime : new Date(),
            content,
            size: content.byteLength
        };
    }

    constructor() {
        this._cache.set(normalize('/'), this._newDirStats());
    }

    protected _toAbsolute(path: Path): Path {
        return isAbsolute(path) ? path : normalize('/' + path);
    }

    /** Write the contents of a FileBuffer to a file located at `path`. */
    protected _write(path: Path, content: FileBuffer): void {
        const absPath = this._toAbsolute(path);
        const oldStats = this._cache.get(absPath); 
        if(oldStats && oldStats.isDirectory()){
            throw new Error();
        }
        
        const fragments = split(path);
        let curr: Path = normalize('/');
        for(const frag of fragments) {
            curr = join(curr, frag);
            const maybeStats = this._cache.get(curr);
            if(maybeStats) {
                if(maybeStats.isFile()) {
                    throw new Error();
                }
            }else {
                this._cache.set(curr, this._newDirStats());
            }
        }

        // Create the stats for the file
        const stats: Stats<SimpleMemoryHostStats> = this._newFileStats(content, oldStats);
        this._cache.set(path, stats);
    }

    protected _read(path: Path): FileBuffer {
        const absPath = this._toAbsolute(path);
        const maybeStats = this._cache.get(absPath);
        if(!maybeStats) {
            // File does not exist
            throw new Error('File does not exist');
        }else if (maybeStats.isDirectory()){
            // path is directory, not file
            throw new Error('File is directory');
        } else if (!maybeStats.content) {
            // Empty content
            throw new Error('No content');
        }
        return maybeStats.content;
    }

    protected _delete(path: Path): void {
        const absPath = this._toAbsolute(path);
        if(this._isDirectory(absPath)) {
            const cachedEntries = this._cache.entries();
            for(const [cachePath] of cachedEntries) {
                if(this._isChild(cachePath, absPath)) {
                    this._cache.delete(cachePath);
                }
            }
        }else {
            this._cache.delete(absPath);
        }
    }

    protected _isDirectory(path: Path): boolean {
        const absPath = this._toAbsolute(path);
        const maybeStats = this._cache.get(absPath);
        return maybeStats ? maybeStats.isDirectory() : false;
    }

    protected _isChild(path: Path, of: Path): boolean {
        if(path === of) {
            return true;
        }
        if(path.startsWith(of + NORMALIZED_SEP)) {
            return true;
        }
        return false;
    }

    protected _isFile(path: Path): boolean {
        const absPath = this._toAbsolute(path);
        const maybeStats = this._cache.get(absPath);
        return maybeStats ? maybeStats.isFile() : false;
    }

    write(path: string, content: FileBuffer): Observable<void> {
        return new Observable<void>(obs => {
            this._write(path, content);
            obs.next();
            obs.complete();
        });
    }

    read(path: string): Observable<ArrayBuffer> {
        return new Observable<FileBuffer>(obs => {
            const content = this._read(path);
            obs.next(content);
            obs.complete();
        });
    }    

    list(path: string): Observable<string[]> {
        throw new Error("Method not implemented.");
    }

    exists(path: string): Observable<boolean> {
        throw new Error("Method not implemented.");
    }

    isDirectory(path: string): Observable<boolean> {
        throw new Error("Method not implemented.");
    }

    isFile(path: string): Observable<boolean> {
        throw new Error("Method not implemented.");
    }

    stat(path: string): Observable<Stats<{}> | null> | null {
        throw new Error("Method not implemented.");
    }


}