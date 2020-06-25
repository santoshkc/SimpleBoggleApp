const sizeOfBoardRow = 4;

export class GameBoard {
    constructor() {
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
        for(let i = 0; i < sizeOfBoardRow; i++) {
            for(let j = 0; j < sizeOfBoardRow; j++) {
                let value = this.board[i][j]
                if(value.toLowerCase() === character)
                    return [i,j]
            }
        }
        return null;
    }

    indexToRowColumn = (index) => {
        let row = Math.floor( (index+1)/sizeOfBoardRow)
        let column = index%sizeOfBoardRow
        return [row,column]
    }

    rowColumnToIndex = (row,column) => {
        return row*sizeOfBoardRow + column
    }

    getNearestNeighbour =  (row,column) => {
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

    checkIfMoveIsValid = async (word) => {

        let wordToCheck = word.toLowerCase()
        
        let alreadyUsedCells = []

        for(let i = 0; i < wordToCheck.length -1 ; i++) {
            let currentChar = wordToCheck.charAt(i)
            // could not find character in the board
            let indexArray = this.indexFromCharacter(currentChar);
            if(!indexArray) {
                return false;
            }
            let [currentCharRow,currentCharColumn] = indexArray;

            // this will check if same cell is used more than once
            let actualArrayIndex = this.rowColumnToIndex(...indexArray)
            if(alreadyUsedCells.includes(actualArrayIndex)) {
                return false;
            }
            alreadyUsedCells.push(actualArrayIndex)
            
            let nextChar = wordToCheck.charAt(i+1)
            // could not find next character in the board
            let indexArray2 = this.indexFromCharacter(nextChar)
            if(!indexArray2) {
                return false;
            }
            let [nextCharRow,nextCharColumn] = indexArray2;

            // check whether last cell is repeated
            if(i+1 === wordToCheck.length - 1) {
                // this will check if same cell is used more than once
                let actualArrayIndex = this.rowColumnToIndex(...indexArray2)
                if(alreadyUsedCells.includes(actualArrayIndex)) {
                    return false;
                }
                alreadyUsedCells.push(actualArrayIndex)
            }

            let neighbours = this.getNearestNeighbour(currentCharRow,currentCharColumn)

            var existsInNeighbourhood = neighbours.some( (value,index) => {
                let [r,c] = value
                return  r === nextCharRow && c === nextCharColumn
            })

            // next character not in neighbour
            if(!existsInNeighbourhood)
                return false
        }
        return true
    }
}