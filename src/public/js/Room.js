//!!! Chat part !!!//

const socket=io('http://127.0.1.1:3001')

const formatMessage = function(username,message){
    return `${username} :${message}`
}

class Score extends React.Component{
    constructor(props){
        super(props)
        var timer
        this.state={score:[],drawingWord:'',timer}
    }
    componentDidMount(){
        this.props.socket.on('askForScore',()=>{
            this.props.socket.emit('getScore')
        })
        // Socket was used to serve the purpose of fetch. perhaps i should change it
        this.props.socket.on('score',(score)=>{
            this.setState({score})
        })
        this.props.socket.on('drawWord',(word)=>{
            this.setState({drawingWord:word})
        })
        this.props.socket.on('timer',(timer)=>{
            this.setState({timer})
        })
    }
    
    render(){
        const renderedScore=this.state.score.map((playerScore,pos)=>{
            if (pos === 0){
                const drawingWord = this.state.drawingWord
                if (drawingWord !==''){
                    return <div>
                        <div>Draw : {drawingWord}</div>
                        <li> {playerScore[0]} : {playerScore[1]}</li>
                    </div>
                }
            }
            return <li> {playerScore[0]} : {playerScore[1]}</li>
        })
        return (<div>
            <div class='timer'>Timer : {this.state.timer}</div>
        <div>
        <h4>Score</h4>
            {renderedScore}
        </div>
        </div>)
    }

    

}


class MessageBox extends React.Component{
    constructor(props){
        super(props)
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    handleSubmit(){
    var {username}= JSON.parse(document.cookie.replace(';path=/',''))
    event.preventDefault()
    const message=document.getElementById('message-box').value
    document.getElementById('message-box').value=''
    this.props.socket.emit('sendMessage',message,username)
    }

    render(){
        return(
            <div class="chatsender">
            <form id="message-form" onSubmit={this.handleSubmit}>
                <label></label>
                <input type='text' class="chatsender" placeholder="message" id='message-box'/>
                <input type='submit'value="send" />
            </form></div>
        )
    }
}

class Chat extends React.Component{
    //chat needs socket as props
    constructor(props){
        super(props)
        var socket 
        this.state={messages:[],socket}
    }

    messagesEndRef=React.createRef()
    scrollToBottom(){
        var elem = document.getElementById('conversation')
        elem.scroll(500,200)
        console.log(elem.scrollTop)
    }

    componentDidMount(){
        // Need to add validation for room name
        var socket =this.props.socket
        const {name}=Qs.parse(document.location.search,{ignoreQueryPrefix:true})
        var {username,token}= JSON.parse(document.cookie.replace(';path=/',''))
        this.setState({socket})
        socket.emit('join',name,username,token)
        socket.on('receiveMessage',(message,user)=>{
            const messages = this.state.messages.slice().concat([formatMessage(user,message)])
            this.setState({messages})
        })
        socket.on('welcome',(message)=>{
            const messages = this.state.messages.concat([message])
            this.setState({messages})
        })
    }
    componentDidUpdate(){
        this.scrollToBottom()
    }
    render(){
        const conversation = this.state.messages.map((message)=>{
            return(
                <p>{message}</p>
            )
        })
        return(
            <div ref ={this.messagesEndRef} id='conversation' >
            {conversation}
            <MessageBox socket={this.state.socket}/>
            </div>
        )
    }
}   



//!!! Canvas part !!!//


//Canvas will take socket as props
class WidthChanger extends React.Component{
    constructor(props){
        super(props);
        this.handleClick=this.handleClick.bind(this)
    }
    handleClick(e){

        this.props.socket.emit('changeWidth',this.props.width)
    }
    render(){
        const id="width-"+this.props.width
        return(
            <span onClick={this.handleClick} id={id}></span>
        )
    }
}
class Eraser extends React.Component{
    constructor(props){
        super(props);
        this.handleClick=this.handleClick.bind(this)
    }
    handleClick(e){

        this.props.socket.emit('changeColor',this.props.color)
        this.props.socket.emit('changeWidth')


    }
    render(){
        return(
            <div>
            <input type="button" class="eraser-button" onClick={this.handleClick}>
            </input>
            </div>)

    }

}
class Colorbox extends React.Component{
    constructor(props){
        super(props);
        this.handleClick=this.handleClick.bind(this)
    }
    handleClick(e){

        this.props.socket.emit('changeColor',this.props.color)


    }
    render(){
        return(
            <td bgcolor={this.props.color} onClick={this.handleClick}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
        )

    }
}
class Canvas extends React.Component{
    constructor(props){
        super(props)
        var canvas
        this.state={canvas,pressed:false,role:'',xpre:0,ypre:0,color:'#000000',width:3}
        this.handleMouseDown=this.handleMouseDown.bind(this)
        this.handleMouseMove=this.handleMouseMove.bind(this)
        this.handleMouseUp=this.handleMouseUp.bind(this)
    }
    draw(x,y,color){
        const canvas = document.getElementById('myCanvas')
        const ctx=canvas.getContext('2d')
        ctx.beginPath()
        ctx.lineWidth = this.state.width

        try{
            const xpre=this.state.xpre
            const ypre=this.state.ypre
            const dist = Math.pow(Math.pow(x-xpre,2)+ Math.pow(y-ypre,2),0.5)
            ctx.moveTo(this.state.xpre,this.state.ypre)
            ctx.lineTo(x,y)
            try{
            ctx.strokeStyle = color}
            catch(e){
                //color=black
            }
            ctx.stroke()
            this.setState({xpre:x,ypre:y})
        }
        catch(e){console.log(e)}
            
    }
    componentDidMount(){
        const canvas = document.getElementById('myCanvas') // get canvas
        this.setState({canvas}) //the component starts with empty  canvas so we change that
        this.props.socket.on('changeWidth',(width)=>{
            this.setState({width})
        })
        this.props.socket.on('role',(role)=>{
            this.setState({role}) // gets role from server : drawer or guesser
            console.log(role)
        })
        this.props.socket.on('getWinningWord',()=>{ // server needs to communicate with the drawer then send the word to
            // guessers
            this.props.socket.emit('getWinningWord')
        })
        this.props.socket.on('winningWord',(word)=>{ 
            this.props.socket.emit('winningWord',word)
        })
        this.props.socket.on('changeColor',(color)=>{
            this.setState({color})
        })
        this.props.socket.on('draw',(x,y,color)=>{ // gets pixel coordinate from serv.. who get em from drawer
            this.draw(x,y,color)
        })
        this.props.socket.on('updateRole',()=>{
            this.props.socket.emit('updateRole')
        })
        this.props.socket.on('clearCanvas',()=>{
            this.props.socket.emit('newWordGuess')
            const canvas = this.state.canvas
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        })
        this.props.socket.on('pre',(xpre,ypre)=>{
            this.setState({xpre,ypre})
        })
    }

    handleMouseDown(event){
        this.setState({pressed:true})
        const rect = event.target.getBoundingClientRect()
            const x= event.clientX-rect.left
            const y=event.clientY-rect.top
        this.props.socket.emit('pre',x,y)
        this.setState({xpre:x,ypre:y})
        
    }
    handleMouseMove(event){
        if (this.state.pressed){
            const rect = event.target.getBoundingClientRect()
            const x= event.clientX-rect.left
            const y=event.clientY-rect.top
            this.props.socket.emit('draw',x,y,this.state.color)

        }
    }
    handleMouseUp(event){
        this.setState({pressed:false})
    }

    render(){
        var width = 0.7*window.screen.width
        var height=450
        return(
        <div>
        <canvas id="myCanvas" class="border border-success" width={width} height={height}onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
</canvas>
    </div>)
    }
}


//!!! Room part !!!//
class DrawingTools extends React.Component{
    render(){
        return(
            <div>
            <div>
                <table>
                    <tbody>
                    <tr>
                        <WidthChanger width={3} socket={this.props.socket} id="width-3" />
                        <WidthChanger width={10} socket={this.props.socket} id="width-10" />
                        <WidthChanger width={15} socket={this.props.socket}id="width-15" /> 
                    </tr>
                    </tbody>
                </table>
            </div>
            <table>
                <tbody>
                <tr>
                    <Colorbox color='#FF0000' socket={this.props.socket}/>
                    <Colorbox color='#800000' socket={this.props.socket}/>
                    <Colorbox color='#FFFF00' socket={this.props.socket}/>
                </tr>
                <tr>
                    <Colorbox color='#27AE60' socket={this.props.socket}/>
                    <Colorbox color='#2471A3' socket={this.props.socket}/>
                    <Colorbox color='#7D3C98' socket={this.props.socket}/>
                </tr>
                <tr>
                    <Colorbox color='#7D3C98' socket={this.props.socket}/>
                    <Colorbox color='#BA4A00' socket={this.props.socket}/>
                    <Colorbox color='#000000' socket={this.props.socket}/>
                </tr>
                <tr>
                    <Eraser color='#FFFFFF' socket={this.props.socket}/>
                </tr>
                </tbody>
            </table></div>
        )
    }
}
class Room extends React.Component{
    constructor(props){
        super(props)
        this.state={role:''}
    }
    componentDidUpdate(){
        socket.on('updateRole',()=>{
            console.log('socket received event update role')
            socket.emit('getRole')
            socket.on('role',(role)=>{
                console.log(role)
                this.setState({role}) 
            })
            
        })

    }
    componentDidMount(){
        socket.emit('getrole')
        socket.on('role',(role)=>{
            this.setState({role})
        })
    }
    render(){
        var drawingTools = <div></div>
        if (this.state.role==='drawer'){
            drawingTools=<DrawingTools socket={socket}/>
        }
        return (
        <div>
        {drawingTools}
        <div class="float-right chatbox" id="chat-part" >
            <Score socket={socket}/>
                <h4> Chat </h4>
                <Chat socket={socket} />
            </div>
            <div>
                <Canvas socket={socket} />
            </div>
        </div>
        )
    }
}

ReactDOM.render(<Room/>, document.getElementById("Canvas"))

