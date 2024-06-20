const gamebox = document.getElementById("gamebox");
const gameOutcomeDisplay = document.querySelector(".game-outcome");
const resetSection = document.querySelector(".reset-section");
const resetBtn = document.getElementById("reset-btn");
const resetScoreBtn = document.getElementById("reset-score-btn");
const historyDisplay = document.getElementById("history-display");
const mainBtnContainer = document.querySelector(".main-btn-container");
const headerContainer = document.querySelector(".header-container");
const matchHistoryBtn = document.getElementById("match-history-btn");
const newGameBtn = document.getElementById("new-game-btn");
const player1ScoreBoard = document.getElementById("player1-scoreboard");
const player2ScoreBoard = document.getElementById("player2-scoreboard");
const player1ScoreBoardModal = document.getElementById("player1-scoreboard-modal");
const player2ScoreBoardModal = document.getElementById("player2-scoreboard-modal");
const historyDescriptionContainer = document.querySelector(".history-description-container");
const timelineBtn = document.getElementById("timeline-btn");
const historySection = document.querySelector(".history-section");
const closeModalBtn = document.getElementById("close-modal-btn");
const winSound = document.getElementById("win-sound");
const resetSound = document.getElementById("reset-sound");
const pickSound = document.getElementById("pick-sound");
const drawSound = document.getElementById("draw-sound");

let icon1 = `<i class="fa-solid fa-xmark"></i>`;
let icon2 = `<i class="fa-regular fa-circle"></i>`;

let iconsArray = [`<i class="fa-solid fa-xmark"></i>`,
                 `<i class="fa-regular fa-circle"></i>`,
                 `<i class="fa-regular fa-money-bill-1"></i>`,
                 `<i class="fa-solid fa-yin-yang"></i>`,
                 `<i class="fa-solid fa-atom"></i>`,
                 `<i class="fa-solid fa-peace"></i>`,
                 `<i class="fa-regular fa-moon"></i>`,
                 `<i class="fa-solid fa-meteor"></i>`,
                 `<i class="fa-solid fa-bug"></i>`,
                 `<i class="fa-solid fa-heart"></i>`,
                 `<i class="fa-solid fa-hippo"></i>`,
                 `<i class="fa-solid fa-recycle"></i>`]

let boardArray = [
                    ["", "", ""],
                    ["", "", ""],
                    ["", "", ""]
                ];


let boardHistory = [];


let moveTempStorage = [];

let gameEnd = false;
function createBoard(){
    for(let col = 0; col <= 2; col++){
        for(let row = 0; row <= 2; row++){
            const cube = document.createElement("div");
            cube.classList.add("cube");
            cube.id = `cube${col}${row}`;
            gamebox.append(cube);

            //declarations are made inside the loop so it will be
            //redeclared everytime the createBoard() is called
            //otherwise wouldnt be read once the board is reset
            let cube00 = document.getElementById("cube00");
            let cube01 = document.getElementById("cube01");
            let cube02 = document.getElementById("cube02");
            let cube10 = document.getElementById("cube10");
            let cube11 = document.getElementById("cube11");
            let cube12 = document.getElementById("cube12");
            let cube20 = document.getElementById("cube20");
            let cube21 = document.getElementById("cube21");
            let cube22 = document.getElementById("cube22");

            cube.addEventListener("click", () => {
                //stops the game when there is a winner or tie
                if(gameEnd) return;
                playerMove(cube, col, row);
                checkGameOutcome();
                highlightWinningCubes();
                createTimelineDisplay();
            });
        }
    }
}
createBoard()

let turn = "player 1";
function playerMove(element, col, row){
    //checks if slot in array of array is empty
    if(!boardArray[col][row]){
        if(turn === "player 1"){
            boardArray[col][row] = icon1;
            element.innerHTML = boardArray[col][row];
            turn = "player 2";
            playAudio(pickSound);
        } else if(turn === "player 2"){
            boardArray[col][row] = icon2;
            element.innerHTML = boardArray[col][row];
            turn = "player 1";
            playAudio(pickSound);
        }
        boardHistory.push(saveArray(boardArray));
        recordMoves(row, col)
}}

resetBtn.addEventListener("click", resetBoard)
newGameBtn.addEventListener("click", resetBoard)

function resetBoard(){
    if(gameOutcomeDisplay.textContent) hideContainers();
    gamebox.innerHTML = "";
    turn = "player 1"
    
    createBoard();

    playAudio(resetSound);

    boardHistory = [];

    moveTempStorage = [];

    boardArray = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    gameEnd = false;

    historyDisplay.innerHTML = "";
    historyDescriptionContainer.innerHTML = "";
    historySection.classList.remove("active-modal");
}

//this function saves every phase of the 
//board every time a new move is added
function saveArray(array) {
    if (!Array.isArray(array)) {
        return array;
    }
    // let clone = [];
    // for (let i = 0; i < arr.length; i++) {
    //     clone[i] = cloneArray(arr[i]);
    // }
    // return clone;

    //the below code is essentialy the same as the lloop code above

    return array.map(saveArray);
}

let player1Score = 0;
let player2Score = 0;
function checkGameOutcome(){
    if((boardArray[0][0] === icon1 && boardArray[0][1] === icon1 && boardArray[0][2] === icon1) //horizontal first line
    || (boardArray[1][0] === icon1 && boardArray[1][1] === icon1 && boardArray[1][2] === icon1) //horizontal second line
    || (boardArray[2][0] === icon1 && boardArray[2][1] === icon1 && boardArray[2][2] === icon1) //horizontal third line
    || (boardArray[0][0] === icon1 && boardArray[1][0] === icon1 && boardArray[2][0] === icon1) //vertical first line
    || (boardArray[0][1] === icon1 && boardArray[1][1] === icon1 && boardArray[2][1] === icon1) //vertical second line
    || (boardArray[0][2] === icon1 && boardArray[1][2] === icon1 && boardArray[2][2] === icon1) //vertical third line
    || (boardArray[0][0] === icon1 && boardArray[1][1] === icon1 && boardArray[2][2] === icon1) //diagonal top left to bottom right
    || (boardArray[0][2] === icon1 && boardArray[1][1] === icon1 && boardArray[2][0] === icon1)){ //diagonal top right to bottom left
        gameOutcomeDisplay.textContent = "Player 1 Wins This Round";
        player1Score++
        player1ScoreBoard.textContent = player1Score;
        player1ScoreBoardModal.textContent = player1ScoreBoard.textContent;
        gameEnd = true;
        moveHiddenElements();
        playAudio(winSound);
    } else 
    if((boardArray[0][0] === icon2 && boardArray[0][1] === icon2 && boardArray[0][2] === icon2) //horizontal first line
    || (boardArray[1][0] === icon2 && boardArray[1][1] === icon2 && boardArray[1][2] === icon2) //horizontal second line
    || (boardArray[2][0] === icon2 && boardArray[2][1] === icon2 && boardArray[2][2] === icon2) //horizontal third line
    || (boardArray[0][0] === icon2 && boardArray[1][0] === icon2 && boardArray[2][0] === icon2) //vertical first line
    || (boardArray[0][1] === icon2 && boardArray[1][1] === icon2 && boardArray[2][1] === icon2) //vertical second line
    || (boardArray[0][2] === icon2 && boardArray[1][2] === icon2 && boardArray[2][2] === icon2) //vertical third line
    || (boardArray[0][0] === icon2 && boardArray[1][1] === icon2 && boardArray[2][2] === icon2) //diagonal top left to bottom right
    || (boardArray[0][2] === icon2 && boardArray[1][1] === icon2 && boardArray[2][0] === icon2)){ //diagonal top right to bottom left
        gameOutcomeDisplay.textContent = "Player 2 Wins This Round";
        player2Score++
        player2ScoreBoard.textContent = player2Score;
        player2ScoreBoardModal.textContent = player2ScoreBoard.textContent;
        gameEnd = true;
        moveHiddenElements();
        playAudio(winSound);
    } else if (boardHistory.length === 9){
        gameOutcomeDisplay.textContent = "Tie Round";
        gameEnd = true;
        moveHiddenElements();
        playAudio(drawSound);
    } else {
        gameOutcomeDisplay.textContent = "";
    }
}

function highlightWinningCubes(){
    if((boardArray[0][0] === icon1 && boardArray[0][1] === icon1 && boardArray[0][2] === icon1)
    || (boardArray[0][0] === icon2 && boardArray[0][1] === icon2 && boardArray[0][2] === icon2)){
        addTimedhighlight(cube00, cube01, cube02);
    } else 
    if((boardArray[1][0] === icon1 && boardArray[1][1] === icon1 && boardArray[1][2] === icon1)
    || (boardArray[1][0] === icon2 && boardArray[1][1] === icon2 && boardArray[1][2] === icon2)){
        addTimedhighlight(cube10, cube11, cube12);
    } else 
    if( (boardArray[2][0] === icon1 && boardArray[2][1] === icon1 && boardArray[2][2] === icon1)
    || (boardArray[2][0] === icon2 && boardArray[2][1] === icon2 && boardArray[2][2] === icon2)){
        addTimedhighlight(cube20, cube21, cube22);
    } else 
    if((boardArray[0][0] === icon1 && boardArray[1][0] === icon1 && boardArray[2][0] === icon1)
    ||(boardArray[0][0] === icon2 && boardArray[1][0] === icon2 && boardArray[2][0] === icon2)){
        addTimedhighlight(cube00, cube10, cube20);
    } else
    if((boardArray[0][1] === icon1 && boardArray[1][1] === icon1 && boardArray[2][1] === icon1)
    || (boardArray[0][1] === icon2 && boardArray[1][1] === icon2 && boardArray[2][1] === icon2)){
        addTimedhighlight(cube01, cube11, cube21);
    } else
    if((boardArray[0][2] === icon1 && boardArray[1][2] === icon1 && boardArray[2][2] === icon1)
    || (boardArray[0][2] === icon2 && boardArray[1][2] === icon2 && boardArray[2][2] === icon2)){
        addTimedhighlight(cube02, cube12, cube22);
    } else
    if((boardArray[0][0] === icon1 && boardArray[1][1] === icon1 && boardArray[2][2] === icon1)
    || (boardArray[0][0] === icon2 && boardArray[1][1] === icon2 && boardArray[2][2] === icon2)){
        addTimedhighlight(cube00, cube11, cube22);
    } else
    if((boardArray[0][2] === icon1 && boardArray[1][1] === icon1 && boardArray[2][0] === icon1)
    || (boardArray[0][2] === icon2 && boardArray[1][1] === icon2 && boardArray[2][0] === icon2)){
        addTimedhighlight(cube02, cube11, cube20);
    }
}

function addTimedhighlight(cube1, cube2, cube3){
    let highlightInterval = setInterval(()=>{
         cube1.classList.toggle("highlight-cube");
         cube2.classList.toggle("highlight-cube");
         cube3.classList.toggle("highlight-cube");
     }, 400)
    
     setTimeout(() => {
         clearInterval(highlightInterval)
         cube1.classList.remove("highlight-cube");
         cube2.classList.remove("highlight-cube");
         cube3.classList.remove("highlight-cube");
     }, 2800)
}

const previousBtn = document.getElementById("previous-btn");
const nextBtn = document.getElementById("next-btn");

previousBtn.addEventListener("click", () => {
    if(boardHistory.length === 1) return
    popPushMove(boardHistory, moveTempStorage)
})

nextBtn.addEventListener("click",  () => {
    if(moveTempStorage.length === 0) return;
    popPushMove(moveTempStorage, boardHistory)
})

function popPushMove(popArray,pushArray){
    //pop last move from popArray and push in pushArray
    pushArray.push(popArray.pop())

    gamebox.innerHTML = "";

    for(let col = 0; col <= 2; col++){
        for(let row = 0; row <= 2; row++){
            const cube = document.createElement("div");
            cube.classList.add("cube");

            boardArray[col][row] = boardHistory[boardHistory.length - 1][col][row];
            cube.innerHTML = boardArray[col][row];
            gamebox.append(cube);
}}}

function moveHiddenElements(){
    gameOutcomeDisplay.classList.add("active-container");
    mainBtnContainer.classList.add("active-bottom");
    player1IconsSection.classList.add("active-icon-btn-left");
    player2IconsSection.classList.add("active-icon-btn-right");
    resetSection.style.transform = "scale(0)";
}

function showHistoryElements(){
    headerContainer.classList.toggle("active-container")
    mainBtnContainer.classList.toggle("active-bottom");
    mainBtnContainer.classList.toggle("active-container");
}

function hideContainers(){
    gameOutcomeDisplay.classList.remove("active-container");
    headerContainer.classList.remove("active-container");
    mainBtnContainer.classList.remove("active-container");
    mainBtnContainer.classList.remove("active-bottom");
    player1IconsSection.classList.remove("active-icon-btn-left");
    player1IconsSection.classList.remove("active-icon-full-left");
    player2IconsSection.classList.remove("active-icon-btn-right");
    player2IconsSection.classList.remove("active-icon-full-right");
    resetSection.style.transform = "scale(1)";
}

matchHistoryBtn.addEventListener("click", ()=>{
    showHistoryElements();
})

//function creates the history timeline
function createTimelineDisplay(){
    historyDisplay.innerHTML = "";

    for(let i = 0; i < boardHistory.length; i++){
        const historyContainer = document.createElement("div");
        historyContainer.classList.add("history-container");
        historyContainer.id = `gamebox-${i}`;

        const historyBoard = document.createElement("div");
        historyBoard.classList.add("history-board");
        for(let col = 0; col <= 2; col++){
            for(let row = 0; row <= 2; row++){
                const cube = document.createElement("div");
                cube.classList.add("cube"); 

                cube.innerHTML = boardHistory[i][col][row]

                historyBoard.append(cube);
            }
        }
        historyContainer.append(historyBoard)
        historyDisplay.append(historyContainer);
    }
}

let tempTurn;
function recordMoves(row, col){
    const moveDescription = document.createElement("a");
    moveDescription.href = `#gamebox-${boardHistory.length - 1}`;
    moveDescription.classList.add("history-move");

    turn === "player 2" ? tempTurn = "Player 1": tempTurn = "Player 2"

    moveDescription.textContent = `Move ${boardHistory.length}: ${tempTurn} marked column ${row}, row ${col}.`
    historyDescriptionContainer.append(moveDescription);
}

timelineBtn.addEventListener("click", toggleModal);
closeModalBtn.addEventListener("click", toggleModal);

function toggleModal(){
    historySection.classList.toggle("active-modal");
}

resetScoreBtn.addEventListener("click", () => {
    player1Score = 0;
    player2Score = 0;
    player1ScoreBoard.textContent = player1Score;
    player1ScoreBoardModal.textContent = player1Score;
    player2ScoreBoard.textContent = player2Score;
    player2ScoreBoardModal.textContent = player2Score;
})

function playAudio(audio){
    audio.currentTime = 0;
    audio.play();
}

//change icon section
const player1IconsSection = document.getElementById("player1-icons-section");
const player1Header = document.getElementById("player1-header");
const player1IconsContainer = document.getElementById("player1-icons-container");
const playerSymbol1 = document.getElementById("player-symbol1");

const player2IconsSection = document.getElementById("player2-icons-section");
const player2Header = document.getElementById("player2-header");
const player2IconsContainer = document.getElementById("player2-icons-container");
const playerSymbol2 = document.getElementById("player-symbol2");

player1Header.addEventListener("click", toggleIconContainer)

function toggleIconContainer(){
    player1IconsSection.classList.toggle("active-icon-full-left");
}

player2Header.addEventListener("click", toggleIcon2Container)

function toggleIcon2Container(){
    player2IconsSection.classList.toggle("active-icon-full-right");
}

function displayIconsArray(){
    for(let i = 0; i < iconsArray.length; i++){
        const icon = document.createElement("span");
        icon.classList.add("icon-box");
        icon.innerHTML = iconsArray[i];
        player1IconsContainer.append(icon);
        icon.addEventListener("dblclick", () => swapIcon1Symbol(i));
    }

    for(let i = 0; i < iconsArray.length; i++){
        const icon = document.createElement("span");
        icon.classList.add("icon-box");
        icon.innerHTML = iconsArray[i];
        player2IconsContainer.append(icon);
        icon.addEventListener("dblclick", () => swapIcon2Symbol(i));
    }
}
displayIconsArray();

function swapIcon1Symbol(i){
    //stops player1 from choosing the same icon as player 2
    if(icon2 === iconsArray[i]) return;
    icon1 = iconsArray[i];
    playerSymbol1.innerHTML = icon1;
}

function swapIcon2Symbol(i){
    //stops player1 from choosing the same icon as player 2
    if(icon1 === iconsArray[i]) return;
    icon2 = iconsArray[i];
    playerSymbol2.innerHTML = icon2;
}