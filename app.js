const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const user=require('./routes/user.route');
var auth = require('./auth.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.post('/login', auth.login);
app.all('*', [require('./middleware/validaterequest')]);
app.use('/User',user);









module.exports=app;