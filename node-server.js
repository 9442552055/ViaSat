var http = require('http');
var fs = require('fs');
var path = require('path');
var pRequest = require('request');

var API_KEY = "AIzaSyBzFYwM1JO2nq2QmRsU6T67qK1yVBlS99s";
//AIzaSyAgnWLx4nu4BIYXXz3NJZ1mCtEEXddyb6M



http.createServer(function(request, response) {
    console.log('request starting...', request.url);
    if (request.url.indexOf('maps/api/') > -1) {
        console.log('request proxied...', request.url);
        var proxyURL = 'https://maps.googleapis.com' + request.url + '&key=' + API_KEY
        pRequest.get(proxyURL).pipe(response);
    } else {
        StaticFileHandler(request, response);
    }

}).listen(8125);
var mime = require('mime-types');

function StaticFileHandler(request, response) {
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var contentType = mime.lookup(path.extname(filePath)) || 'text/html';


    fs.readFile(filePath, function(error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}
console.log('Server running at http://127.0.0.1:8125/');