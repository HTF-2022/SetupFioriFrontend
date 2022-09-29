const cds = require('@sap/cds');
const mqtt = require('mqtt');

let aFlowData = [];

var oOptions = {
  host: 'ac24c670632142bab0a422606038f608.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'flexso',
  password: 'flexsohtf'
}

// initialize the MQTT client
var client = mqtt.connect(oOptions);

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
  aFlowData.push(obj);
});

// subscribe to topic 'my/test/topic'
client.subscribe('/flowMeter');

module.exports = (srv) => {
  srv.on('READ', 'FlowStream', async (req, res) => {
    let aResults = await SELECT.from('FlowStreamService.FlowStream', () => {'*'});
    let aMockAndRealtimeData = [...aResults, ...aFlowData];
    return aMockAndRealtimeData.sort((a, b) => a.datetime > b.datetime);
  });

  srv.on('READ', 'FlowHint', async (req, res) => {
    let aHints = await SELECT.from('FlowStreamService.FlowHint', () => {'*' }).where({state: req.query.SELECT.where[2].val});
    let oResult = aHints[getRndInteger(0, aHints.length - 1)];
    return oResult;
  });
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}