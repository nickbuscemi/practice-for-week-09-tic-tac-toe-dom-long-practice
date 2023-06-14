// Your code here
document.addEventListener('DOMContentLoaded', event => {
    
    // asset and grid set up
    let grid = [];
    let player = Math.floor(Math.random() * 2) + 1;
    let turnsTaken = 0;
    let playerSymbols = {
        1: {
            source: "https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg",
            id: "cross"
        },
        2: {
            source: "https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg",
            id: "circle"
        }
    }
    let gameInProgress = true;

    const board = document.getElementById("board");
    const resetButton = document.getElementById("resetButton")
    const forfeitButton = document.getElementById("forfeit");

    // main event listeners
    board.addEventListener("click", gameLogic);
    resetButton.addEventListener("click", resetGame);
    forfeitButton.addEventListener("click", forfeit);

    // populate the grid
    function populateGrid() {
        for (let i = 0; i < 9; i += 3) {
          let subGrid = [];
          for (let j = 0; j < 3; j++) {
            subGrid.push(document.getElementsByClassName("square")[i + j]);
          }
          grid.push(subGrid);
        }
    }
    populateGrid();
    loadState();

    if(player === 2) {
        computerPlay();
    }

    // Function for the computer to play
    function computerPlay() {
        // Find all empty squares
        let emptySquares = [];
        grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                if(!cell.firstChild) {
                    emptySquares.push({i, j});
                }
            });
        });

        // Select a random square
        let move = emptySquares[Math.floor(Math.random() * emptySquares.length)];

        // Play the move
        const symbol = document.createElement("img");
        symbol.src = playerSymbols[player].source;
        symbol.id = playerSymbols[player].id;
        grid[move.i][move.j].classList.add(player === 1 ? "cross" : "circle");
        grid[move.i][move.j].append(symbol);

        if(turnsTaken >= 5) {
            const gameEnded = checkGameState(player, symbol.id);
            if(gameEnded) {
                return;
            }
        }
        
        // Switch to the other player
        if (gameInProgress) {
            player = player === 1 ? 2 : 1;
        }
    }

    // game logic function
    /*function gameLogic(event) {
        // instantiate an element with img tag
        const symbol = document.createElement("img");
        let target = event.target;
        // if a square already contains a token
        if (target.id === 'cross' || target.id === 'circle') {
            return alert("That spot is already taken");
        }

        // if player1 clicked on a empty square, put an x on empty square
        else if (player === 1 && !target.classList.contains("circle")) {
            turnsTaken++;
            symbol.src = playerSymbols[player].source;
            symbol.id = playerSymbols[player].id;
            target.classList.add("cross");
            target.append(symbol);
            document.getElementById("turn").innerText = `Player2's turn`
            if (turnsTaken >= 5) checkGameState(player, symbol.id);
            player = 2;
        }
        // if player2 clicked on a empty square, put an o on empty square
        else if (player === 2 && !target.classList.contains("cross")) {
            turnsTaken++;
            symbol.src = playerSymbols[player].source;
            symbol.id = playerSymbols[player].id;
            target.classList.add("circle");
            target.append(symbol);
            document.getElementById("turn").innerText = `Player1's turn`
            if (turnsTaken >= 5) checkGameState(player, symbol.id);
            player = 1;
        }
        if (turnsTaken === 9) winGame();
        saveState();
        
    }*/
    function gameLogic(event) {
        // If it's the computer's turn, don't do anything
        if(player === 2) {
            return;
        }
    
        // Get the clicked square
        let target = event.target;
    
        // Check if the square is already occupied
        if(target.firstChild) {
            return alert("That spot is already taken");
        }
    
        // Play the move
        const symbol = document.createElement("img");
        symbol.src = playerSymbols[player].source;
        symbol.id = playerSymbols[player].id;
        target.classList.add(player === 1 ? "cross" : "circle");
        target.append(symbol);
        turnsTaken++;
    
        // Check if the game has ended
        if(turnsTaken >= 5) {
            const gameEnded = checkGameState(player, symbol.id);
            if(gameEnded) {
                return;
            }
        }
    
        // Switch to the other player
        player = player === 1 ? 2 : 1;
    
        // If it's now the computer's turn and the game hasn't ended, play the computer's move
        if(player === 2 && turnsTaken < 9 && gameInProgress) {
            setTimeout(computerPlay, 1000);
        }
    
        saveState();
    }
    

    function forfeit(event) {
        let forfeit = confirm("Forfeit?")
        if (forfeit) {
            if (player === 1) player = 2;
            else player = 1;
            winGame(player);
            resetGame();
      }
    }

    function resetGame() {
        gameInProgress = true;
        board.removeEventListener("click", gameLogic);
        document.querySelectorAll(".square").forEach(div => {
            div.innerHTML = "";
            div.classList.remove("cross");
            div.classList.remove("circle");
        });
        grid = [];
        populateGrid();
        player = Math.floor(Math.random() * 2) + 1;
        turnsTaken = 0;
        board.addEventListener("click", gameLogic);
        localStorage.clear();
    }

    function checkGameState(player, token) {
        const flippedGrid = (() => {
          let newGrid = [];
          // iterate through the column of the grid
          for (const col in grid) {
            // iterate through column element
            let flipped = grid.map(row => row[col]);
            newGrid.push(flipped);
          }
          return newGrid;
        })();
        const forwardSlash = grid[0][0].classList.contains(token) && grid[1][1].classList.contains(token) && grid[2][2].classList.contains(token);
        const backSlash = grid[0][2].classList.contains(token) && grid[1][1].classList.contains(token) && grid[2][0].classList.contains(token);
    
        for (let i = 0; i < 3; i++) {
          if (grid[i].every(el => el.classList.contains(token)) ||
            flippedGrid[i].every(el => el.classList.contains(token)) ||
            forwardSlash ||
            backSlash) {
            winGame(player);
            return true;
          }
        }
        return false;
    }
    function winGame(player = undefined) {
        gameInProgress = false;
        if (player) {
          setTimeout(() => { alert(`Game Over! player ${player} WINS!`); }, 50);
          document.querySelector("h2").innerText = "Winner: Player" + player + "!";
        } else {
          setTimeout(() => { alert("game Ended In a Tie"); }, 50);
        }
        document.querySelector("h2").id = "show";
        board.removeEventListener("click", gameLogic);
        enableButton();
        setTimeout(() => resetGame(), 1000);
    }
    
    function enableButton() {
        document.querySelector("input[type='reset']").disabled = false;
        document.querySelector("input[type='reset']").classList.add("enabled");
    }

    // storage
    // Save state to localStorage
    // Save state to localStorage
    function saveState() {
        const gridState = grid.map(row => row.map(cell => cell.classList.contains('cross') ? 'cross' : (cell.classList.contains('circle') ? 'circle' : '')));
        localStorage.setItem('grid', JSON.stringify(gridState));
        localStorage.setItem('player', player);
        localStorage.setItem('turnsTaken', turnsTaken);
    }


    // Load state from localStorage
    function loadState() {
        const gridStateStr = localStorage.getItem('grid');
        if(gridStateStr) {  // Only attempt to load the state if it exists
            const gridState = JSON.parse(gridStateStr);
            player = parseInt(localStorage.getItem('player'));
            turnsTaken = parseInt(localStorage.getItem('turnsTaken'));

            // Update the grid to reflect the loaded state
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    const cell = grid[i][j];
                    const symbolId = gridState[i][j];
                    if(symbolId) {
                        const symbol = document.createElement('img');
                        symbol.src = playerSymbols[symbolId === 'cross' ? 1 : 2].source;
                        symbol.id = symbolId;
                        cell.appendChild(symbol);
                        cell.classList.add(symbolId);
                    }
                }
            }
        } else {
            // Initialize the variables if there's no saved state
            player = 1;
            turnsTaken = 0;
        }
    }




})