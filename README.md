# Rock Paper Scissors Game

This is a **generalized** rock-paper-scissors game built using Node.js. The game supports any arbitrary odd number of moves and allows for verifying the fairness of the computer's move using HMAC (SHA-256).

#### The game flow:
1. The computer generates a cryptographically secure random key and makes its move.
2. It then generates an HMAC of its move and displays it to the user.
3. The user makes their choice.
4. The computer reveals its move, and the result is displayed (whether the user wins, loses, or draws).
5. The HMAC key is revealed so the user can verify the computer’s move.

#### Features:
- Accepts any odd number (≥ 3) of non-repeating strings as moves.
- Secure random key generation and HMAC calculation using SHA-256.
- Displays a user-friendly menu with a list of available moves.
- Help table showing possible outcomes between moves.
- Detects incorrect input and prompts the user for a correct choice.

## Prerequisites

- Node.js (version 16 or higher) should be installed on your system.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Shahim11/Rock-Paper-Scissors-Game.git
   cd Rock-Paper-Scissors-Game
   ```

2. Install the required npm modules:
   ```
   npm install
   ```
   
    - The following npm modules are used:
      - `crypto`: Built-in module for cryptography (no need to install separately).
      - `readline-sync`: For synchronous user input (install with `npm install readline-sync`).
      - `ascii-table`: For generating ASCII tables (install with `npm install ascii-table`).

## Usage
Run the game by passing an odd number of arguments (≥ 3) as possible moves. 
  ```
  node game.js rock paper scissors lizard Spock
  ```

**Example Game Session:**
  ```
> node game.js rock Spock paper lizard scissors
HMAC: 9ED68097B2D5D9A968E85BD7094C75D00F96680DC43CDD6918168A8F50DE8507
Available moves:
1 - rock
2 - Spock
3 - paper
4 - lizard
5 - scissors
0 - exit
? - help
Enter your move: 3
Your move: paper
Computer move: rock
You win!
HMAC key: BD9BE48334BB9C5EC263953DA54727F707E95544739FCE7359C267E734E380A2
```

**Help Menu Example**

To display the help menu, enter ? when prompted for your move. The help menu uses the ascii-table npm module to display a user-friendly outcome table:

```
Enter your move: ?
.-----------------------------------------------------.
| PC\User  | rock | Spock | paper | lizard | scissors |
|----------|------|-------|-------|--------|----------|
| rock     | Draw | Win   | Win   | Lose   | Lose     |
| Spock    | Lose | Draw  | Win   | Win    | Lose     |
| paper    | Lose | Lose  | Draw  | Win    | Win      |
| lizard   | Win  | Lose  | Lose  | Draw   | Win      |
| scissors | Win  | Win   | Lose  | Lose   | Draw     |
'-----------------------------------------------------'
```

**Exiting the Game**

To exit the game, press 0 when prompted for your move.
```
Enter your move: 0
Exiting the game.
```

**Error Handling**

If an invalid number of moves is provided, or the moves are not unique, the game will display an error message and example usage:
```
> node game.js rock paper
Error: Invalid moves. Provide an odd number of unique strings (e.g., rock paper scissors)
Usage example: node game.js rock paper scissors
```

## How the Game Works

**1. Key and HMAC Generation:**
   - The computer generates a 256-bit cryptographically secure random key using `crypto.randomBytes`.
   - The computer picks a random move from the list of moves and generates an HMAC using SHA-256.

**2. User Move:**
  - The user is shown a list of available moves and asked to select one. If an invalid input is provided, the menu is shown again.
      
**3. Outcome Determination:**
  - The game determines the outcome based on the circular ordering of moves. Half the moves ahead of the chosen move win, and half the moves behind the chosen move lose.
    
**4. Verification:**
  - After the result is shown, the original HMAC key is revealed, allowing the user to verify the HMAC and ensure that the computer did not change its move.
