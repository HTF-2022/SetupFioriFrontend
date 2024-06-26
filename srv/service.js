const cds = require('@sap/cds');
const mqtt = require('mqtt');

let aFlowData = [];
let oPreviousFlow = null;
let oPreviousMessage = null;

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
  let jsonS = message.toString();
  let obj = JSON.parse(jsonS);
  obj.datetime = new Date(obj.datetime);
  // Tracking 0-flows -> Only save first 0 and last 0 flow. (0's in between are not useful)
  if(obj.flow === 0 && oPreviousFlow && oPreviousFlow.flow === 0){ // Only add 0-flow the first time, not the next ones
    // do nothing
  } else if (obj.flow !== 0 && oPreviousFlow && oPreviousFlow.flow === 0){ // Add 0 flow before saving useful flows (not 0 flows) again 
    console.log('Logged message:', topic, oPreviousMessage.toString());
    aFlowData.push(oPreviousFlow);
    console.log('Logged message:', topic, message.toString());
    aFlowData.push(obj);
  } else {
    console.log('Logged message:', topic, message.toString());
    aFlowData.push(obj);
  }
  // save previous flow
  oPreviousFlow = obj;
  oPreviousMessage = message;
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// subscribe to topic 'my/test/topic'
client.subscribe('/flowMeter');

function getTestData(){
  //let dTime = new Date().getTime();
  //let dDate = new Date(dTime + 2 * 60 * 60 * 1000);
  aFlowData.push({
    flow: getRndInteger(8, 18), //  low 8-10; normal 10-14, high 14-16 current
    datetime: new Date(),
    descr: "flow in L/min"
  });
  setTimeout(function(){ getTestData() }, 2000)
}

getTestData();

module.exports = (srv) => {
  srv.on('READ', 'FlowStream', async (req, res) => {
    let aResults = await SELECT.from('FlowStreamService.FlowStream', () => { '*' });
    let aMockAndRealtimeData = [...aResults, ...aFlowData];
    return aMockAndRealtimeData.sort((a, b) => a.datetime > b.datetime);
  });

  srv.on('READ', 'FlowHint', async (req, res) => {
    let aQuotes = await SELECT.from('FlowStreamService.FlowHint', () => { '*' });
    return aQuotes;
  });

  srv.on('READ', 'GandalfQuote', async (req, res) => {
    let aQuotes = await SELECT.from('FlowStreamService.GandalfQuote', () => { '*' });
    return aQuotes;
  });
}