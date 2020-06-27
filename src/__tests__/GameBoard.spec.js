import { GameBoard  } from "../GameBoard";

function gameBoardInitializer() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let board = []
    const  sizeOfBoardSize = 4
    for(let i = 0; i < sizeOfBoardSize; i++) {
        let row = []
        for(let j = 0; j < sizeOfBoardSize; j++) {
            let character = alphabet[i*sizeOfBoardSize + j]
            row.push(character)
        }
        board.push(row)
    }
    return board
}

describe("Game Board", () => {
    // test stuff
    test("it should map row,column to 1-D array index", () => {
        const gameBoard = new GameBoard()
        expect(gameBoard.rowColumnToIndex(0,0)).toEqual(0)
        expect(gameBoard.rowColumnToIndex(3,3)).toEqual(15)
        expect(gameBoard.rowColumnToIndex(2,3)).toEqual(11)
        expect(gameBoard.rowColumnToIndex(3,2)).toEqual(14)
        // actual test
      });

    test("it should map 1-D array index to 2D array row,column", () => {
        const gameBoard = new GameBoard()
        expect(gameBoard.indexToRowColumn(0)).toEqual([0,0])
        expect(gameBoard.indexToRowColumn(15)).toEqual([3,3])
        expect(gameBoard.indexToRowColumn(11)).toEqual([2,3])
        expect(gameBoard.indexToRowColumn(12)).toEqual([3,0])

    });

    test("should map given character to game board row,column", () => {
        GameBoard.prototype.getInitializedBoard = () => {
            return gameBoardInitializer()
        }

        let gameBoard = new GameBoard();
        expect(gameBoard.indexFromCharacter('a')).toEqual([0,0])
        expect(gameBoard.indexFromCharacter('A')).toEqual([0,0])
        expect(gameBoard.indexFromCharacter('k')).toEqual([2,2])
        expect(gameBoard.indexFromCharacter('p')).toEqual([3,3])
        expect(gameBoard.indexFromCharacter('z')).toEqual(null)
    });

    test("should identify nearest neighbour of given character", () => {
        GameBoard.prototype.getInitializedBoard = () => {
            return gameBoardInitializer()
        }

        let gameBoard = new GameBoard()
        // top left corner
        let neighbours = gameBoard.getNearestNeighbour(0,0)
        expect(neighbours).toEqual([[0,1],[1,0],[1,1]])

        // bottom right
        neighbours = gameBoard.getNearestNeighbour(3,3)
        expect(neighbours).toEqual([[2,2],[2,3],[3,2]])

        // bottom left
        neighbours = gameBoard.getNearestNeighbour(0,3)
        expect(neighbours).toEqual([[0,2],[1,2],[1,3]])

        // top right
        neighbours = gameBoard.getNearestNeighbour(3,0)
        expect(neighbours).toEqual([[2,0],[2,1],[3,1]])

        // 5 neighbours
        neighbours = gameBoard.getNearestNeighbour(1,0)
        expect(neighbours).toEqual([[0,0],[0,1],[1,1],[2,0],[2,1]])

        // 8 neighbours
        neighbours = gameBoard.getNearestNeighbour(1,1)
        expect(neighbours).toEqual([[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]])

    });
  });