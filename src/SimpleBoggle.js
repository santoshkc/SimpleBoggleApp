import React,{Component} from 'react'

import 'bootstrap/dist/css/bootstrap.css'

export class SimpleBoggleGame extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            score: 0,
            board: this.getInitializedBoard(4),
            matchedWords : [],
            dictionary: ["abc,def","xyz","car","rat"],
            inputWord: "",
            errorMessage: "",
            timeRemaining : 120,
        }
        //this.printNearestNeightbour()
    }

    componentDidMount  = () => {
        this.runTimer()
    }

    checkIfMoveIsValid = (word) => {

        let wordToCheck = word.toLowerCase() 

        for(let i = 0; i < wordToCheck.length -1 ; i++) {
            let currentChar = wordToCheck.charAt(i)
            let [currentCharRow,currentCharColumn] = this.indexFromCharacter(currentChar);
            
            // could not find character in the board
            if(!currentCharRow )
                return false
            let nextChar = wordToCheck.charAt(i+1)
            let [nextCharRow,nextCharColumn] = this.indexFromCharacter(nextChar)

            // could not find next character in the board
            if(!nextCharRow)
                return false;


            let neighbours = this.getNearestNeighbour(currentCharRow,currentCharColumn)

            console.log(currentChar,nextChar,neighbours)

            var exists = neighbours.some( (value,index) => {
                let [r,c] = value
                return  r === nextCharRow && c === nextCharColumn
            })

            // next character not in neighbour
            if(!exists)
                return false
        }
        return true
    }

    indexFromCharacter = (character) => {
        const sizeOfBoardRow = 4;
        for(let i = 0; i < sizeOfBoardRow; i++) {
            for(let j = 0; j < sizeOfBoardRow; j++) {
                let value = this.state.board[i][j]
                if(value.toLowerCase() === character)
                    return [i,j]
            }
        }
        return null;
        // return this.state.board.find( (rowArray,index1) =>
        //     rowArray.find((value,index2) => {
        //         return value === character ? [index1,index2] : null
        //     })
        // )
    }

    printNearestNeightbour = () => {

        this.state.board.map( (v,i) => 
            v.map( (x, j) =>
            {
                console.log(`[${i},${j}, ${this.rowColumnToIndex(i,j)}] => ${this.getNearestNeighbour(i,j)}`)
            }
            )
        )
    }

    indexToRowColumn = (index) => {
        const sizeOfBoardRow = 4;
        let row = Math.floor( (index+1)/sizeOfBoardRow)
        let column = index%sizeOfBoardRow
        return [row,column]
    }

    rowColumnToIndex = (row,column) => {
        const sizeOfBoardRow = 4
        return row*sizeOfBoardRow + column
    }

    getNearestNeighbour =  (row,column) => {
        const sizeOfBoardRow = 4;

        let result = []

        for(let i = row-1; i <= row+1; i++) {
            if(i < 0 || i >  (sizeOfBoardRow - 1)) {
                continue;
            }
        
            for(let j = column-1; j <= column+1; j++) {
                if(j < 0 || j > sizeOfBoardRow - 1) {
                    continue;
                }

                if(i === row && j === column) {
                    continue;
                } else {
                    let item = [i,j]
                    //item = this.rowColumnToIndex(i,j)
                    result.push(item)
                }
            }
        }
        return result
    }

    getInitializedBoard(sizeOfGrid) {

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomizedAlphabetArray = alphabet.split('').sort( () => (Math.random()-0.5));
        
        let numbers = [];

        for (let row = 0; row < sizeOfGrid; row++) {
            let subArray = Array(sizeOfGrid);

            for(let column = 0; column < sizeOfGrid; column++) {
                
                let randomChar = randomizedAlphabetArray[row*sizeOfGrid + column];

                subArray[column] = randomChar;
            }
            numbers.push(subArray);
        }
        return numbers;
    }

    runTimer = () => {

        if(this.state.timeRemaining > 0) {        
            
            let timerId = setInterval( () => {
                let currentTimerValue = this.state.timeRemaining;

                if(currentTimerValue <= 0) {
                    clearInterval(timerId)
                    this.setState({timeRemaining: 0})
                }
                this.setState({timeRemaining: currentTimerValue - 1})
                },1000);
        }
    }

    render = () => {
        return (
            <div className = "container-fluid">
                <div className = "row bg-info p-2">
                    <BannerComponent score = {this.state.score} timerText = {this.state.timeRemaining}/>
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

        if(this.checkIfMoveIsValid(wordEntered) == false) {
            this.setInvalidWordError("Word move is not valid")
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