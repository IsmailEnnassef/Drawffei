const express = require('express')
const fs=require('fs')
const cors=require('cors')

const  router=new express.Router('*',cors())
router.use(express.json())
//still have to put it behind auth
router.get('/file/read',async (req,res)=>{
    await fs.readFile('/Users/Doshi/Desktop/Projet/DTY/src/Data/wordListe.txt','utf8',(err,data)=>{
        res.status(200).json({data})
    })
})

router.post('/file/add/:word',async (req,res)=>{
    const word=req.params.word
    if(!word){
        return console.log('please add a word')
    }
    console.log(word)
    await fs.readFile('/Users/Doshi/Desktop/Projet/DTY/src/Data/wordListe.txt','utf8',(err,data)=>{
        data=data.concat(' '+word)
        console.log(data)
        fs.writeFile('/Users/Doshi/Desktop/Projet/DTY/src/Data/wordListe.txt',data,(err)=>{
            if (err){
                console.log(err)
            }
        })
        res.status(200).send(   )
        console.log('OK')
    })
})

const findWordAndDelete = function(string,word){
    words=string.split(' ')
    var i
    var result=''
    for (i=0;i<words.length;i++){
        if (words[i] !== word){
            result = result.concat(' '+words[i])
        }
    }
    return result
}
router.delete('/file/delete/:word',(req,res)=>{
    const word = req.params.word
    fs.readFile('/Users/Doshi/Desktop/Projet/DTY/src/Data/wordListe.txt','utf8',(err,data)=>{
        const update = findWordAndDelete(data,word)
        console.log(update)
        fs.writeFile('/Users/Doshi/Desktop/Projet/DTY/src/Data/wordListe.txt',update,(err)=>{
            if (err){
                console.log(err)
            }
        })
        res.status(200).send()
}) 
})

module.exports = router