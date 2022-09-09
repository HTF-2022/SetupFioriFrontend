const cds = require('@sap/cds')

module.exports = (srv) => {
  // Register your event handlers in here, for example, ...
/*
  srv.on('READ','FlowStream', async (stream)=>{
    let bla = await SELECT.from('FlowStream', () => { '*' });
    //for (let each of books) each.stock > 111 && each.discount='11%'
    console.log(stream);
    console.log("blab")
    //stream.sort((a,b) => a.datetime > b.datetime)
    stream.filter(a => a.flow > 3000)
  })
  */


  srv.on('READ','FlowStream', async (a, b, c, d)=>{
   let result = await SELECT.from('FlowStreamService.FlowStream', (a) => { '*', []});
   
    return result.sort((a,b) => a.datetime > b.datetime);
   })
  
   
}
