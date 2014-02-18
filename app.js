var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var twitter = require('ntwitter');

// Put your Twitter OAuth keys here
var twit = new twitter({
  consumer_key: 'CONSUMER',
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
  
  twit.stream('statuses/filter', { track: ['data'] }, function(stream) {
    stream.on('data', function(data) {
      if (data && data.text) {
        // Strip out multibyte characters
        data.text = data.text.replace(/[\uD800-\uFFFF]/g, ' ');
        socket.emit('tweet',data);
        socket.emit('graphdata',processTweet(data.text));
      }
    });
  });

  function processTweet(tweetText) {

    var graphData = {
      labels : [],
      datasets : [
        {
          fillColor : "rgba(75,107,175,0.9)",
          strokeColor : "rgba(220,220,220,1)",
          data : []
        }
      ]
    };
    
    // Count the instances of each character
    for (var i = 0; i <= tweetText.length - 1; i++) {
      calculatePrimes(250);
      var char = tweetText[i];
      if (graphData.labels.indexOf(char) == -1) {
        graphData.labels.push(char);
        graphData.datasets[0].data[graphData.labels.indexOf(char)] = 1;
      } else {
        graphData.datasets[0].data[graphData.labels.indexOf(char)]++;
      }
    };

    return graphData;

    function calculatePrimes(numPrimes) {
      var primesFound = 0;
      var currentNum = 2;
      while(primesFound < numPrimes) {
        if(isPrime(currentNum)) {
          primesFound++;
        }
        currentNum++;
      }
      function isPrime(n) {
        var isPrime = true;
        for (var i = 2; i < n; i++) {
          if (n%i == 0) {
            isPrime = false;
          }
        };
        return isPrime;
      }
    }

  }

});
