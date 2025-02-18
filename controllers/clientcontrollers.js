const clientService = require('../services/clientservices');

exports.createClient = async (req, res) => {
  try {
    const client = await clientService.createClient(req.body,req.file);
    const ledger = await clientService.createLedger(req.body,req.file);

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.getClient = async (req, res) => {
    try {
      const client = await clientService.getClient();
      res.status(201).json({ success: true, data: client });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  exports.updateClient = async (req, res) => {
    try {
       
        const {id}=req.params;

      const client = await clientService.updateClient(id,req.body,req.file);
      const ledger=await clientService.updateLedger(id,req.body,req.file);
      res.status(201).json({ success: true, data:client });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  exports.deleteClient = async (req, res) => {
    try {
      const client = await clientService.deleteClient(req.params.id);
      const ledger = await clientService.deleteLedger(req.params.id);

      res.status(201).json({ success: true, data: client });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };