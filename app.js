const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const user=require('./routes/user.route');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/User',user);









module.exports=app;