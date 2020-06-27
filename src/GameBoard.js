const sizeOfBoardRow = 4;

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

        let wordToCheck = word.toLowerCase()

        let indexes = this.getAllBoardOccurences(wordToCheck[0])
        if(!indexes)
            return false

        for(let loopIndex = 0; loopIndex < indexes.length; loopIndex++) {
            let alreadyUsedCells = []
            let isMoveValid = true;
            let firstCharacterIndex = indexes[loopIndex]
            for(let i = 0; i < wordToCheck.length -1 ; i++) {
                // could not find character in the board
                let indexArray = i === 0 ? firstCharacterIndex : this.indexFromCharacter(wordToCheck.charAt(i));
                if(!indexArray) {
                    isMoveValid = false;
                    break;
                }
                let [currentCharRow,currentCharColumn] = indexArray;

                // this will check if same cell is used more than once
                let actualArrayIndex = this.rowColumnToIndex(...indexArray)
                if(alreadyUsedCells.includes(actualArrayIndex)) {
                    isMoveValid = false;
                    break;
                }
                alreadyUsedCells.push(actualArrayIndex)
                
                let nextChar = wordToCheck.charAt(i+1)
                // could not find next character in the board
                let indexArray2 = this.indexFromCharacter(nextChar)
                if(!indexArray2) {
                    isMoveValid = false;
                    break;
                }
                let [nextCharRow,nextCharColumn] = indexArray2;

                // check whether last cell is repeated
                if(i+1 === wordToCheck.length - 1) {
                    // this will check if same cell is used more than once
                    let actualArrayIndex = this.rowColumnToIndex(...indexArray2)
                    if(alreadyUsedCells.includes(actualArrayIndex)) {
                        isMoveValid = false;
                        break;
                    }
                    alreadyUsedCells.push(actualArrayIndex)
                }

                let neighbours = this.getNearestNeighbour(currentCharRow,currentCharColumn)

                var existsInNeighbourhood = neighbours.some( (value,index) => {
                    let [r,c] = value
                    return  r === nextCharRow && c === nextCharColumn
                })

                // next character not in neighbour
                if(!existsInNeighbourhood) {
                    isMoveValid = false
                    break;
                }
            }
            if(isMoveValid === true)
                return true
        }
        return false
    }
}