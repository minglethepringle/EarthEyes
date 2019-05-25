const express = require('express');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;

/**
 * Starts the Express server.
 *
 * @return {ExpressServer} instance of the Express server.
 */
function startServer() {
    const app = express();

    // Redirect HTTP to HTTPS,
    app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

    // Handle requests for the data
    app.get('/forecast/:location', getForecast);
    app.get('/forecast/', getForecast);
    app.get('/forecast', getForecast);

    // Handle requests for static files
    app.use(express.static('public'));

    // Start the server
    return app.listen('8000', () => {
        // eslint-disable-next-line no-console
        console.log('Local DevServer Started on port 8000...');
    });

    // module.exports = app;
}

function getForecast(req, res, next) {
    res.json(["Orange","Apple","Watermellon"]);
}

startServer();