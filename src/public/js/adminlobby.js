const logoutMessage=function(){
    const loggedMessage ="<form class='form-inline my-2 my-lg-0' id='logbutt'><div>Welcome "+username+"&nbsp&nbsp"+"</div> <input type='submit'  value='logout' class='btn btn-sm btn-outline-secondary'/> </form>"
    document.getElementById('logged').innerHTML  = loggedMessage 
    const butt = document.getElementById('logged')
    butt.addEventListener('submit',()=>{
        document.cookie=";expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"
        document.location.assign('../index.html')

    })
    
}
function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
  }

try{
    var {username,token}= JSON.parse(document.cookie.replace(';path=/',''))}
    catch(e){
         username=false
    }
logoutMessage()

class Room extends React.Component{
    constructor(props){
        super(props);
        this.visitRoom =this.visitRoom.bind(this)
    }

    visitRoom(){
        document.location.href= updateQueryStringParameter('/room.html','name',this.props.name)
    }

    componentWillUnmount(){
       fetch('http://127.0.1.1:3001/croomsId/'+this.props.id,{method:'DELETE',
       
       headers:{
           'Authorization':'Bearer '+token
       }})

    }

    render(){
        return <button key={this.props.id} onClick={this.visitRoom}> Enter room {this.props.name}</button>
    }


}

class Lobby extends React.Component{
    constructor(props){
        super(props)
        // roomListe est un JSON
        this.state={roomListe:[],current:'',Updated:1}
        this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.create=this.create.bind(this)
    this.destroy=this.destroy.bind(this)
    }

    componentDidMount(){
        fetch('http://127.0.1.1:3001/roomliste',{method:'GET'}).then((liste)=>{
            liste.json().then((roomListe)=>{
                this.setState({roomListe})
            }).catch((e)=>{console.log(e)})
        }).catch(()=>{})

    }

        changeId( cle, valeur,liste ) {
        for (var i in liste) {
          if (liste[i].cle == cle) {
             liste[i].valeur = valeur;
             liste[i].completed=true
             break; //Stop this loop, we found it!
          }
        }
     }

     notCreated(name){
         const roomListe=this.state.roomListe.slice()
         var i
         for (i=0;i<roomListe.length;i++){
             if (roomListe[i].name==name){
                 
                 return false
             }}
         return true}


    componentDidUpdate(prevProps,prevState){
        const roomListe=this.state.roomListe.slice()
        const length = roomListe.length 
        if (!prevState.Updated ){
        fetch('http://127.0.1.1:3001/crooms/' + roomListe[length -1].name ,{method:'GET'}).then((room)=>{
            room.json().then((roomJson)=>{
                this.changeId(roomListe[length-1].name,roomJson._id,roomListe)
                this.setState({roomListe:roomListe,Updated:true})
            })
        })}
    }

    async create(name){
        if (this.notCreated(name) ){
            const roomListe=this.state.roomListe.slice() 
            const current = this.state.current   
            roomListe.push({name,_id:'',completed:false})
            await this.setState({roomListe,Updated:false},()=>{
                this.componentDidUpdate(undefined,{roomListe,Updated:true,current}) })
        }
    else{
        alert('Name already used')
    }}

    destroy(name){
            fetch('http://127.0.1.1:3001/crooms/'+name,{method:'DELETE',
        headers:{
            'Authorization':'Bearer '+token
        }})
            const roomListe=this.state.roomListe.slice()
            const roomListeSec= roomListe.filter(roomJson=>roomJson.name!=name)
            this.setState({roomListe:roomListeSec,Updated:false})
    }

    handleChange(event) {
        const word = event.target.value
        this.setState({current:word});
      }
    
      handleWordList(event){
        var {username}= JSON.parse(document.cookie.replace(';path=/',''))
        document.location.href = updateQueryStringParameter('../wordListe.html',"username",username)
      }

    handleSubmit(event){
        const {username} =JSON.parse(document.cookie.replace(';path=/',''))
        event.preventDefault()
        const name = this.state.current
        fetch('http://127.0.1.1:3001/crooms/' + name+'/'+username ,{method:'POST'}).then(
            ()=>{
                this.setState({current:'',Updated:false})
                this.create(name) // adds to liste, adds to db
            }
        )
    }

    renderCreate(){
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" value={this.state.current} onChange={this.handleChange}/>
                    </label>
                        <input type="submit" value="Creer une partie"/>
                </form>
            </div>
        )
    }
    getId(name){
        const roomListe=this.state.roomListe
        for (var i=0;i<roomListe.length;i++){
            if (roomListe[i].name===name){
                return roomListe[i]._id
            }
        }   
    }
    renderDestroy(name){
        return(
            <button id={this.getId(name)+'_destroy'} class="adminDestroy" onClick={(e)=>{this.destroy(name)}}>Supprimer {name}</button>
        )
    }

    renderWordList(){
        return(
            <button id="WordListe" onClick={this.handleWordList}>Changer la liste des mots</button>
        )
    }

    render(){
        const roomListe=this.state.roomListe.slice()
        const Available=roomListe.map((roomJson)=>{
            const {name,_id} = roomJson
            return(
                <li key={_id+"_li"} class="list-group-item roombuttons">
                <Room name={name} id={_id}/>
                {this.renderDestroy(name)}
                </li>
            )
        })
        return(<div class='lobby'>
            <div id="Status" class="creategame"> Create a game!</div>
            <div class="creategame">{this.renderCreate()}</div>
            <ol>
            <div>
        <div> pick a game !</div>
        <div>
            <ol class="list-group-item"> {Available}</ol>
        </div>
        <br></br>
        <br></br>
        <div>{this.renderWordList()}</div>
      </div>
            </ol>
            </div>

        )

    }
}
if(username){
ReactDOM.render(<Lobby />, document.getElementById("lobby"));
}
else{
    document.location.assign('../index.html')
}
