const { Client } = require('../models'); 
const { Ledger } = require('../models'); 
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

exports.getClient = async (branch_id) => {
    try{
      return await Client.findAll({ where: { branch_id } });
    }catch(err){
        return err;
    }
};
exports.getClientById = async (id) => {
  try {
    return await Client.findByPk(id); 
  } catch (err) {
    throw new Error('Error fetching client by ID: ' + err.message);
  }
};
exports.updateClient = async (id, clientData,fileData) => {
  const client=await Client.findOne({ where: { id, branch_id: clientData.branch_id } }); 
  console.log(clientData);
  if (!client) {
    throw new Error("Client not found or you don't have permission to update it.");
  }
  
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

exports.deleteClient = async (id, branch_id, role) => {
  try {
    let client;
    console.log('Deleting Client with ID:', id, 'Branch ID:', branch_id, 'Role:', role);
    
    // Super Admin can delete any client in their branch
    if (role === 'super_admin') {
      client = await Client.findOne({ where: { id, branch_id } });
    } else {
      client = await Client.findOne({ where: { id, branch_id } });
    }
    console.log('Client Query Result:', client);
    if (!client) {
      throw new Error("Client not found or you don't have permission to delete it.");
    }

    return await client.destroy();
  } catch (err) {
    throw new Error('Error deleting client: ' + err.message);
  }
};
  exports.deleteLedger = async (id, branch_id) => {
    const ledger=await Ledger.findOne({ where: { id, branch_id } });
    if (!ledger) {
      throw new Error("Ledger not found or you don't have permission to delete it.");
    }
  return await ledger.destroy();
  
  };
