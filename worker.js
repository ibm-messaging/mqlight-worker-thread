var mqlight = require('mqlight');

var opts = { host: 'localhost', port: 5672, clientId: 'worker'};
var client = mqlight.createClient(opts);

client.on('connected', function() {
  console.log('Connected to ' + opts.host + ':' + opts.port + ' using client-id ' + client.clientId);

  // Subscribe to the topic 'tweets' to recieve tweets sent by app.js
  var destination = client.createDestination('tweets', function(err, address) {
    if (err) {
      console.error('Problem with createDestination request: ' + err.message);
      process.exit(0);
    }
    if (address) {
      console.log("Subscribing to " + address);
    }
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

  // When we recieve a message, process it and send it to app.js
  destination.on('message', function(msg) {
    sendMessage('processedData', processTweet(msg.body));
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
