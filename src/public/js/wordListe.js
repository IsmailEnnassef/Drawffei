const findWordAndDelete = function(words,word){
    var i
    var result=[]
    for (i=0;i<words.length;i++){
        if (words[i] != word){
            result = result.concat([ words[i] ])
        }
    }
    return result
}
class WordList extends React.Component{
    constructor(props){
        super(props);
        this.state = {words:[]}
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    componentDidMount(){
        fetch('http://127.0.1.1:3001/file/read',{method:'GET'}).then(async (file)=>{
            const Jason = await file.json()
            const wordList = findWordAndDelete(Jason.data.split(' '),'')
            this.setState({words:wordList})
        }).catch((e)=>{
            console.log(e)
        })
    }

    handleSubmit(event){
        event.preventDefault()
        const word = document.getElementById('addedWord').value
        document.getElementById('addedWord').value = '' 
        var words = this.state.words.slice()
        words = words.concat([word])
        this.setState({words})
        fetch(`http://127.0.1.1:3001/file/add/${word}`,{method:'POST'})
    }

    handleClick(word){
        event.preventDefault()
        const words = this.state.words.slice()
        const wordsUpdate = findWordAndDelete(words,word)
        this.setState({words:wordsUpdate})
        fetch(`http://127.0.1.1:3001/file/delete/${word}`,{method:'DELETE'})
    }
    


    renderAdd(){
        return (<form onSubmit={this.handleSubmit}>
            <input type='text' placeholder="Add word" id="addedWord"/>
            <input type="submit"/>
        </form>)
    }

    renderDelete(word){
        return( <button onClick={()=>{this.handleClick(word)}}> Delete </button>)
    }

    render(){
        const words = this.state.words.slice()
        const renderedWords = words.map((word)=>{
            return <li> {word} {this.renderDelete(word)} </li>
        })

        return(
            <div>
                {renderedWords}
                {this.renderAdd()}
            </div>
        )
    }
} 

ReactDOM.render(<WordList/>, document.getElementById("wordListe"))
