import React,{Component} from 'react'

import 'bootstrap/dist/css/bootstrap.css'

export class SimpleBoggleGame extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            score: 100,
            board: [["x","y","z","5"],
                    ["z","y","z","u"],
                    ["x","n","z","a"],
                    ["x","y","m","a"]
                    ],  
            matchedWords : ["abc"],
            dictionary: ["abc,def","xyz","car","rat"]
        }
    }

    render = () => {
        return (
            <div className = "container-fluid">
                <div className = "row bg-info text-center p-2">
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
                <div id = "gameInput">
                    <input type = "text" />
                </div>
            </div>
        )
    }
}

class BannerComponent extends Component {
    constructor(props) {
        super(props)
    }

    render = () => {

        return (
            <div id = "banner" className = "container-fluid">
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

        // const array = [["x","y","z","a"],
        //     ["x","y","z","a"],
        //     ["x","y","z","a"],
        //     ["x","y","z","a"]
        // ];
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