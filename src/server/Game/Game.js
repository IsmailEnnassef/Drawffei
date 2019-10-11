
// const checkIfDrawerExist=(population,name)=>{
//     players=population[name]
//     for (i=0,i<players.length,i++)

// }
const setGuessedFalse=function(population,name){
    const room = population[name]
    for ( player in room){
        if (player !== 'pop'){
            console.log(player)
            room[player].guessed=false
        }
    }
    population[name]=room
    console.log(population)
    return population
}
const popChange= function(population,name,username,string){
    if (string==='add'){
        var role
        if (name in population){
            if (population[name].pop ===0){ // somebody joined before but nobody is left on the room
            var playersAndPop = population[name] 
            // population = { nameOfRoom:{pop:2,player1:{score:0,role:'drawer',guessed:false},player2:{score:,role:'guesser'}}
            playersAndPop.pop = playersAndPop.pop + 1 //ajout de population de 1
            playersAndPop[username]={score:0,role:'drawer',guessed:false} //ajout du joueur username avec un score 0
            role = 'drawer'
            }
            else{
            var playersAndPop = population[name] 
            // population = { nameOfRoom:{pop:2,player1:{score:0,role:'drawer'},player2:{score:,role:'guesser'}}
            playersAndPop.pop = playersAndPop.pop + 1 //ajout de population de 1
            playersAndPop[username]={score:0,role:'guesser',guessed:false} //ajout du joueur username avec un score 0
            role = 'guesser'}
 }      
 
        else{
            population[name]= {pop:1}
            population[name][username]={score:0,role:'drawer',guessed:false}
            role='drawer'
        }
        console.log(population)
    return {population,role}
}
    if (string==='delete'){
        if(name){
            console.log(population)// to see the modification
            var room = population[name]
            room.pop=room.pop-1
            role = room[username].role
            delete room[username]
            if (role==='guesser'){
            population[name]=room}
            else {//We need a new drawer  since one was deleted
                if (room.pop >0){ // if there is someone left
            newDrawer=Object.keys(room)[1] // not [0] since [0] is pop, and we are choosing someone at random
            if (newDrawer==='pop'){
                newDrawer=Object.keys(room)[0]
            }
            console.log(newDrawer)
            room[newDrawer].role='drawer'
            population[name]=room

            }
        }
    } return population
}}

const addScore = function(population,name,username){
        var room = population[name]
        room[username].score=population[name][username].score + 1// room[username]=score
        room[username].guessed=true
        population[name]=room
        return population
        
    
}

const generateWord = function(wordListe){
    var word
    while(!word){
    var wordPos= Math.floor(Math.random() * wordListe.length)
    word = wordListe[wordPos]}
    console.log(word)
    return word
}


const getScore = function(population,roomName){
    var unorderedScore =[]
    const room = population[roomName]
    for (player in room){
        if (player != 'pop'){
            unorderedScore=unorderedScore.concat([[player,room[player].score]]) // { doshi:5, }
        }
    // now we have score, we want it to be "ordered" from biggest score to lowest
    }
    var orderedScore = unorderedScore.sort(function(a,b){
        return a[1]-b[1]
    })
    return orderedScore

}
module.exports = {popChange,addScore,generateWord,getScore,setGuessedFalse}
