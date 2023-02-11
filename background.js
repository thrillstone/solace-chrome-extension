/*
  by @bordignon
  October 2013-2015
  You can do what you want with the code as long as you provide attribution
  back to me and don't hold me liable.

  This Chrome extension will connect to a MQTT broker using websockets and
  then subscribe to a topic. When a message is received it will be displayed
  using Chrome's built-in notifications function.

  This extension expects to receive a specific JSON payload formatted as
  follows:
      { "sub": "", "txt": "", "img": "", "url":"" }
  Where:
      'sub' represents the notification heading used in the notification.
      'txt' represents the text used in the notification.
      'img' optional; lets you have a thumbnail for the notification. For example; alert.png, warning.png, etc.
      'url' optional; http web link

  This extension requires "notifications" permission.

  Changelog:
  v4 -- Jan 2014 -- upgraded to newer chrome notifications, removed webkit
  support.
  v4.2 -- fixed url's when you click on a message also added a url parameter to the json messages

todo;
  - thumbnails directory, once you make the extension and publish it you can't add any new icons.
*/

// This variable is used when generating unique notification identifiers.
var notificationId = 0;
var urls = {};
importScripts("mqttws31.js");
/*
Conditionally initialize the options to reasonable defaults and
open the options in a new tab for the user to configure appropriately.
*/

//connect to the broker function
function connect()
{
  client = new Paho.Client("<host here (remove the protocol and port)>",
                                Number(8443),
                                "solace-chrome-extension-example");
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  var connectOptions = new Object();
  connectOptions.useSSL = true;
  connectOptions.cleanSession = true;
  connectOptions.onSuccess = onConnect;
  connectOptions.keepAliveInterval = 60;
  connectOptions.timeout = 3;
  connectOptions.reconnect = true;
  connectOptions.userName = "solace-cloud-client";
  connectOptions.password = "<password-here>";
  connectOptions.timeout = 10000;
  console.log("Connecting to", client.hostname, client, connectOptions);
  client.connect(connectOptions);
}

// Clear the popupNotification
function clearNotification(notificationId)
{
  chrome.notifications.clear(notificationId, clearedCallback);
}

//not sure what to do with this yet!
function createdCallback(n_id) {
  console.log("Succesfully created " + n_id + " notification");
}

function clearedCallback(wasCleared) {
  console.log("Succesfully cleared notification: " + wasCleared);
}

// create the popupNotification in Chrome
function popupNotification(poptitle, popmessage, popicon)

{
  options = {
    type : "basic",
    title: poptitle,
    message: popmessage,
    iconUrl: popicon,
    priority: 2
  };
  var n_id = "id" + notificationId++;
  
  chrome.notifications.create(options, createdCallback);

}

/*
Once connected to the broker, subscribe to the subtopic.
*/
function onConnect()
{
  client.subscribe("exampletopic");
  chrome.action.setIcon({path:"icon.png"});
  popupNotification("MQTT Broker connected","Connection established to exampletopic","icon.png");

  /*
  //uncomment the below if you want to publish to a topic on connect
  message = new Messaging.Message("Hello");
  message.destinationName = "/World";
  client.send(message);
  */
};

/*
If the connection has been lost, display a notification, change icon
and wait `reconnectTimeout` secs before trying to connect again.
*/
function onConnectionLost(responseObject)
{
  if (responseObject.errorCode !== 0)
  {
    console.log("Connection to broker lost:"+responseObject.errorMessage);
    chrome.action.setIcon({path:"icon_noconnection.png"});
    popupNotification("MQTT Broker disconneced","Reason: "+responseObject.errorMessage,"icon_noconnection.png");
  }
};

/*
Upon receipt of a message from the broker, display the message
as a Chrome notification.
*/
function onMessageArrived(message) {
  //console.log("New Message has Arrived: "+message.destinationName + " " + message.payloadString);
  console.log(message);
    popupNotification("Message Received",message.payloadString,"icon.png");
};

//check notification permission is there before we connect to the broker
chrome.notifications.getPermissionLevel(
  function(permissionLevel) {
    console.log('Noification Permission: ' + permissionLevel);
    if (permissionLevel == 'granted')
    {
      connect();
    }
    else if (permissionLevel == 'denied')
    {
      console.log('check your notifications permission level');
    }
  }
);
