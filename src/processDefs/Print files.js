
module.exports = {
    label: 'Read Current Dir',
    ins: [],
    globals: {
        process
    },
    steps: [
        {
            label: 'Read_Dir',
            type: 'readdir', 
            inMap: {
                path: '${process.cwd()}'
            }
        }
    ]
}
