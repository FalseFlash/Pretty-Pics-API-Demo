// BASE APPLICATION SETUP
//======================================================================================================================

var API_KEY ='';

// Packages we need
var express = require('express');
var bodyParser = require('body-parser');
var Flickr = require('node-flickr');
var request = require('request');
var fs = require('fs');
var cluster = require('cluster');

var port = process.env.PORT || 8080;

if(cluster.isMaster)
{
    cluster.fork();
    cluster.fork();

    cluster.on('disconnect', function(worker)
    {
        console.error('A cluster crashed. Rebooting!');
        cluster.fork();
    });
} else {
    var app = express();
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(bodyParser.json());

    var router = express.Router();

    var flickr = new Flickr({api_key: API_KEY});

// Routes for the API server
//======================================================================================================================

// Application middleware.
    router.use(function (req, res, next) {
        next();
    });

    router.get('/', function (req, res) {
        res.json({
            message: 'Welcome to the API server.'
        })
    });

// Find a background and do processing if needed.
    router.get('/bg/:type', function (req, res) {
        var type = req.params.type;
        var blur = !!req.params.blur;
        var _self = res; // This is so we can access res outside of request.

        flickr.get("photos.search", {tags: type, content_type: 1, extras: 'url_o'}, function (err, result) {
            if (err)
                return res.json({message: err});

            if (result.photos.photo.length <= 0)
                return res.json({message: 'No images found.', error: 404});

            var randomPhoto = Math.floor((Math.random() * result.photos.photo.length));
            var photo = result.photos.photo[randomPhoto];
            var farm = photo.farm;
            var server = photo.server;
            var ID = photo.id;
            var secret = photo.secret;
            var builtURL = photo.url_o;

            request.head(builtURL, function (err, res, body) {
                if (!fs.exists('./dump/' + ID + '_' + secret + '.jpg')) {
                    request(builtURL).pipe(fs.createWriteStream('./dump/' + ID + '_' + secret + '.jpg').on('close', function () {
                        var img = fs.readFileSync('./dump/' + ID + '_' + secret + '.jpg');
                        _self.writeHead(200, {'Content-Type': 'image/gif'});
                        _self.end(img, 'binary');
                    }));
                } else {
                    var img = fs.readFileSync('./dump/' + ID + '_' + secret + '.jpg');
                    _self.writeHead(200, {'Content-Type': 'image/gif'});
                    _self.end(img, 'binary');
                }
            });
        });
    });

// Return bad API call if route is not found.
    router.get('*', function (req, res) {
        res.json({
            message: 'Bad API Call',
            error: 400
        });
    });

// Register the routes to use /api
    app.use('/api', router);

// Start the server
//======================================================================================================================

    app.listen(port);
    console.log('A cluster server is listening on port ' + port);
}