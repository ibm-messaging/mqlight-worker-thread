var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var twitter = require('ntwitter');
var mqlight = require('mqlight');

// Add your own Twitter OAuth keys here
var twit = new twitter({
  consumer_key: 'CONSUMER_KEY',
  consumer_secret: 'CONSUMER_SECRET',
  access_token_key: 'ACCESS_TOKEN_KEY',
  access_token_secret: 'ACCESS_TOKEN_SECRET'
});

app.listen(3000);

function handler(req, res) {
  var url = req.url.substr(1);
  if (url == '') { url = __dirname + '/index.html'};
  fs.readFile(url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    return res.end(data);
  });
}

io.set('log level', 1);

io.sockets.on('connection', function(socket) {

  var opts = { host: 'localhost', port: 5672, clientId: 'producer'};
  var client = mqlight.createClient(opts);

  client.on('connected', function() {
    console.log('Connected to ' + opts.host + ':' + opts.port + ' using client-id ' + client.clientId);

    var callback = function(err, address) {
      if (err) {
        console.error('Problem with createDestination request: ' + err.message);
        process.exit(0);
      }
      if (address) {
        console.log("Subscribing to " + address);
        // Once we're subscribed and ready for the worker...
        twit.stream('statuses/filter', { track: ['data'] }, function(stream) {
          // Start streaming tweets...
          stream.on('data', function(data) {
            if (data && data.text) {
              // Strip out multibyte characters
              data.text = data.text.replace(/[\uD800-\uFFFF]/g, ' ');
              // When we recieve a tweet, emit the tweet to the screen...
              socket.emit('tweet', data);
              // ...and send the tweet text to the worker for processing
              sendMessage('tweets', data.text);
            }
          });
        });
      }
    }

    // Subscribe to the processedData topic to get messages from the worker
    var destination = client.createDestination('processedData', callback);

    // When we receive processed data from the worker, emit it to the browser
    destination.on('message', function(msg) {
      socket.emit('graphdata', msg.body);
    });

    function sendMessage(topic, body) {
      client.send(topic, body, function(err, msg) {
        if (err) {
          console.error('Problem with send request: ' + err.message);
          process.exit(0);
        }
        if (msg) {
          console.log("Sent message");
        }
      });
    }

  });

});
