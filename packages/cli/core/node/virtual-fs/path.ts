
export type Path = string;
export type PathFragment = Path;

export type Extension = string;

export const NORMALIZED_SEP = '/';
export const NORMALIZED_ROOT = NORMALIZED_SEP as Path;

export function split(path: Path): PathFragment[] {
    const fragments = path.split(NORMALIZED_SEP).map((path: string) => <PathFragment>path);
    return fragments;
}

export function join(root: Path, ...paths: string[]): Path {
    if(paths.length > 0) {
        const pathRoot = root ? root + NORMALIZED_SEP : '';
        return normalize(pathRoot + paths.join(NORMALIZED_SEP));
    }
    return root;
}

export function fragment(path: string): PathFragment {
    return path as PathFragment;
}

/**
 * 
 * @param path 
 * @returns last portion of a path
 */
export function basename(path: Path): PathFragment {
    const sepIndex = path.lastIndexOf(NORMALIZED_SEP);
    return fragment(path.substr(sepIndex));
}

/**
 * 
 * @param path 
 * @returns returns the extension of the path, from the last occurrence of the . (period)
 * character to end of string in the last portion of the path. If there is no . in the last
 * portion of the path, or if the first character of the basename of path (see path.basename()
 * is ., then an empty string is returned.
 */
export function extname(path: Path): Extension {
    const base = basename(path);
    const dotIndex = base.lastIndexOf('.');
    if(dotIndex < 1) {
        return '';
    }
    return base.substr(dotIndex);
}

export function dirname(path: Path): Path {
    const sepIndex = path.lastIndexOf(NORMALIZED_SEP);
    return path.substr(0, sepIndex);
}

export function isAbsolute(path: Path): boolean {
    return path.startsWith(NORMALIZED_SEP);
}

export function relative(from: Path, to: Path): Path {
    if(!isAbsolute(from)){
        throw new Error();
    }

    if(!isAbsolute(to)){
        throw new Error();
    }

    let path: string;

    if(from == to) {
        path = '';
    } else {
        const splitFrom = from.split(NORMALIZED_SEP);
        const splitTo = to.split(NORMALIZED_SEP);

        while(splitFrom.length > 0 && splitTo.length > 0) {
            /* Remove every directory or fragment shared between
             * the two paths `splitFrom` and `splitTo`. */
            if(splitFrom[0] == splitTo[0]) {
                splitFrom.shift();
                splitTo.shift();
            }
        }

        if (splitFrom.length == 0) {
            /** If splitFrom.length is now 0, the path `to` is a child
             * of `from`, meaning a simple join() can be used to */
            path = splitTo.join(NORMALIZED_SEP);
        } else {
            /** Otherwise, `to` is in another directory, and the path must
             * move upwards through the use of '../..' */
            path = splitFrom.map(_ => '..').concat(splitTo).join(NORMALIZED_SEP);
        }
    }

    return path;
}

let normalizedCache = new Map<string, Path>();
export function normalize(path: string): Path {
    let maybePath = normalizedCache.get(path);
    if(!maybePath){ 
        maybePath = noCacheNormalize(path);
        normalizedCache.set(path, maybePath);
    }
    return maybePath;
}

export function noCacheNormalize(path: string): Path {
    if(path == '' || path == '.') {
        return '' as Path;
    }else if (path == NORMALIZED_ROOT) {
        return NORMALIZED_ROOT as Path;
    }
    return path as Path;
}