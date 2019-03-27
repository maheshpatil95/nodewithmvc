const mysql=require('mysql');
const connectionString={
    host:'192.168.1.80',
    user:'root',
    password:'pass',
    database:'onemeetingbeta'
}

var db;
const connectDb=()=>{
    db=mysql.createConnection(connectionString);
    db.connect((error)=>{
        if(error){
            console.log('Error connecting database',error);
        }else{
            console.log('Database connected');
        }
    })
    return db;
}



module.exports=connectDb();
