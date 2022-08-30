var holes;
var playerHoles = [];
var allHoles = document.getElementsByClassName("board")[0].children;
var turn = 0; // 0 = player, 1 = cpu
var blocked = 0;
console.log(allHoles);
//TODO
// Computer Win Not being checked
// End on repeat turn not being checked

function initBoard() {
    let holes = document.getElementsByClassName("hole");
    for (let i =0; i < holes.length; i++) {
        holes[i].textContent = "4";
    }
    playerHoles[0] = document.getElementById("player1");
    playerHoles[1] = document.getElementById("player2");
    playerHoles[2] = document.getElementById("player3");
    playerHoles[3] = document.getElementById("player4");
    playerHoles[4] = document.getElementById("player5");
    playerHoles[5] = document.getElementById("player6");

    for (let i = 0; i < playerHoles.length; i++) {
        playerHoles[i].style.cursor = "pointer";
    }
}



function playerMove(id) {
    if (turn == 0) {
        gameLoop(id);
    }
        
}

function checkPlayerEnd() {
    var seedsLeft = 0;
    for (let i = 7; i < 13; i++) {
        seedsLeft += parseInt(allHoles[i].textContent);
    }
    if (seedsLeft == 0) {
        var CPUseeds = 0;
        for (let i = 1; i < 7; i++) {
            CPUseeds += parseInt(allHoles[i].textContent);
            allHoles[i].textContent = "0";
        }
        allHoles[13].textContent =  parseInt(allHoles[13].textContent) + CPUseeds;
        document.getElementById("message").textContent = "Game Over!"

        turn = 0;
        blocked = 1;
    }
}
function checkCPUEnd() {
    var seedsLeft = 0;
    for (let i = 1; i < 7; i++) {
        seedsLeft += parseInt(allHoles[i].textContent);
    }
    if (seedsLeft == 0) {
        var playerSeeds = 0;
        for (let i = 7; i < 13; i++) {
            playerSeeds += parseInt(allHoles[i].textContent);
            allHoles[i].textContent = "0";
        }
        allHoles[0].textContent =  parseInt(allHoles[0].textContent) + playerSeeds;
        document.getElementById("message").textContent = "Game Over!"

        turn = 0;
        blocked = 1;
    }
}

function move(id) {
    if (blocked == 1) {
        return;
    }
    blocked = 1;

    
    var numMoves = parseInt(document.getElementById(id).textContent);
    document.getElementById(id).textContent = 0;
    var index = parseInt(id.slice(-1)) + 7;
    var mode = 0 //0 = forward, 1 = backwards
    
    var intervalID = setInterval(function() {
        allHoles[index].textContent = parseInt(allHoles[index].textContent) + 1;

        
        
        numMoves--;
        if (numMoves == 0) {
            
            if (allHoles[index].id === "playerStore") {
                turn = 0;
                
                document.getElementById("message").textContent = "Go Again!"
                clearInterval(intervalID);
                blocked = 0;
                checkPlayerEnd();
            }
            else if (allHoles[index].textContent == 1 && index > 6 && allHoles[index-6].textContent != "0") {
                
                var total = parseInt(allHoles[index].textContent);
                allHoles[index].textContent = "0";
                total += parseInt(allHoles[index-6].textContent);
                allHoles[index-6].textContent = "0";
                allHoles[13].textContent = parseInt(allHoles[13].textContent) + total;

                checkPlayerEnd();
                checkCPUEnd();
                turn = 1;
                clearInterval(intervalID);
                setTimeout(computerMove, 1000);
            }
            else {
                document.getElementById("message").textContent = "Computer Turn"
                turn = 1;

                checkPlayerEnd();
                clearInterval(intervalID);
                setTimeout(computerMove, 1000);
            }
        }

        if (mode == 0) {
            index++;
            if (index > 13) {
                index = 7;
                mode = 1;
            }
        }
        if (mode == 1) {
            index--;
            if (index < 1) {
                index = 7;
                mode = 0;
            }
        }
    }, 500);
        
    
    
}

function computerMove() {
    while (turn == 0 ) {
        return;
    }
    let b = new Board();
    b.construct(allHoles, turn);
    var startTime = performance.now(); 
    var move = findBest(b);
    var endTime = performance.now();
    console.log("Find Move took ", endTime-startTime, " ms");
    if (move > 3.5) {
        move = 3.5 - Math.abs(3.5 - move);
    }
    else {
        move = 3.5 + Math.abs(3.5-move);
    }
    
    var numMoves = parseInt(allHoles[move].textContent);
    allHoles[move].textContent = 0;
    
    var mode = 1 //0 = forward, 1 = backwards
    index = move - 1;

    var intervalID = setInterval(function() {
        
        allHoles[index].textContent = parseInt(allHoles[index].textContent) + 1;

        numMoves--;
        if (numMoves <= 0) {
            
            if (allHoles[index].id === "CPUstore") {
                turn = 1;
                
                document.getElementById("message").textContent = "Computer Goes Again!"
                clearInterval(intervalID);
                checkCPUEnd();
                computerMove();

            }
            else if (allHoles[index].textContent == 1 && index > 0 && index < 7 && allHoles[index+6].textContent != 0) {
                
                var total = parseInt(allHoles[index].textContent);
                allHoles[index].textContent = "0";
                total += parseInt(allHoles[index+6].textContent);
                allHoles[index+6].textContent = "0";
                allHoles[0].textContent = parseInt(allHoles[0].textContent) + total;
                turn = 0;
                blocked = 0;
                clearInterval(intervalID);
                checkCPUEnd();
                checkPlayerEnd();
                
            }
            else {
                document.getElementById("message").textContent = "Player Turn"
                turn = 0;
                blocked =0;
                clearInterval(intervalID);
                checkCPUEnd();
            }
        }

        if (mode == 0) {
            index++;
            if (index > 12) {
                index = 7;
                mode = 1;
            }
        }
        if (mode == 1) {
            index--;
            if (index < 0) {
                index = 7;
                mode = 0;
            }
        } 
    }, 500);
}
function gameLoop(id) {
    move(id);
    
}


//Simulation Code

class Board {
    construct(elementArray, turn) {
        // 0-6 player holes + store 7-13 cpu holes + store
        this.holes = [];
        for (let i = 0; i < 7; i++) {
            this.holes[i] = parseInt(elementArray[i+7].textContent);
        }
        for (let j = 6; j >= 0; j--) {
            this.holes.push(parseInt(elementArray[j].textContent));
        }
        if (turn == 0) {
            this.playerTurn = true;
        }
        else {
            this.playerTurn = false;
        }
        
    }
    copy(oldBoard) {
        this.holes = [...oldBoard.holes];
        this.playerTurn = oldBoard.playerTurn;
    }

    get pStore() {
        return this.holes[6];
    }
    get CPUstore() {
        return this.holes[13];
    }
    movePlayer(hole) {
        let index = hole-1;
        let numMoves = this.holes[index];
        if (numMoves == 0) {
            return false; //false return means illegal move
        }
        this.holes[index] = 0;
        index += 1;
        while (numMoves != 0) {
            if (index == 13) {
                index = 0;
            }

            this.holes[index] += 1;

            if (numMoves == 1 && index == 6) {
                this.playerTurn = true;
            }
            if (numMoves == 1 && this.holes[index] == 1) { //capture
                let distance = 6-index;
                this.holes[6] += this.holes[index] + this.holes[6+distance];
                this.holes[index] = 0;
                this.holes[6+distance] = 0;
                this.playerTurn = false;
            }
            else {
                this.playerTurn = false;
            }
            numMoves--;
            index++;
        }
    }
    moveCPU(hole) {
        let index = hole+6;
        let numMoves = this.holes[index];
        if (numMoves == 0) {
            return false; //false return means illegal move
        }
        this.holes[index] = 0;
        index += 1;
        while (numMoves != 0) {
            if (index > 13) {
                index = 0;
            }
            if (index == 6) {
                index = 7;
            }

            this.holes[index] += 1;

            if (numMoves == 1 && index == 13) {
                this.playerTurn = false;
            }
            if (numMoves == 1 && this.holes[index] == 1) { //capture
                let distance = index-6;
                this.holes[13] += this.holes[index] + this.holes[6-distance];
                this.holes[index] = 0;
                this.holes[6-distance] = 0;
                this.playerTurn = true;
            }
            else {
                this.playerTurn = true;
            }
            numMoves--;
            index++;
        }
        return true;
    }
    checkEnd() {
        let playerSum = 0;
        for (let i = 0; i < 6; i++) {
            playerSum += this.holes[i];
        }
        if (playerSum == 0) {
            for (let i = 7; i < 13; i++) {
                this.holes[6] += this.holes[i];
                this.holes[i] = 0;
            }
            return true;
        }
        let CPUSum = 0;
        for (let i = 7; i < 13; i++) {
            CPUSum += this.holes[i];
        }
        if (CPUSum == 0) {
            for (let i = 0; i < 6; i++) {
                this.holes[13] += this.holes[i];
                this.holes[i] = 0;
            }
            return true;
        }
        return false;
    }
    score() {
        return this.holes[13]-this.holes[6];
    }
}
function findBest(gameBoard) {
    let bestMove = [-1,-100]; // hole, score
    for (let i = 6; i > 0; i--) {
        let newBoard = new Board();
        newBoard.copy(gameBoard);
        let legal = newBoard.moveCPU(i);
        
        if (legal == false) {
            continue;
        }
        let maxScore = minimax(newBoard, 12, -1000, 1000);
        if (maxScore > bestMove[1]) {
            bestMove = [i,maxScore];
        }

    }
    
    return bestMove[0];
}
function minimax(gameBoard, depth, alpha, beta) {
    if (depth == 0) {
        return gameBoard.score();
    }
    if (gameBoard.playerTurn == false) {
        let bestVal = -100;
        for (let i = 6; i > 0; i--) {
            let newBoard = new Board();
            newBoard.copy(gameBoard);
            let legal = newBoard.moveCPU(i);
            if (legal == false) {
                continue;
            }
            if (newBoard.checkEnd() == true) {
                return gameBoard.score();
            }
            let value = minimax(newBoard, depth-1, alpha, beta);
            bestVal = Math.max(bestVal, value);
            alpha = Math.max(alpha, bestVal);
            if (beta <= alpha) {
                break;
            }
        }
        return bestVal;
    }
    else {
        let bestVal = 100;
        for (let i = 6; i > 0; i--) {
            let newBoard = new Board();
            newBoard.copy(gameBoard);
            let legal = newBoard.movePlayer(i);
            if (legal == false) {
                continue;
            }
            if (newBoard.checkEnd() == true) {
                
                return gameBoard.score();
            }
            let value = minimax(newBoard, depth-1, alpha, beta);
            bestVal = Math.min(bestVal, value);
            beta = Math.min(beta,bestVal);
            if (beta <= alpha) {
                break;
            }
        }
        return bestVal;
    }
    
}

/*
Minimax:
    Try move recursively,
    check turn each iteration, it is possible for one person to go twice
    let x = new Board();
    x.construct(allHoles, turn);
    x.moveCPU(6);
    x.moveCPU(1);
    
*/