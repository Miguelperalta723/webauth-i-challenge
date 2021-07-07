const server = require('./server.js');

const port = process.env.PORT || 6000;

server.listen(port , () => {
    console.log(`api is running on port ${port}`)
})