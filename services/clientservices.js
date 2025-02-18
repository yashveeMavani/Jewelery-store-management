const Client= require('../models/client');
const {Ledger}= require('../models/ledger');

exports.createClient = async (clientData,fileData) => {
 
try{
    console.log(fileData);
    const imageurl=`http://localhost:3000/${fileData.filename}`;
    clientData.image=imageurl;
    console.log(clientData);
  return await Client.create(clientData);

}catch(err){
    return err;
}
};

exports.createLedger = async (clientData,fileData) => {
    try{
        const imageurl=`http://localhost:3000/${fileData.filename}`;
    clientData.image=imageurl;
    console.log(clientData);
      const ledger=await Ledger.create(clientData);
      return ledger;
    
    }catch(err){
        return err;
    }
    };

exports.getClient = async () => {
    try{
      return await Client.findAll();
    }catch(err){
        return err;
    }
};
exports.updateClient = async (id, clientData,fileData) => {
  const client=await Client.findByPk(id);
  console.log(clientData);
  
  client.name = clientData.name || client.name;
  client.firm_name = clientData.firm_name || client.firm_name;
  client.gst_number = clientData.gst_number || client.gst_number;
  client.pan_number = clientData.pan_number || client.pan_number;
  client.phone_number = clientData.phone_number || client.phone_number;
  client.address = clientData.address || client.address;
  client.pincode = clientData.pincode || client.pincode;
  if(fileData)
  {
    const imageurl=`http://localhost:3000/${fileData.filename}`;
    client.image =imageurl;
  }


  return await client.save();
  
};

exports.updateLedger = async (id, clientData,fileData) => {
    const ledger=await Ledger.findByPk(id);

    // Update ledger entry as well
    if (ledger) {
      ledger.name = clientData.name || ledger.name;
      ledger.firm_name = clientData.firm_name || ledger.firm_name;
      ledger.phone_number = clientData.phone_number || ledger.phone_number;
      ledger.address = clientData.address || ledger.address;
      ledger.pincode = clientData.pincode || ledger.pincode;
      if(fileData)
        {
          const imageurl=`http://localhost:3000/${fileData.filename}`;
          ledger.image =imageurl;
        }
            return await ledger.save();
    }

  
  };
exports.deleteClient = async (id) => {
    const client=await Client.findByPk(id);

  return await client.destroy();
  

  };

  exports.deleteLedger = async (id) => {
    const ledger=await Ledger.findByPk(id);
  return await ledger.destroy();
  
  };
