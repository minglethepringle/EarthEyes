const express = require('express');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
var https = require('https');
/**
 * Starts the Express server.
 *
 * @return {ExpressServer} instance of the Express server.
 */
function startServer() {
    const app = express();

    // Redirect HTTP to HTTPS
    app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

    // Handle requests for the data
    app.get('/endpoint/countries', getCountries);
    app.get('/endpoint/location', getLocations);
    var util = require('util');
    app.get("/endpoint/query/:latitude/:longitude/:query",function(req, res){
        var latitude = req.params.latitude;
        var longitude = req.params.longitude;
        getMaterialsID(req.params.query, latitude, longitude, function(data) {
            if (data["result"].length > 0){
                res.send(data["result"][0]);
            }
            else{
                console.log("stop trying to reuse 353");
                res.send({});
            }
        });
        // query = id;
        // console.log(id);
    });

    // Handle requests for static files
    app.use(express.static('public'));

    // Start the server
    return app.listen('8000', () => {
        // eslint-disable-next-line no-console
        console.log('Local DevServer Started on port 8000...');
    });

    // module.exports = app;
}

function getCountries(req, resp, next) {
    var url = "https://api.earth911.com/earth911.getCountries?api_key=4b9fc883188fe866&callback=";

    https.get(url, function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var data = JSON.parse(body);
            resp.json(data);
        });
    }).on('error', function (e) {
        console.log("nani");
    });

}

function getMaterialsID(query, latitude, longitude, callback) {
    var url = "https://api.earth911.com/earth911.searchMaterials?query=" + query + "&api_key=4b9fc883188fe866&callback=";
    https.get(url, function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var data = JSON.parse(body);
            if(data["result"].length <= 0) {
                callback(data);
                return;
            }
            var id = (data["result"][0]["material_id"]);
            getNearestLocation(id, latitude, longitude, callback);
        });
    }).on('error', function (e) {
        console.log("nani");
    });

}

function getNearestLocation(id, latitude, longitude, callback) {
    var url = "https://api.earth911.com/earth911.searchLocations?latitude="+latitude+"&longitude="+longitude+"&material_id="+id+"&api_key=4b9fc883188fe866&callback=";
    https.get(url, function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var data = JSON.parse(body);
            callback(data);
        });
    }).on('error', function (e) {
        console.log("nani");
    });
}

function getLocations(req, resp, next) {
    var url = "https://api.earth911.com/earth911.searchLocations?latitude="+latitude+"&longitude="+longitude+"&material_id="+id+"&api_key=4b9fc883188fe866&callback=";
    console.log(url);
    https.get(url, function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var data = JSON.parse(body);
            resp.json(data["result"]);
            console.log(data["result"]);
        });
    }).on('error', function (e) {
        console.log("nani");
    });

}



startServer();