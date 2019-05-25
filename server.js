const connect = require('connect');
const serveStatic = require('serve-static');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
});
