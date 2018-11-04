var fs = require('fs');

export function mkdirSync(dirPath: string) {
    try {
      fs.mkdirSync(dirPath)
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }
}