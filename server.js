'use strict';

// [START gae_node_request_example]
const express = require('express');
//const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
// const https = require('https');
const request = require('request');
const app = express();


function getMaterialsID(query, latitude, longitude, callback) {
    console.log("1");
    var url = "https://api.earth911.com/earth911.searchMaterials?query=" + query + "&api_key=4b9fc883188fe866";
    request(url, function (error, response, body) {
        if(error != null) {
            callback(null);
            return;
        }

        var data = JSON.parse(body);
        if(data["result"].length <= 0) {
            callback(data);
            console.log("error 1");
            return;

        }
        var id = (data["result"][0]["material_id"]);
        console.log("before location");
        getNearestLocation(id, latitude, longitude, callback);
        console.log("3");
    });
}

function getListOfMaterials(query, callback) {
    console.log("getting list");
    var url = "https://api.earth911.com/earth911.searchMaterials?query=" + query + "&api_key=4b9fc883188fe866&callback=";

    request(url, function (error, response, body) {
        if(error != null) {
            console.log("e5");
            callback(null);
            return;
        }

        var data = JSON.parse(body);
        callback(data);
    });

}

function getNearestLocation(id, latitude, longitude, callback) {
    console.log("2");
    
    var url = "https://api.earth911.com/earth911.searchLocations?latitude="+latitude+"&longitude="+longitude+"&material_id="+id+"&api_key=4b9fc883188fe866&callback=";
    request(url, function (error, response, body) {
        if(error != null) {
            console.log("e2");
            callback(null);
            return;
        }

        var data = JSON.parse(body);
        console.log("4");
        callback(data);
        console.log("4.1");
    });
}


// app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

app.get('/', (req, res) => {
    console.log("redirect");
    res.redirect("/index.html");
});
// app.get('/endpoint/location', getLocations);
app.get("/endpoint/query/:latitude/:longitude/:query",function(req, res){
    var latitude = req.params.latitude;
    var longitude = req.params.longitude;
    setTimeout(function() {
        getMaterialsID(req.params.query, latitude, longitude, function(data) {
            if(data == null) {
                res.sendStatus(500);
                return;
            }
            console.log("back callback");
            if (data["result"].length > 0){
                console.log("sed");
                res.send(data["result"][0]);
            }
            else{
                console.log("stop trying to reuse 353");
                res.send({});
            }
        });
    }, 1);
});

app.get("/endpoint/getMaterials/:query",function(req, res){
    setTimeout(function() {
        getListOfMaterials(req.params.query, function(data) {
            if(data == null) res.end(500);
            res.send(data["result"]);
        });
    }, 1);
});

app.use(express.static(__dirname + "/public"));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]