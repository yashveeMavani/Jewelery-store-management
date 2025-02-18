const Client=require('../models/client');
const SalesOrder=require('../models/sales_order');
const Sales=require('../models/sales');


exports.createSales = async (salesData) => {
    try {
      const { voucher_date, client_id, orders } = salesData;
      const id=client_id;
      
    const client=await Client.findByPk(id);
       
    if(!client)
        return "not client present in a database";
    if(client.opposite_account=="Sales")
        return "not client present in a database";
      // Calculate total amount
      let total_amount = 0;
      orders.forEach(order => {
        total_amount += (order.net_weight * order.rate) / 10;
      });
      console.log("Total Amount:", total_amount);
  
      const sales = await Sales.create({
        voucher_date,
        client_id,
        total_amount
      });
  
      console.log("sales Created:", sales); 
  
      // Map and Create Orders
      const orderData = orders.map(order => ({
        sales_id: sales.id,
        category: order.category,
        gross_weight: order.gross_weight,
        net_weight: order.net_weight,
        stone_weight: order.stone_weight,
        rate: order.rate,
        amount: (order.net_weight * order.rate) / 10
      }));
  
    //   console.log("Order Data to Insert:", orderData);
  
      await SalesOrder.bulkCreate(orderData);
  
      console.log("Orders Created Successfully");
      return sales;
  
    } catch (err) {
      console.error("Error in createPurchase:", err);
       return err;
    }
  };
  

exports.getSales = async () => {
    try{
      return await Sales.findAll();
    }catch(err){
        return err;
    }
};

exports.listSales=async(listData)=>{
    try{
        const { page = 1, limit = 10, client_id, date } = listData;
        
        const offset = (page - 1) * limit;
//  console.log("listdata",listdata);
// console.log(offset);
    const where = {};
    if (client_id) where.client_id = client_id;
    if (date) where.voucher_date = date;

    const sales= await Sales.findAndCountAll({
        where,
        include: [{ model: Client, as: 'client' }],
        order: [['voucher_date', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
   console.log(sales);
   return sales;
    }
    catch(err)
    {
        return err;
    }
};

exports.deleteSales = async () => {
  try{
    await SalesOrder.destroy({truncate:true});
    return await Sales.destroy({truncate:true});

  }catch(err){
      return err;
  }
};