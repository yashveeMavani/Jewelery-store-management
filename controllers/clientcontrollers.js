const clientService = require('../services/clientservices');

exports.createClient = async (req, res,next) => {
  try {
    const { role, branch_id } = req.user; 
    if (role !== 'super_admin' && req.body.branch_id && req.body.branch_id !== branch_id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to create clients for this branch.' });
    }
    const clientData = { ...req.body, branch_id: req.branch_id }; 
    const client = await clientService.createClient(clientData,req.file);
    const ledger = await clientService.createLedger(clientData,req.file);

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    next(error);
   
  }
};
exports.getClient = async (req, res,next) => {
    try {
      const { role, branch_id } = req.user;
      const clients = role === 'super_admin'
      ? await clientService.getAllClients()
      : await clientService.getClient(branch_id);

      const client = await clientService.getClient(req.branch_id);
      res.status(201).json({ success: true, data: client });
    } catch (error) {
      next(error);
    
    }
  };

  exports.updateClient = async (req, res,next) => {
    try {
       
        const {id}=req.params;
        const { role, branch_id } = req.user;
        if (role !== 'super_admin') {
          const client = await clientService.getClientById(id);
          if (!client || client.branch_id !== branch_id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to update this client.' });
          }
        }
        const clientData = { ...req.body, branch_id: req.branch_id }; 
      const client = await clientService.updateClient(id,clientData,req.file);
      const ledger=await clientService.updateLedger(id,clientData,req.file);
      res.status(201).json({ success: true, data:client });
    } catch (error) {
      next(error);
      
    }
  };

  exports.deleteClient = async (req, res,next) => {
    try {
      const { id } = req.params;
      const { userrole, branch_id } = req.user;

      console.log('Role:', userrole, 'Branch ID:', branch_id, 'Client ID:', id);
      if (userrole !== 'super_admin') {
        return res.status(403).json({ success: false, message: 'You are not authorized to delete clients.' });
      }
      const client = await clientService.deleteClient(id, branch_id,userrole);
      const ledger = await clientService.deleteLedger(id, branch_id,userrole);

      res.status(201).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  };