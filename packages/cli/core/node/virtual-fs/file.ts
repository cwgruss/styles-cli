import { Path, PathFragment } from "./path";
import { Observable } from "rxjs";

export type FileBuffer = ArrayBuffer;

export type Stats<T> = T & {
    isFile(): boolean;
    isDirectory(): boolean;
    readonly uid: string,
    readonly size: number;

    readonly atime: Date;
    readonly mtime: Date;
    readonly ctime: Date;
    readonly birthtime: Date;
};

export interface Host<StatsT extends object = {}> {
    write(path: Path, content: FileBuffer): Observable<void>;
    read(path: Path): Observable<FileBuffer>;
    list(path: Path): Observable<PathFragment[]>;
    exists(path: Path): Observable<boolean>;
    isDirectory(path: Path): Observable<boolean>;
    isFile(path: Path): Observable<boolean>;

    stat(path: Path): Observable<Stats<StatsT> | null> | null;
}