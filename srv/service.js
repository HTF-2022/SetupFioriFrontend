const cds = require('@sap/cds')

module.exports = (srv) => {
  srv.on('READ', 'FlowStream', async () => {
    let result = await SELECT.from('FlowStreamService.FlowStream', () => {'*'});
    return result.sort((a, b) => a.datetime > b.datetime);
  });
  srv.on('READLineGraph', async () => {
    let result = await SELECT.from('FlowStreamService.FlowStream', () => {'*'});
    return result.sort((a, b) => a.datetime > b.datetime);
  });
}
