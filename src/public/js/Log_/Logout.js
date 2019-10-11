const logoutMessage=function(){
    const loggedMessage ="<form id='logbutt'><p>Welcome "+username+"</p> <input type='submit'  value='logout'/> </form>"
    document.getElementById('login').innerHTML  =document.getElementById('login').innerHTML  = loggedMessage 
    const butt = document.getElementById('login')
    console.log(butt)
    butt.addEventListener('submit',()=>{
        document.cookie=";expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"
        document.location.assign('../index.html')

    })
    
}

module.exports=logout