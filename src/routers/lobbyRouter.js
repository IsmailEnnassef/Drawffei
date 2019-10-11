  
const cors = require('cors')
const express = require('express')
const auth = require('./middlware/auth')
const {createRoom,findAllRooms,findOneRoom,deleteRoomName,deleteRoomId} = require('../Data/Models/Rooms')
const User =require('../Data/Models/Users')

const  router=new express.Router('*',cors())
var path=require('path')
//gotta put delete behind auth 
router.use(express.json())

router.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../public/index.html'))
  })
router.post('/crooms/:name/:username', async (req,res)=>{
    //creates room
    const name = req.params.name
    const username = req.params.username
    console.log(name)
    console.log(username)
    const user = await User.findOne({username})
    user.updateHistory(name)
    try{
    const c = await createRoom(name)
    const cr= await findOneRoom(name)

res.status(200).send(cr)
}
catch(e){
    console.log('a problem happened: server side')
    res.send('\o/ ! a problem happened server side!')
}})

router.get('/roomliste', async (req,res)=>{
    const roomListe=await findAllRooms()
    res.json(roomListe)

})

router.delete('/crooms/:name',auth,async (req,res)=>{
    if(req.user.rights==="admin"){
    deleteRoomName(req.params.name).then(()=>{
        console.log('element successfuly deleted')
    }).catch((e)=>{'an error occured on app.delete'+e})
}
    else{
        return console.log('unable to delete: not admin',req.user.rights)
    }
})


router.delete('/croomsId/:id',auth,async (req,res)=>{
    if(req.user.rights==="admin"){
    deleteRoomId(req.params.id).then(()=>{
        console.log('element successfuly deleted')
    }).catch((e)=>{'an error occured on app.delete'+e})}
    else{
        return console.log('unable to delete:not admin')
    }
})


router.get('/crooms/:name',async (req,res)=>{
    // gets JSON file
    const name = req.params.name
    try{
    const desRoom = await findOneRoom(name)
    res.json(desRoom)
}
    catch(e){
    res.status(500).send('Could not get the desired room')
    }
    
    })



module.exports = router