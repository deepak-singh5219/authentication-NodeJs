const jwt = require("jsonwebtoken");

const auth = (req,res,next) => {
    console.log(req.cookies);
    const {token} = req.cookies;

    if(!token) {
        return res.status(403).json({"token":"missing"});
    }

    // verify and decode token
    
    try {
        
        const decode = jwt.verify(token,"shhhhh");
        req.user = decode;

    } catch (error) {
        res.status(403).json({"token":"invalid"})
    }

    return next();

}

module.exports = auth;