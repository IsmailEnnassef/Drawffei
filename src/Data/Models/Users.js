mongoose=require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required:true,
        trim:true,
        unique:true

    },
    password:{
        type: String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    rights:{
        default:'player',
        type:String
    },
    tokens:[{
        token:{
            type:String,
            required:true

        }
    }],
    rooms:[{
        room:{
            type:String,
        }
    }]


})

userSchema.statics.findByEmail= async (email,password)=>{
    const user = await User.findOne({email})
    if (!user){
        throw new Error('unable to log in : missing user')
    }
    //change to hashed version later on
    if (user.password != password){
        throw new Error('Unable to log in')
    }
    return user
}

userSchema.methods.genAuthToken = async function(){
    const token=jwt.sign({_id:this._id.toString() },'56f3b288f1')
    this.tokens=this.tokens.concat({token})
    await this.save()
    return token
}

userSchema.methods.updateHistory = async function(name){
    this.rooms=this.rooms.concat({room:name})
    await this.save()
}

userSchema.methods.getHistory = function(){
    var result =[]
    var i
    for (i=0;i<this.rooms.length;i++){
        result = result.concat([this.rooms[i].room])
    }
    return result
}

// userSchema.pre('save',async function (next){
 
// })//needs to be a standard fnction

const User = mongoose.model('user',userSchema)

module.exports=User