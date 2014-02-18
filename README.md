Single Threaded Example
=====================

To start the app, simply run

```
npm install
```

to install the required modules and

```
node app.js
```

to start the app. The app will be viewable at [http://localhost:3000/](http://localhost:3000/).

This shows a single threaded node.js app that takes in tweets from a tweet stream and does some CPU intensive processing on them. The CPU intensive work blocks the rest of the app, casuing the interface to become unresponsive.

Check out the [master](https://github.com/ibm-messaging/mqlight-worker-thread) branch to see how to solve the issue and keep your node.js apps responsive using [MQ Light](https://www.ibmdw.net/messaging/mq-light/).