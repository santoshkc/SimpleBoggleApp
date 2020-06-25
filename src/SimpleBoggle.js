import React,{Component} from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import {RemoteServer} from './ServerInfo'

import { GameBoard } from "./GameBoard";

const timeRemaining = 180

export class SimpleBoggleGame extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            score: 0,
            gameBoard: new GameBoard(),
            matchedWords : [],
            inputWord: "",
            errorMessage: "",
            timeRemaining : timeRemaining,
        }
    }

    componentDidMount  = () => {
        this.runTimer()
    }

    getCurrentScore = () => {
        let sum = 0;
        for(let i = 0; i < this.state.matchedWords.length; i++) {
            sum += this.state.matchedWords[i].length
        }
        return sum
    }

    runTimer = () => {

        if(this.state.timeRemaining > 0) {        
            
            let timerId = setInterval( () => {
                let currentTimerValue = this.state.timeRemaining;

                if(currentTimerValue <= 0) {
                    clearInterval(timerId)
                    this.setState({timeRemaining: 0})
                    return
                }
                this.setState({timeRemaining: currentTimerValue - 1})
                },1000);
        }
    }

    render = () => {
        return (
            <div className = "container-fluid">
                <div className = "row bg-info p-2">
                    <BannerComponent score = {this.getCurrentScore()} timerText = {this.state.timeRemaining}/>
                </div>
                <div className = "row p-2 m-2">
                    <div id = "board" className = "col-4">
                        <BoardComponent board = {this.state.gameBoard.board}/>
                    </div>
                    <div id = "wordList" className = "col-3 m-2">
                        <MatchedWordListComponent words = {this.state.matchedWords}/>
                    </div>
                </div>
                <div id = "gameInput" className = "row m-2 p-2">
                        <form onSubmit = {this.wordValidation}>
                            <div className = "row">
                                <input type = "text" onChange = { 
                                    (event) => {
                                        if(this.state.timeRemaining <= 0)
                                            return
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
                            <div className = {"row m-1" + this.state.errorMessage.length > 0 ? "bg-warn": ""}>
                                {this.state.errorMessage}
                            </div>
                        </form>
                </div>
            </div>
        )
    }

    requestToServer = async (wordToCheck)  => {

        var details = {
            'typedText': wordToCheck,
        };
        
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        //await new Promise(resolve => setTimeout(resolve,10000))

        let response = await fetch(RemoteServer,
            {
                method : 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: formBody
            }
        ).catch(error => {
            alert(error)
            console.log(error)
        });

        if(response && response.status === 200) {
            let result = await response.json()
            let wordFound = result['WordFound'];
            if(wordFound == true) {
                return true
            }
        }
        return false;
    }

    addWordToMatchedList = async (word) => {

        let wordToCheck = word.toLowerCase()
        
        if(this.alreadyInMatchedWordsList(wordToCheck))
        {
            this.setState({
                errorMessage : "Word already added to matched list",
            })
            return
        }

        let wordFound = await this.availableInDictionary(wordToCheck)
        if(wordFound) {
            let newMatchedWords = [...this.state.matchedWords,wordToCheck]
            this.setState({
                matchedWords: newMatchedWords,
                errorMessage: "",
                inputWord : "",
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

    availableInDictionary = async (word) => {
        let wordInDictionary = await this.requestToServer(word)
        return wordInDictionary
    }

    setInvalidWordError = (errorText) => {
        this.setState({
            errorMessage: errorText,
            inputWord: "",
        })
    }

    wordValidation = async (event) => {
        event.preventDefault()

        if(this.state.timeRemaining <= 0) {
            this.setInvalidWordError("Time up")
            return
        }

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

        if( await this.state.gameBoard.checkIfMoveIsValid(wordEntered) === false) {
            this.setInvalidWordError("Word move is not valid")
            return
        }
        await this.addWordToMatchedList(wordEntered)
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
        const style = {
            width : "40px",
            height : "40px"
        }
        const value = this.props.character
        return (
            <button style = {style} className = "btn btn-light m-1 p-1" >{value}</button>
        )
    }
}

class MatchedWordListComponent extends Component {

    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <div className = "table table-sm table-bordered table-striped">
                <table>
                    <thead>
                        <th>Word</th>
                        <th>Score</th>
                    </thead>
                    <tbody>
                        {
                            this.props.words.map(
                                (value,index) => {
                                return (<tr key = {index}>
                                            <td>{value}</td>
                                            <td>{value.length}</td>
                                        </tr>)
                            }
                        )}
                    </tbody>

                </table>

            </div>
            )
    }
}