const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load models dynamically
fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
        // console.log(`Loading model: ${file}`);  
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        // console.log(model)
        console.log(`Loading model: ${model.name}`);
        db[model.name] = model;
    });

// Define Associations

// User -> Branch
if (db.User && db.Branch) {
    db.User.belongsTo(db.Branch, { foreignKey: 'branch_id' });
}

// Branch -> Purchase
if (db.Branch && db.Purchase) {
    db.Branch.hasMany(db.Purchase, { foreignKey: 'branch_id' });
}

// Branch -> Sale
if (db.Branch && db.Sale) {
    db.Branch.hasMany(db.Sale, { foreignKey: 'branch_id', as: 'sales' });
}

// Purchase -> Branch
if (db.Purchase && db.Branch) {
    db.Purchase.belongsTo(db.Branch, { foreignKey: 'branch_id'  });
}
if (db.PurchaseOrders && db.Branch) {
    db.PurchaseOrders.belongsTo(db.Branch, { foreignKey: 'branch_id' });
  }
  

if (db.Purchase && db.Branch) {
    db.Purchase.belongsTo(db.Branch, { foreignKey: 'branch_id' });
    db.Branch.hasMany(db.Purchase, { foreignKey: 'branch_id' }); 
}

// Sale -> Branch
if (db.Sale && db.Branch) {
    db.Sale.belongsTo(db.Branch, { foreignKey: 'branch_id' });
}

// Stock -> Branch
if (db.Stock && db.Branch) {
    db.Stock.belongsTo(db.Branch, { foreignKey: 'branch_id' });
}

// Client <-> Purchase
if (db.Client && db.Purchase) {
    db.Client.hasMany(db.Purchase, { foreignKey: 'client_id', as: 'purchases' });
    db.Purchase.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });
}

// Purchase <-> PurchaseOrder
if (db.Purchase && db.PurchaseOrder) {
    db.Purchase.hasMany(db.PurchaseOrder, { foreignKey: 'purchase_id', as: 'orders' });
    db.PurchaseOrder.belongsTo(db.Purchase, { foreignKey: 'purchase_id', as: 'purchase' });
  
}


// Client <-> Sales
if (db.Client && db.Sales) {
    db.Client.hasMany(db.Sales, { foreignKey: 'client_id', as: 'sales' });
    db.Sales.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });
}

// Sales <-> SalesOrder
if (db.Sales && db.SalesOrder) {
    console.log("Associating Sales with SalesOrder");
    db.Sales.hasMany(db.SalesOrder, { foreignKey: 'sales_id', as: 'sale_orders' });
    db.SalesOrder.belongsTo(db.Sales, { foreignKey: 'sales_id', as: 'sales' });
}

// Client <-> PartialPayment
if (db.Client && db.PartialPayment) {
    db.Client.hasMany(db.PartialPayment, { foreignKey: 'client_id', as: 'partialPayments' });
}

if (db.Sales && db.PartialPayment) {
    db.Sales.hasMany(db.PartialPayment, { foreignKey: 'sales_id', as: 'partialPayments' });
    db.PartialPayment.belongsTo(db.Sales, { foreignKey: 'sales_id', as: 'sale' });
}

if (db.Branch && db.Sales) {
    db.Branch.hasMany(db.Sales, { foreignKey: 'branch_id', as: 'sales' });
    db.Sales.belongsTo(db.Branch, { foreignKey: 'branch_id', as: 'branch' });
}

if (db.Stock && db.Branch) {
    db.Stock.belongsTo(db.Branch, { foreignKey: 'branch_id' });
    db.Branch.hasMany(db.Stock, { foreignKey: 'branch_id', as: 'stocks' });
}

// StockMaster <-> StockData
if (db.StockMaster && db.StockData) {
    db.StockMaster.hasMany(db.StockData, { foreignKey: 'stock_code', sourceKey: 'stock_code', as: 'stockData' });
    db.StockData.belongsTo(db.StockMaster, { foreignKey: 'stock_code', targetKey: 'stock_code', as: 'stockMaster' });
}


// CustomOrder <-> CustomOrderImage
if (db.CustomOrder && db.CustomOrderImage) {
    db.CustomOrder.hasMany(db.CustomOrderImage, { foreignKey: 'orderId', as: 'images' });
    db.CustomOrderImage.belongsTo(db.CustomOrder, { foreignKey: 'orderId' });
}

// Client <-> CustomOrder
if (db.Client && db.CustomOrder) {
    db.Client.hasMany(db.CustomOrder, { foreignKey: 'clientId', as: 'customOrders' });
    db.CustomOrder.belongsTo(db.Client, { foreignKey: 'clientId' });
}

// Supplier <-> Branch
if (db.Supplier && db.Branch) {
    db.Supplier.belongsTo(db.Branch, { foreignKey: 'branch_id', as: 'branch' });
    db.Branch.hasMany(db.Supplier, { foreignKey: 'branch_id', as: 'suppliers' });
  }
  
  // Supplier <-> Purchase
  if (db.Supplier && db.Purchase) {
    db.Supplier.hasMany(db.Purchase, { foreignKey: 'supplier_id', as: 'purchases' });
    db.Purchase.belongsTo(db.Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
  }

// Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

