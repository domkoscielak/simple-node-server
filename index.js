// DEPENDENCIES
var http = require('http');

var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');


/* **** HTTP SERVER **** */
// Instatiate HTTP server
var httpServer = http.createServer(function(req,res){
     unifiedServer(req,res);
});

//Start HTTP server
httpServer.listen(config.httpPort,function(){
    console.log('The server is listening on port '+config.httpPort);
})


//server logic 
var unifiedServer = function(req,res){
    //get url and parse
    var parsedUrl = url.parse(req.url,true);

    //get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //get query string as an object
    var queryStringObject = parsedUrl.query;

    //get http method
    var method = req.method.toLowerCase();

    //get headers
    var headers = req.headers;

    //get payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    //streaming
    req.on('data',function(data){
        buffer += decoder.write(data);
    });

    req.on('end',function(){
        buffer += decoder.end();

        //choose the handler for this request
        var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //construct data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        //route the request to the handler specified in the router
        choosenHandler(data, function(statusCode,payload){
            console.log('Payload:',payload);
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};

            //convert payload to string
            var payloadString = JSON.stringify(payload);
            
            //return response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Returning this response: ', statusCode,payloadString);
        });
    });
};

// DEFINE HANDLERS
var handlers = {}

// ping handler
handlers.ping = function(data,callback){
    callback(200);
};

// 404 handler
handlers.notFound = function(data,callback){
    callback(404);
};

// Hello handler
handlers.notFound = function(data,callback){
    callback(200,{message: 'Hello'});
};

// define request router
var router = {
    'ping': handlers.ping,
    'hello': handlers.hello
}