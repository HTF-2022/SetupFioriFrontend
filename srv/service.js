const cds = require('@sap/cds');
const mqtt = require('mqtt');

let flowData = [];

var options = {
  host: 'ac24c670632142bab0a422606038f608.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'flexso',
  password: 'flexsohtf'
}

// initialize the MQTT client
var client = mqtt.connect(options);

// setup the callbacks
client.on('connect', function () {
  console.log('Connected');
});

client.on('error', function (error) {
  console.log(error);
});

client.on('message', function (topic, message) {
  // called each time a message is received
  console.log('Received message:', topic, message.toString());
  let jsonS = message.toString();
  let obj = JSON.parse(jsonS);
  obj.datetime = new Date(obj.datetime);
  flowData.push(obj);
});

// subscribe to topic 'my/test/topic'
client.subscribe('/flowMeter');

module.exports = (srv) => {
  srv.on('READ', 'FlowStream', async () => {
    let result = await SELECT.from('FlowStreamService.FlowStream', () => {'*'});
    let mockAndRealtimeData = [...result, ...flowData];
    return mockAndRealtimeData.sort((a, b) => a.datetime > b.datetime);
  });
}
