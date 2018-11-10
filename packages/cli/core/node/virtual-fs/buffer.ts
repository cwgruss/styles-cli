import { FileBuffer } from "./file";

export function stringToFileBuffer(str: string): FileBuffer  {
    if(typeof Buffer !== 'undefined') {
        const buff = Buffer.from(str);
        const arrBuff = new ArrayBuffer(buff.length);
        const view = new Uint8Array(arrBuff);

        for(let i = 0; i < buff.length; ++i){
            view[i] = buff[i];
        }
        return arrBuff;
    }else {
        const buff = new ArrayBuffer(str.length * 2); // 2 bytes for every char
        const buffView = new Uint16Array(buff);
        for(let i = 0; i < str.length; i++) {
            buffView[i] = str.charCodeAt(i);
        }
        return buff;
    }
}

export function fileBufferToString(fileBuffer: FileBuffer): string {
    if(typeof Buffer !== 'undefined') {
        return Buffer.from(fileBuffer).toString('utf-8');
    }else {
        const buffView = new Uint8Array(fileBuffer);
        const buffLength = buffView.length;
        let result = '';
        let chunkLength = Math.pow(2, 16) - 1;

        for(let i = 0; i < buffLength; i += chunkLength) {
            if(i + chunkLength > buffLength){
                chunkLength = buffLength - 1;
            }
            result += String.fromCharCode.apply(null, buffView.subarray(i, i + chunkLength));
        }
        return result;
    }
}