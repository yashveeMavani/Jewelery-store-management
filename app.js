const express=require('express');

const errorHandler = require('./middleware/errorHandler');
const userroutes=require('./routes/userroutes');
const loginroutes=require('./routes/loginroutes');
const categoryroutes=require('./routes/categoryroutes')
const clientroutes=require('./routes/clientroutes')
const purchaseroutes=require('./routes/purchaseroutes')
const salesroutes=require('./routes/salesroutes')
const rateroutes = require('./routes/rateroutes')
const reportroutes=require('./routes/reportroutes')
const stockroutes=require('./routes/stockRoutes')
const customOrderRoutes = require('./routes/customOrders');
const branchroutes = require('./routes/branchRoutes');
const { sequelize } = require('./models');


require('./cron/ratecron'); 


const app=express();
const port=3000; 
app.use(express.json());
app.use('/auth',loginroutes)
app.use('/users',userroutes);
app.use('/category',categoryroutes);
app.use('/client',clientroutes);
app.use('/purchase',purchaseroutes);
app.use('/rate',rateroutes);
app.use('/sales',salesroutes);
app.use('/report',reportroutes);
app.use('/stock',stockroutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/branch',branchroutes)
app.use('/api', require('./routes/dailyDataRoutes')); 
app.use(errorHandler);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);

});


const db = require('./models'); // Auto-loads sequelize and models

db.sequelize.sync({ alter: true })
    .then(() => console.log('Database synced successfully'))
    .catch((err) => console.error('Error syncing database:', err));
