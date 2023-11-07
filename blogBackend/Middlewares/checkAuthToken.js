const jwt = require('jsonwebtoken')

const checkAuth = (req,res,next) => {
    const authToken = req.cookies.authToken ;
    const refreshToken = req.cookies.refreshToken ;
    if(!authToken || !refreshToken){
        return res.status(401).json({message : " Authentication Failed : No authToken or refreshToken is provided "})
    }

    jwt.verify(authToken,process.env.JWT_SECRET_KEY,(err,decode)=> {
        // expired
        if(err){
            console.log("error in auth verification ") ;
            jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET_KEY,(refreshErr,refreshDecode) => {
                // refresh token is expired
                if(refreshErr){
                    return res.status(401).json({message : " Authentication Failed : Both tokens are invalid"}) ;
                }
                // not expired 
                else{
                    const newAuthToken = jwt.sign({userId : refreshDecode.userId},process.env.JWT_SECRET_KEY,{expiresIn : '30m'});
                    const newRefreshToken = jwt.sign({userId : refreshDecode.userId},process.env.JWT_REFRESH_SECRET_KEY,{expiresIn : '2h'})

                    res.cookie('authToken',newAuthToken,{httpOnly : true }) ;
                    res.cookie('refreshToken',newRefreshToken,{httpOnly : true }) ;
                    req.userId = refreshDecode.userId ;
                    next() ;
                }
            })
        }
        // not expired
        else{
            req.userId = decode.userId ;
            // console.log(decode.userId) ;
            next() ;
        }
    })
}

module.exports = checkAuth ;