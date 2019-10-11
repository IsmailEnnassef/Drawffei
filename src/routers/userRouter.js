const User=require('../Data/Models/Users.js')
const express = require('express')
const auth=require('./middlware/auth')

const router=new express.Router()
router.use(express.json())


router.post('/users/login',async (req,res)=>{
    const {email,password}=req.body
    try{
    const user = await User.findByEmail(email,password)
    const token = await user.genAuthToken()
    res.status(200).send({user,token})
}
    catch(e){
        console.log('unable to log in',e)
        res.status(404).send('unable to log in')
    }
})

router.post('/users/signin',async (req,res)=>{
    const user = new User(req.body)
    try{
        const token = await user.genAuthToken()
        await user.save()
        res.status(201).send({user,token})
    }
    catch(e){
        console.log(e)
    }
})

router.get('/users/history',auth,async (req,res)=>{
    const user = req.user
    const history = user.getHistory()
    const resp={history}
    res.json(resp)

})
//router.delete('/users/logout,async (req,res)=>{})







module.exports=router