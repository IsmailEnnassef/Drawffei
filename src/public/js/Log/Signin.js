
const sub = document.getElementById('signin')
sub.addEventListener('submit',(event)=>{
    event.preventDefault()
    const {username,token}=signin()
})

const signin = async function (){
    const email= document.getElementById('signinEmail').value
    const password=document.getElementById('signinPassword').value
    const userName=document.getElementById('signinUsername').value
    try{ 
        const resp= await fetch('http://127.0.1.1:3001/users/signin',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify({email,password,username:userName})})
        const {user,token} = await resp.json()
        if (!user){
            throw new Error('')
        }
        const {username}=user
        document.cookie = JSON.stringify({username,token})
        if (user.rights !== 'admin'){
            document.location.assign('../userlobby.html')}
            else{
                document.location.assign('../adminlobby.html')
            }
            return {username,token}
    }
    catch(e){
        console.log(e)
        alert('unable to sign in:',e)

    }
}
