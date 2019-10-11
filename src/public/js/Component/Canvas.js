
//Canvas will take socket as props
class Canvas extends React.Component{
    constructor(props){
        super(props)
        var canvas
        this.state={canvas,pressed:false}
        this.handleMouseDown=this.handleMouseDown.bind(this)
        this.handleMouseMove=this.handleMouseMove.bind(this)
        this.handleMouseUp=this.handleMouseUp.bind(this)
    }
    draw(x,y){
        const ctx=canvas.getContext('2d')
        ctx.fillRect(x,y,5,5)
        
    }
    componentDidMount(){
        const canvas = document.getElementById('myCanvas')
        this.setState({canvas})
        this.props.socket.on('draw',(x,y)=>{
            draw(x,y)
        })
    }
    handleMouseDown(event){
        this.setState({pressed:true})
        
    }
    handleMouseMove(event){
        if (this.state.pressed){
            const canvas = this.state.canvas
            const ctx=canvas.getContext('2d')
            const rect = event.target.getBoundingClientRect()
            draw(x,y)
            this.props.socket.emit('draw',x,y)

        }
    }
    handleMouseUp(event){
        this.setState({pressed:false})
    }

    render(){
        return(
        <div>
        <canvas id="myCanvas" width="2000" height="1000" onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
</canvas>
    </div>)
    }
}

ReactDOM.render(<Canvas />, document.getElementById("Canvas"))