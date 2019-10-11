const jwt=require('jsonwebtoken')
const User = require('../../Data/Models/Users')

const auth = async function(req,res,next){
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,'56f3b288f1')
        const user = await User.findOne({_id:decoded._id})
        if (!user){
            throw new Error('unable to find user')
        }
        req.user=user
        req.token=token
        next()

    }
    catch(e){
        res.status(401).send({error:'Please log in to proceed'})
    }

}

module.exports=auth