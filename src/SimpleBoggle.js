import React,{Component} from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import {RemoteServer} from './ServerInfo'

import { GameBoard } from "./GameBoard";

const timeRemaining = 180

export class SimpleBoggleGame extends React.Component {

    constructor(props) {
        super(props)

        this.state = this.resetGameState()
    }

    resetGameState = () => {

        let newState = {
            score: 0,
            gameBoard: new GameBoard(),
            matchedWords : [],
            inputWord: "",
            errorMessage: "",
            timeRemaining : timeRemaining,
        }
        return newState
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
            <div className = "container">
                <div className = "row bg-info p-2">
                    <div className = "col-6">
                        <BannerComponent score = {this.getCurrentScore()} timerText = {this.state.timeRemaining}/>
                    </div>
                </div>
                <div className = "row p-2 mt-2">
                    <div id = "board" className = "col-4">
                        <BoardComponent board = {this.state.gameBoard.board}/>
                    </div>
                    <div id = "wordList" className = "col-3 ml-2">
                        <MatchedWordListComponent words = {this.state.matchedWords}/>
                    </div>
                    <div id = "gameReset" className = "col ml-2">
                        <button className = "btn btn-dark" onClick = {(event) => {
                            let initialState = this.resetGameState()
                            this.setState(initialState)
                        }}>Reset Game!</button>

                    </div>
                </div>
                <div id = "gameInput" className = "row mt-2">
                        <form onSubmit = {this.wordValidation}>
                            <div className = "row">
                                <input type = "text" value = {this.state.inputWord || ""} onChange = { 
                                    (event) => {
                                        if(this.state.timeRemaining <= 0) {
                                            event.target.value = ""
                                            this.setState({errorMessage : "Time is up"})
                                            return
                                        }
                                        let typedWord = event.target.value;
                                        typedWord = typedWord.trim().toLowerCase()
                                        this.setState({inputWord:  typedWord})
                                    }
                                }/>
                                <input className = "btn btn-dark ml-2" type = "submit" value = "Check"/>
                            </div>
                            { 
                                this.state.errorMessage.length > 0 ? 
                                    <div className = "row mt-1 text-danger">
                                        <strong>{this.state.errorMessage}</strong>
                                    </div> : <div></div>
                            }
                        </form>
                </div>
            </div>
        )
    }

    requestToServer = async (wordToCheck)  => {

        var details = {
            'typedText': wordToCheck,
        };
        
        //await new Promise(resolve => setTimeout(resolve,10000))

        let response = await fetch(RemoteServer,
            {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                cors: "cors",
                body: JSON.stringify(details),
            }
        ).catch(error => {
            alert(error)
            console.log(error)
        });

        if(response && response.status === 200) {
            let result = await response.json()
            let wordFound = result['WordFound'];
            if(wordFound === true) {
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

        let alphabetPattern = "^[a-zA-Z]+$";
        if(!wordEntered.match(alphabetPattern)) 
        {
            this.setInvalidWordError("Word should consists of only alphabets")
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
                        Time Remaining : {this.props.timerText} Seconds
                    </div>
                </div>
            </div>
        )
    }
}

class BoardComponent extends Component {

    render = () => {
        const array  = this.props.board;

        return (
            <div className = "container">
                {
                    array.map((rowArray,i) =>
                        <div key = {i} className = "row">
                            {
                                rowArray.map( (v,j) =>
                                    <BoardCell key = {j} character = {v} />
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

    render = () => {
        return (
                <div className = "container-fluid">
                    <div className = "bg-info text-center font-weight-bold">
                        Matched Words
                    </div>
                    <table className = "table table-sm table-bordered table-striped mt-1">
                        <thead>
                            <tr>
                                <th>Word</th>
                                <th>Score</th>
                            </tr>
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