Solace Chrome Extension Example for uOttaHack
===========
This repo is forked from https://github.com/matbor/mqtt2chrome

##Overview

This extension connects to a Solace Event Broker using the MQTT protocol over websockets and displays any received messages using Chrome's built-in notifications function.

Requires chrome "notifications" permission.

![notification box](https://raw.github.com/matbor/mqtt2chrome/master/screenshots/message%20recieved.png)


##Setup

1. Clone this repo
2. Edit the background.js file and change the hostname and password
2. In Chrome, goto Tools -> Extenstions.
3. Tick the 'Developer mode' box, then click 'Load unpacked extension...'
4. Select the directory where you have cloned the extension.
6. If you entered your credentials correctly, a notification will show up saying you're connected and subscribed to testexample topic
7. If you publish a message to the broker to the testexample topic, you will get a notification in chrome showing the message
You can use this link to publish: https://codepen.io/solacecloud/pen/bxdrbL. Fill out the connection details under the "show advanced settings".