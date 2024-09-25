const crypto = require('node:crypto');
const readlineSync = require('readline-sync');
const AsciiTable = require('ascii-table');

class HMAC {
    constructor() {
        this.key = crypto.randomBytes(32);
    }

    generateHmac(message) {
        const hmac = crypto.createHmac('sha256', this.key).update(message).digest('hex');
        return hmac;
    }
}

class Rules {
    constructor(moves) {
        this.moves = moves;
        this.n = moves.length;
        this.p = Math.floor(this.n / 2);
    }

    determineWinner(userMove, computerMove) {
        const userIndex = this.moves.indexOf(userMove);
        const computerIndex = this.moves.indexOf(computerMove);
        const result = Math.sign((computerIndex - userIndex + this.p + this.n) % this.n - this.p);
        return result === 0 ? 'Draw' : result > 0 ? 'Computer wins!' : 'You win!';
    }
}

class HelpTable {
    constructor(moves) {
        this.moves = moves;
        this.n = moves.length;
    }

    display() {
        const table = new AsciiTable('').setHeading('PC\\User', ...this.moves);
        this.moves.forEach((move, i) =>
            table.addRow(move, ...this.moves.map((_, j) =>
                i === j ? 'Draw' : (j - i + this.n) % this.n <= this.n / 2 ? 'Win' : 'Lose'
            ))
        );
        console.log(table.toString());
    }
}

class Game {
    constructor(moves) {
        this.validateMoves(moves);
        this.moves = moves;
        this.rules = new Rules(moves);
        this.hmac = new HMAC();
    }

    validateMoves(moves) {
        if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
            throw new Error("Invalid moves. Provide an odd number of unique strings (e.g., rock paper scissors)");
        }
    }

    getRandomMove() {
        return this.moves[Math.floor(Math.random() * this.moves.length)];
    }

    displayGameMoves() {
        const computerMove = this.getRandomMove();
        console.log(`\nHMAC: ${this.hmac.generateHmac(computerMove)} \nAvailable moves:`);
        this.moves.forEach((move, i) => console.log(`${i + 1} - ${move}`));
        console.log(`0 - exit \n? - help`);
        return computerMove; 
    }

    isValidMove(userInput) {
        const moveIndex = Number(userInput);
        return Number.isInteger(moveIndex) && moveIndex > 0 && moveIndex <= this.moves.length;
    }

    displayMoveResult(userInput, computerMove) {
        const inputIndex = Number(userInput);
        const userMove = this.moves[inputIndex - 1];
        const result = this.rules.determineWinner(userMove, computerMove);
        const hmacKeyHex = this.hmac.key.toString('hex');
        console.log(`Your move: ${userMove}\nComputer move: ${computerMove} \n${result}\nHMAC key: ${hmacKeyHex}`);
    }

    handleUserInput(userInput, computerMove) {
        return (userInput === "0") ? (console.log("Exiting the game."), false) 
            : (userInput === "?") ? (new HelpTable(this.moves).display(), true) 
            : (this.isValidMove(userInput)) ? (this.displayMoveResult(userInput, computerMove), true) 
            : (console.log("Invalid input, Please try again."), true);
    }
    
    play() {
        while (true) {
            const computerMove = this.displayGameMoves();
            const userInput = readlineSync.question("Enter your move: ").trim();
            if (!this.handleUserInput(userInput, computerMove)) break;
        }
    }
}

if (require.main === module) {
    const moves = process.argv.slice(2);
    try {
        const game = new Game(moves);
        game.play();
    } catch (error) {
        console.log(`Error: ${error.message}`);
        console.log("Usage example: node game.js rock paper scissors");
    }
}