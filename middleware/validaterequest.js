const jwt = require('jsonwebtoken');
const validateUser = require('../auth').validateUser;
module.exports = function (req, res, next) {
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe.
    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
    if (token || key) {
        try {
            jwt.verify(token, require('../secret')(), async function (err, decoded) {
                if (err) {
                    console.log(err);
                    if (err.name == "JsonWebTokenError") {
                        return res.status(401).send({ auth: false, message: 'Invalid token' });
                    }
                    else if (err.name == "TokenExpiredError") {
                        return res.status(401).send({ auth: false, message: 'Token expired' });
                    }
                    else{
                        return res.status(401).send({ auth: false, message: 'failed to authenticate token' });  
                    }
                }
                else {
                    console.log('decoded', decoded);
                    // if everything good, save to request for use in other routes
                    // Authorize the user to see if s/he can access our resources
                    var dbUser = await validateUser(key,decoded); // The key would be the logged in user's username
                    console.log(dbUser);
                    if (dbUser) {
                        if (dbUser.success) {

                            next(); // To move to next middleware
                        } else {
                            res.status(401);
                            res.json({
                                "status": 401,
                                "message": "Not Authorized"
                            });
                            return;
                        }
                    } else {
                        // No user with this name exists, respond back with a 401
                        res.status(401);
                        res.json({
                            "status": 401,
                            "message": "Invalid User"
                        });
                        return;
                    }
                }

            });
        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Oops something went wrong",
                "error": err
            });
        }
    } else {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Unauthorised!! missing authentication token "
        });
        return;
    }
};
