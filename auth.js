const jwt = require('jsonwebtoken');
const db = require('./db');
const crypto =require('./services/crypto')


var auth = {
   

   login: async function (req, res) {
        var username = req.body.username || '';
        var password = req.body.password || '';
        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        // Fire a query to your DB and check if the credentials are valid 
        //if valid generate token
        var dbUserObj = await auth.validate(username, password);
        console.log(dbUserObj);
        if (!dbUserObj.success) { // If authentication fails, we send a 401 back
            res.status(401);
            res.json({
                "status": 401,
                "message": dbUserObj.message
            });
            return;
        }
        if (dbUserObj.success) {
            //send response with token
            res.json(dbUserObj);
        }
    },
   
    validate: function (username, password) {
        
       
 
        // spoofing the DB response for simplicity
        return new Promise(function (resolve) {
            var sql = "select * from user where username='" + username + "'  and status=true";
           // var sql = "select * from user where username='" + username + "' and password='"+encryptedPassword+"' and status=true";
            db.query(sql, function (error, result) {
                if (error) {
                    console.log('Error:', error);
                    resolve({
                        success: false,
                        message: 'Error in sql'
                    })

                } else {
                    console.log(result);
                    if (result.length > 0) {
                        var decryptedPassword = crypto.decrypt(result[0].password);
                        if (password == decryptedPassword) {
                            var token = genToken({ user_id: result[0].id, emailId: result[0].emailid })
                                    resolve({
                                        statusCode: 200,
                                        success: true,
                                        token: token,
                                        user_id: result[0].id,
                                        name: result[0].first_name+" "+result[0].last_name,
                                        emailId: result[0].emailid,
                                        username: result[0].username,
                                        
                                    })

                         } else {
                            resolve({
                                success: false,
                                message: 'Username/Password mismatch'
                            })
                       }
                    } else {
                        resolve({
                            success: false,
                            message: 'Username/Password mismatch or user is blocked'
                        })
                    }
                }
            })
        })
    },
    
    validateUser: function (id, data) {
        // spoofing the DB response for simplicity
        return new Promise(function (resolve) {

            if (id == data.user_id) {
                resolve({ success: true })
            }
            else {
                resolve({ success: false })
            }
        })
    },
}

// private method
function genToken(user) {
    var token = jwt.sign({ user_id: user.user_id, emailId: user.emailId }, require('./secret.js')(), {
        expiresIn: 86400   // expires in 24 hours
    });
    return token;

}





module.exports = auth;
