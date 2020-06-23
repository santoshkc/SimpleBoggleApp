import React,{Component} from 'react'

import 'bootstrap/dist/css/bootstrap.css'

export class SimpleBoggleGame extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            score: 0,
            board: [["x","y","z","5"],
                    ["z","y","z","u"],
                    ["x","n","z","a"],
                    ["x","y","m","a"]
                    ],  
            matchedWords : [],
            dictionary: ["abc,def","xyz","car","rat"],
            inputWord: "",
            errorMessage: ""
        }
    }

    render = () => {
        return (
            <div className = "container-fluid">
                <div className = "row bg-info p-2">
                    <BannerComponent score = {this.state.score} timerText = {"1:00"}/>
                </div>
                <div className = "row p-2 m-2">
                    <div id = "board" className = "col-4">
                        <BoardComponent board = {this.state.board}/>
                    </div>
                    <div id = "wordList" className = "col">
                        <MatchedWordListComponent words = {this.state.matchedWords}/>
                    </div>
                </div>
                <div id = "gameInput" className = "row m-2 p-2">
                        <form onSubmit = {this.wordValidation}>
                            <div className = "row">
                                <input type = "text" onChange = { 
                                    (event) => {
                                        let typedWord = event.target.value;
                                        if(typedWord) {
                                            typedWord = typedWord.trim().toLowerCase()
                                            if(typedWord.length > 0)
                                                this.setState({inputWord:  typedWord})
                                        }
                                    }
                                }/>
                                <input type = "submit" value = "Check"/>
                            </div>
                            <div className = "row m-1">
                                {this.state.errorMessage}
                            </div>
                        </form>
                </div>
            </div>
        )
    }

    addWordToMatchedList = (word) => {
        let wordToCheck = word.toLowerCase()
        
        if(this.alreadyInMatchedWordsList(wordToCheck))
        {
            this.setState({
                errorMessage : "Word already added to matched list",
            })
            return
        }

        if(this.availableInDictionary(wordToCheck)) {
            let newScore = Number(this.state.score) + wordToCheck.length
            let newMatchedWords = [...this.state.matchedWords,wordToCheck]
            this.setState({
                matchedWords: newMatchedWords,
                errorMessage: "",
                inputWord : "",
                score : newScore,
            })

        } else {
            this.setState({
                errorMessage : "Word not found in dictionary",
            })
        }
    }

    alreadyInMatchedWordsList(word) {
        return this.state.matchedWords.includes(word)
    }

    availableInDictionary = (word) => {
        return this.state.dictionary.includes(word)
    }

    setInvalidWordError = (errorText) => {
        this.setState({
            errorMessage: errorText,
            inputWord: "",
        })
    }

    wordValidation = (event) => {
        event.preventDefault()
        let wordEntered = this.state.inputWord;

        if(!wordEntered) {
            this.setInvalidWordError("Word should not be empty.")
            return
        }

        wordEntered = wordEntered.trim()

        if(wordEntered.length === 0) {
            this.setInvalidWordError("Word should not be whitespace only.")
            return
        }

        if(wordEntered.length < 3)
        {
            this.setInvalidWordError("Word should be of length 3 or more")
            return
        }
        this.addWordToMatchedList(wordEntered)
    }
}

class BannerComponent extends Component {
    constructor(props) {
        super(props)
    }

    render = () => {

        return (
            <div id = "banner" className = "container-fluid text-center">
                <div className = "row text-center">
                    <h1>Welcome to Simple Boggle</h1>
                </div>
                <div className = "row">
                    <div className = "col-3 p-2">
                        Score : {this.props.score}
                    </div>
                    <div className = "col p-2">
                        Time Remaining : {this.props.timerText}
                    </div>
                </div>
            </div>
        )
    }
}

class BoardComponent extends Component {

    constructor(props) {
        super(props) 
    }

    render = () => {
        const array  = this.props.board;
        const rowSize = 4;

        return (
            <div className = "container">
                {
                    array.map((rowArray,i) =>
                        <div className = "row">
                            {
                                rowArray.map( (v,j) =>
                                    <BoardCell character = {v} />
                                )
                            }
                        </div>
                    )
                }
            </div>
        )
    }
}

class BoardCell extends Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        const value = this.props.character
        return (
            <button className = "m-2 p-2" >{value}</button>
        )
    }
}

class MatchedWordListComponent extends Component {

    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <ul>
                {
                this.props.words.map(
                (value,index) => {
                    return <li key = {index}>{value}</li>
                }
            )}
            </ul>
            )
    }
}