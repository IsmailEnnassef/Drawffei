
const formatMessage = function(username,message){
    return `${username} :${message}`
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
            <form id="message-form" onSubmit={this.handleSubmit}>
                <label> message </label>
                <input type='text' placeholder="message" id='message-box'/>
                <input type='submit'value="send"/>
            </form>
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

    componentDidMount(){
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

    render(){
        const conversation = this.state.messages.map((message)=>{
            return(
                <p class='messages'>{message}</p>
            )
        })
        return(
            <div class='conversation'>
            {conversation}
            <MessageBox socket={this.state.socket}/>
            </div>
        )
    }
}   
