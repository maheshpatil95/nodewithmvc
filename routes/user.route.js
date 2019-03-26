const User=require('../controllers/user.controller');
const express=require('express');
const router=express.Router();


router.get('/getUser',User.getUserData);


module.exports=router;