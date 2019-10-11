mongoose = require('mongoose')

const Room = mongoose.model('room',{
    name:{
        type:String,
        unique: true,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:true}

})

const createRoom = (name)=>{
    console.log(name)
    Room({name}).save().then(()=>{console.log('room created successful')}).catch((e)=>{
        console.log('Sorry ! a problem happened !')
    })
    
    }
const findOneRoom = async (name)=>{
    const Result = await Room.findOne({name})
    if (!Result){
        return console.log('No element found')
    }
    return Result
}

const findAllRooms=async()=>{
    const Result = await Room.find({})
    if(!Result){
        return console.log('No room created')
    }
    return Result
}
const deleteRoomName = async (name)=>{
    try{  
    await Room.findOneAndDelete({name})
}
    catch (e) {
        return console.log(e)
    }
}

const deleteRoomId = async (_id)=>{
    try{
       var del = await Room.findOneAndDelete({_id})}
    catch (e) {
        return console.log("unable to find elmement")
    }
}

module.exports = {Room,createRoom,findAllRooms,findOneRoom,deleteRoomName,deleteRoomId}