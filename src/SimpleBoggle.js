import React,{Component} from 'react'

import 'bootstrap/dist/css/bootstrap.css'

export class SimpleBoggleGame extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            score: 100,
            board: Array(16).fill(null),
            matchedWords : []
        }
    }

    render = () => {
        return (
            <div className = "container-fluid">
                <div className = "row bg-info text-center p-2">
                    <h1>Welcome to Simple Boggle(Score: {this.state.score})</h1>
                </div>
                <div className = "row p-2 m-2">
                    <div id = "board" className = "col-4">
                        <p>Text Board</p>
                    </div>
                    <div id = "wordList" className = "col">
                        <ul>
                            <li>A</li>
                            <li>B</li>
                            <li>C</li>
                        </ul>
                    </div>
                </div>
                <div id = "gameInput">
                    <input type = "text" />
                </div>
            </div>
        )
    }
}