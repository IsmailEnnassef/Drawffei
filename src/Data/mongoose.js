//../mongdb/mongodb/bin/mongod.exe --dbpath=/users/doshi/desktop/projet/DTY/src/Data/Database
const mongoose = require('mongoose')
const connexionUrl = process.env.MONGODB_URL


mongoose.connect(connexionUrl,{useNewUrlParser:true,useCreateIndex:true})