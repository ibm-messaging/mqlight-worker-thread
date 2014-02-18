MQ Light worker thread sample
=====================

This sample demonstrates how MQ Light can make apps more responsive using worker threads. You can see the single threaded version of the app on the [serial branch](https://github.com/ibm-messaging/mqlight-worker-thread/tree/serial). To run the improved version, follow the instructions below.

First, download, extract and run [MQ Light](https://www.ibmdw.net/messaging/mq-light/) in an empty directory. Then, where you have downloaded this sample, run

```
npm install
```

to install the required modules, then 

```
node worker.js
```

to start the worker thread and 

```
node app.js
```

to start the app. The app can be viewed at [http://localhost:3000/](http://localhost:3000/). The tweet stream should be much more responsive than the [single threaded example](https://github.com/ibm-messaging/mqlight-worker-thread/tree/serial) because the cpu heavy work is being handled by a separate worker thread.