const Client=require('../models/client');
const PurchaseOrder=require('../models/purchase_order');
const Purchase=require('../models/purchase');


exports.createPurchase = async (purchaseData) => {
    try {
      const { voucher_date, client_id, orders } = purchaseData;
      const id=client_id;
    const client=await Client.findByPk(id);
       
    if(!client)
        return "not client present in a database";
    
      // Calculate total amount
      let total_amount = 0;
      orders.forEach(order => {
        total_amount += (order.net_weight * order.rate) / 10;
      });
      console.log("Total Amount:", total_amount);
  
      const purchase = await Purchase.create({
        voucher_date,
        client_id,
        total_amount
      });
  
      console.log("Purchase Created:", purchase); 
  
      // Map and Create Orders
      const orderData = orders.map(order => ({
        purchase_id: purchase.id,
        category: order.category,
        gross_weight: order.gross_weight,
        net_weight: order.net_weight,
        stone_weight: order.stone_weight,
        rate: order.rate,
        amount: (order.net_weight * order.rate) / 10
      }));
  
    //   console.log("Order Data to Insert:", orderData);
  
      await PurchaseOrder.bulkCreate(orderData);
     
      console.log("Orders Created Successfully");
      return purchase;
  
    } catch (err) {
      console.error("Error in createPurchase:", err);
       return err;
    }
  };
  

exports.getPurchase = async () => {
    try{
      return await Purchase.findAll();
    }catch(err){
        return err;
    }
};

exports.listPurchase=async(listData)=>{
    try{
        const { page = 1, limit = 10, client_id, date } = listData;
        const offset = (page - 1) * limit;
//  console.log("listdata",listdata);
// console.log(offset);
    const where = {};
    if (client_id) where.client_id = client_id;
    if (date) where.voucher_date = date;

    const purchase= await Purchase.findAndCountAll({
        where,
        include: [{ model: Client, as: 'client' }],
        order: [['voucher_date', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
   console.log(purchase);
   return purchase;
    }
    catch(err)
    {
        return err;
    }
}

