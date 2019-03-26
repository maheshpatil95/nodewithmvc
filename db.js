const mysql=require('mysql');
const connectionString={
    host:'',
    user:'',
    password:'',
    database:''
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
