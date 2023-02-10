const app = require('./app.js')()

app.listen({port: 3030})
    .then(() => console.log('Server waiting requests'))
    .catch(console.error)