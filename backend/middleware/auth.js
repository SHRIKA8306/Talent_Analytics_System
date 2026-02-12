const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    const header=req.headers.authorization||'';
    //check if user token provided or not
    const token=header.startsWith('Bearer')?header.slice(7):null;
    if(!token) return res.status(401).send("No token provied")
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET||"shri@march")
        req.user=decode;
        next(); 
    }catch(error){
        return res.status(401).send("Invalid or expired token")
    }
}