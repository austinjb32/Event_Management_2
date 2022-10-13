const userModel = require('../Models/userModel')
const tokenModel = require('../Models/tokenModel')
const jwt= require('jsonwebtoken')

module.exports = async function (req, res, next) {
    try {
        var token = req.body.token || req.query.token || req.headers.token;
        // console.log('token: ',token)
        
        // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        // console.log(fullUrl)

        if (token) {
            try {
                var user = await jwt.verify(token, "nest");
                if (user) {
                    req.user = user;
                    var userdata = await userModel.findOne({ _id: req.user.user._id }, { password: 0 }); //password: 0 means no password, 1 means need a password
                    if ((userdata!=null||undefined)) {
                        var checkToken = await tokenModel.findOne({ userId: req.user.user._id, tokenvalue: token, status: 'Active',role:"Admin" });
                        if (checkToken==null||undefined) {
                            res.status(200).json({
                                status: false,
                                expired: true,
                                msg: 'Authentication failed'
                            });
                            return;
                        }
                        
                        req.user.user = userdata;
                        next();
                    }
                    else {
                        res.status(200).json({
                            status: false,
                            msg: 'Failed to find user.'
                        });
                        return;
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        expired: true,
                        msg: 'Failed to authenticate token.'
                    });
                    return;
                }
            } catch (ex) {
                console.log(ex)
                res.status(200).json({
                    status: false,
                    expired: true,
                    msg: 'Your session has expired, please login again.',
                    ex: ex
                });
                return;
            }

        } else {
            res.status(200).json({
                status: false,
                expired: true,
                msg: 'No token provided.'
            });
            return;
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            expired: true,
            msg: 'Something went wrong!!!',
            error: error
        });
    }
};


