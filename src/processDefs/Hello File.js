const path = require('path')

module.exports = {
    label: 'Hello File',
    ins: ['file'],
    globals: {
        path,
        process
    },
    steps: [
        {
            label: 'Load_File',
            type: 'readFile', 
            inMap: {
                path: '${path.resolve(process.cwd(), Start.file)}'
            }
        },
        {
            label: 'Print_2_Console',
            type: 'consoleLog', 
            inMap: {
                object: '>> ${Load_File.text} <<'
            }
        }
    ]
}
