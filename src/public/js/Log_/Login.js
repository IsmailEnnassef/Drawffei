const sub = document.getElementById('loginForm')
sub.addEventListener('submit',(event)=>{
    event.preventDefault()
    const {username,token}=connexion()
})

const connexion= async ()=>{
    const email=document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value 
    try{
    const resp =await fetch('http://127.0.1.1:3001/users/login',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify({email,password})})
        if (resp.status ===404){
            throw new Error('')
        }
        const {user,token}=await resp.json()
        const username = user.username
        document.cookie=JSON.stringify({username,token}).concat(";path=/;")
        if (user.rights !== 'admin'){
        document.location.assign('../userlobby.html')}
        else{
            document.location.assign('../adminlobby.html')
        }
        return {username,token}
}
    catch(e){
        console.log(e)
        document.getElementById('connexionError').innerText = 'unable to log in' 
        
    }
}
