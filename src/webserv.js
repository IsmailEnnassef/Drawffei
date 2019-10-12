const path = require('path')    
const cors = require('cors')
const express = require('express')
require('./Data/mongoose')
const lobbyRouter =require('./routers/lobbyRouter.js')
const userRouter=require('./routers/userRouter.js')
const socketio=require('socket.io')
const http=require('http')
const fileRouter = require('./routers/fileRouter')
const {popChange,addScore,generateWord,getScore,setGuessedFalse} = require('./server/Game/Game.js')
const fs = require('fs')
http.createServer()



const publicDirectoryPath = path.join(__dirname,'./public')    
const wordListPath = path.join(__dirname,'./data/') 
console.log(publicDirectoryPath)
const app = express().use('*',cors())
const port = process.env.PORT 


app.use('/',express.static(publicDirectoryPath))
app.use(lobbyRouter)
app.use(userRouter)
app.use(fileRouter)
const server=http.createServer(app)
const io=socketio(server)
var wordListe
wordListe=fs.readFileSync(wordListPath +'wordListe.txt','utf8')

var population ={}
var winningWord



//Timer should start when a room is joint--> timer should be tied to room.

io.on('connection',(socket)=>{
    socket.on('join',(name,username)=>{
        var currentRoom
        var currentUser
        socket.join(name)
        currentRoom=name
        currentUser=username
        var popAndRole = popChange(population,name,username,'add')
        population = popAndRole.population
        var role = popAndRole.role //guesser or drawer
         //was the word guessed already?
        io.to(name).emit('welcome',`Welcome to ${username}`)
        socket.emit('role',role)
        socket.on('getRole',()=>{
            socket.emit('role',role)
        })
        socket.on('getScore',()=>{
            var score = getScore(population,name)
            io.to(currentRoom).emit('score',score)//still have to get dat score
        })
        const t = 90 //set timers all across
        if (role=='drawer'){
            socket.on('changeWidth',width=>{
                io.to(name).emit('changeWidth',width)
            })
            //first user to join or that got changed to drawer
            socket.on('pre',(xpre,ypre)=>{
                // sets xpre,ypre to make drawing smoother
                socket.broadcast.to(name).emit('pre',xpre,ypre)
            })
            var timer  = t //timer ofr choosing the word
            setInterval(()=>{
                    timer = timer -1 // Timer starts, and is emitted to all players
                    socket.emit('timer',timer)
            },1000)
            winningWord=generateWord(wordListe.split(' ')) // Generating the word from the .txt
            socket.emit('drawWord',winningWord) // and emitting it to the drawing player
            socket.on('getWinningWord',()=>{ // in case the drawer got changed, the new drawer asks for the word
                io.to(currentRoom).emit('winningWord',winningWord)
            })
            io.to(name).emit('askForScore')
            setInterval(()=>{
                timer  = t
                io.to(name).emit('clearCanvas')
                population=setGuessedFalse(population,name)
                //updates timer every 1sec
                winningWord=generateWord(wordListe.split(' '))
                socket.emit('drawWord',winningWord)
                io.to(name).emit('winningWord',winningWord)
                io.to(name).emit('askForScore') // you can only know if you won or not when the next word passes
            },timer*1000)
        }
        if (role==='guesser'){
            console.log('hello')
            socket.emit('getWinningWord')
            socket.on('winningWord',(word)=>{
                if (word){
                    winningWord = word
                }
            })
        }
        socket.on('getWinningWord',()=>{
            io.to(name).emit('winningWord',winningWord)
        })
        socket.on('updateRole',()=>{
            try{
            role =population[name][currentUser].role}
            catch(e){
                console.log(e   )
            }
            if (role=='drawer'){ // if new Role is drawer , it means the drawer left
                var timer  = t
            setInterval(()=>{
                    timer = timer -1
                    socket.emit('timer',timer)
            },1000)
            winningWord=generateWord(wordListe.split(' '))
            socket.emit('drawWord',winningWord)
            socket.on('getWinningWord',()=>{
                io.to(currentRoom).emit('winningWord',winningWord)
            })
            io.to(name).emit('askForScore')
            setInterval(()=>{
                timer  = t
                socket.emit('clearCanvas')
                //updates timer every 1sec
                winningWord=generateWord(wordListe.split(' '))
                socket.emit('drawWord',winningWord)
                io.to(name).emit('winningWord',winningWord)
                io.to(name).emit('askForScore') // you can only know if you won or not when the next word passes
            },timer*1000)}
             
        })


        socket.on('draw',(x,y,color)=>{   
            if(role ==='drawer'){
            io.to(name).emit('draw',x,y,color)}
        })
        socket.on('changeColor',(color)=>{
            if(role==='drawer'){
                io.to(name).emit('changeColor',color)
            }
        })
        socket.on('sendMessage',(message,username)=>{
            if(!population[name][username].guessed){
                if(role==='guesser' && toLowerCase(trim(message)) !== toLowerCase(trim(winningWord))){
                io.to(name).emit('receiveMessage',message,username)}
                if(role==='guesser' && toLowerCase(trim(message)) ===toLowerCase(trim(winningWord))){
                    population=addScore(population,name,username)
                    
                }
            }
 // adds 1 if correct guessed word
            })// transmits message
        
        

        socket.on('disconnect',()=>{
            if(currentUser){//not undefined
            population =popChange(population,currentRoom,currentUser,'delete') // also update pop roles
            io.to(currentRoom).emit('updateRole') // make user update their role from guesser to drawer through pop that was updated in the previous line
            console.log('Disconnected:',population)}
        })

    

    })
    

})




server.listen(port,()=>{
    console.log("App successfuly listening on port "+ port)
})

