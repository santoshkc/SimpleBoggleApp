const sizeOfBoardRow = 4;

class BoardGenerator {
    constructor() {
        this.sizeOfBoardRow = 4
        // dice config for english
        // https://boardgames.stackexchange.com/questions/29264/boggle-what-is-the-dice-configuration-for-boggle-in-various-languages
        this.dices = [
        "RIFOBX", //0
        "IFEHEY", //1
        "DENOWS", //2
        "UTOKND", //3
        "HMSRAO", //4
        "LUPETS", //5
        "ACITOA", //6
        "YLGKUE", //7
        "QBMJOA", //8
        "EHISPN", //9
        "VETIGN", //10
        "BALIYT", //11
        "EZAVND", //12
        "RALESC", //13
        "UWILRG", //14
        "PACEMD" //15
        ]
    }

    generate() {
        let numbers = [];

        for (let row = 0; row < this.sizeOfBoardRow; row++) {
            let subArray = Array(this.sizeOfBoardRow);

            for(let column = 0; column < this.sizeOfBoardRow; column++) {
                let dice = this.dices[row*this.sizeOfBoardRow + column]

                let randomIndex = Math.floor(Math.random()*6)
                
                let randomChar = dice.charAt(randomIndex);

                subArray[column] = randomChar;
            }
            numbers.push(subArray);
        }
        return numbers;
    }
}

export class GameBoard {
    constructor(sizeOfBoardRow = 4) {
        this.sizeOfBoardRow = sizeOfBoardRow;
        this.board = this.getInitializedBoard(sizeOfBoardRow)
    }

    printNearestNeightbour = () => {
        this.board.map( (v,i) => 
            v.map( (x, j) =>
                console.log(`[${i},${j}, ${this.rowColumnToIndex(i,j)}
                ] => ${this.getNearestNeighbour(i,j)}`)
            )
        )
    }

    getInitializedBoard(sizeOfBoardRow) {
        let boardGenerator = new BoardGenerator()
        return boardGenerator.generate()
        // let duplicate = true;
        // if(duplicate)
        //     return this.getInitializedBoardWithDuplicateCharacter(this.sizeOfBoardRow)
        // else
        //     return this.getInitializedBoardInternal(this.sizeOfBoardRow)
    }

    getInitializedBoardInternal(sizeOfGrid) {

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

    getInitializedBoardWithDuplicateCharacter(sizeOfGrid) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        let numbers = [];

        for (let row = 0; row < sizeOfGrid; row++) {
            let subArray = Array(sizeOfGrid);

            for(let column = 0; column < sizeOfGrid; column++) {
                
                let rnd = Math.floor(Math.random()*sizeOfGrid*sizeOfGrid)
                let randomChar = alphabet[rnd];

                subArray[column] = randomChar;
            }
            numbers.push(subArray);
        }
        return numbers;

    }

    indexFromCharacter = (character) => {
        for(let i = 0; i < this.sizeOfBoardRow; i++) {
            for(let j = 0; j < this.sizeOfBoardRow; j++) {
                let value = this.board[i][j]
                if(value.toLowerCase() === character.toLowerCase())
                    return [i,j]
            }
        }
        return null;
    }

    indexToRowColumn = (index) => {
        let row = Math.floor( (index)/this.sizeOfBoardRow)
        let column = index%this.sizeOfBoardRow
        return [row,column]
    }

    rowColumnToIndex = (row,column) => {
        return row*this.sizeOfBoardRow + column
    }

    getNearestNeighbour =  (row,column) => {
        let result = []

        for(let i = row-1; i <= row+1; i++) {
            if(i < 0 || i >  (this.sizeOfBoardRow - 1)) {
                continue;
            }
        
            for(let j = column-1; j <= column+1; j++) {
                if(j < 0 || j > this.sizeOfBoardRow - 1) {
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

    getAllBoardOccurences = (character) => {
        let indexes = []
        for(let i = 0; i < this.sizeOfBoardRow; i++) {
            for(let j = 0; j < this.sizeOfBoardRow; j++) {
                if(this.board[i][j].toLowerCase() === character.toLowerCase())
                    indexes.push([i,j])
            }
        }
        return indexes;
    }

    checkIfMoveIsValid = async (word) => {
        return this.isValid(word)
    }

    isValidRecursive(headIndex,tail,visitedParentCells) {

        let immediateNeighbours = this.getNearestNeighbourFromIndex(headIndex)
        
        // copy parent visited data and append current cell as visited
        let visitedCells = [...visitedParentCells,headIndex]

        let isSubStringValid = false;
        
        for(let j = 0; j < immediateNeighbours.length; j++) {
            let neighbour = immediateNeighbours[j]
            let neighbourIndex = this.rowColumnToIndex(...neighbour)

            let neighbourChar = this.getCharacterFromIndex(neighbourIndex)

            if(neighbourChar.toLowerCase() === tail[0].toLowerCase()) {

                //already visited neighbour found
                // so ignore this neighbour
                if( visitedCells.includes(neighbourIndex) )
                    continue

                if(tail.length === 1) {
                    // no more letters available
                    // so given move is valid
                    isSubStringValid = true
                } else {
                    let newTail = tail.substring(1)
                    isSubStringValid = this.isValidRecursive(neighbourIndex,newTail,visitedCells)
                }

                if(isSubStringValid)
                    return true
            }
        }
        return false
    }

    isValid(word) {
        let head = word[0]
        let tail = word.substr(1)

        let headOccurencesOnBoard = this.getAllBoardOccurences(head);

        for(let i = 0; i < headOccurencesOnBoard.length; i++) {

            let currentOccurence = headOccurencesOnBoard[i]
            let headIndex = this.rowColumnToIndex(...currentOccurence)

            if(this.isValidRecursive(headIndex,tail,[]))
                return true
        }
        return false
    }

    getCharacterFromIndex(index) {
        let [row,column] = this.indexToRowColumn(index)
        return this.board[row][column]
    }

    getNearestNeighbourFromIndex(index) {

        let [row,column] = this.indexToRowColumn(index)
        let neighbours = this.getNearestNeighbour(row,column)
        return neighbours
    }
}