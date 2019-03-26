const db=require('../db');

exports.getUserData=(req,res)=>{
let sql="select * from user";
db.query(sql,(error,result)=>{
    if(error){
        console.log('Error: ',error);
    }
    else{
        res.status(200);
        res.jsonp({
            success:true,
            result:result
        })
    }
})

}