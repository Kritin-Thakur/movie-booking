const {verify} = require("jsonwebtoken");


const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    
    if(!accessToken) return res.status(401).json({error: "User Not Logged In!"});
    try{
        const validToken = verify(accessToken, process.env.JWT_SECRET); // Returns the primary key (in this case username)
        
        if(validToken) {
            req.user = validToken;
            console.log(validToken);
            return next();
        }
    } catch (err) {
        return res.json("Error in middleware: ", {error: err} );
    }

};

module.exports = {validateToken};