const fs = require('fs-extra')

module.exports = {
    readdir: {
        ins: ['path'],
        outs: ['paths'],
        impl: inMap => fs.readdir(inMap.path).then(paths => ({ paths }))
    },
    readFile: {
        ins: ['path'],
        outs: ['text'],
        impl: inMap => fs.readFile(inMap.path, 'utf-8').then(text => ({ text }))
    },
    consoleLog: {
        ins: ['object'],
        outs: [],
        impl: inMap => {
            console.log(inMap.object)
            return Promise.resolve({})
        }
    },
    jsonParse: {
        ins: ['text'],
        outs: ['jsonObject'],
        impl: inMap => {
            return new Promise((resolve, reject) => {
                try {
                    resolve({ jsonObject: JSON.parse(inMap.text) })
                } catch (err) {
                    reject(err)
                }
            })
        }
    }
}