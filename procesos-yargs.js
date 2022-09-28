const yargs = require('yargs')(process.argv.slice(2))

const argv = yargs
    .default({
        name: 'gabriel',
        lastname: 'paez',
        admin: true
    })
    .alias({
        n: 'name',
        l: 'lastname'
    })
    .boolean('admin')
    .argv

    console.log(argv)
    const isAdmin = argv.admin
    console.log('isAdmin: ', isAdmin)