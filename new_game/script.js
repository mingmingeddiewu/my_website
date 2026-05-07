// ---------- GAME STATE ----------
const hand = ['Paper', 'Scissors', 'Rock'];
const emojis = ['📄', '✂️', '🪨'];
const totalRounds = 5;

let currentRound = 0;
let youWin = 0;
let compWin = 0;

// ---------- DOM ELEMENTS ----------
const youScoreEl = document.getElementById('you-score');
const compScoreEl = document.getElementById('comp-score');
const roundInfoEl = document.getElementById('round-info');
const choicesEl = document.getElementById('choices');
const resultPicksEl = document.getElementById('result-picks');
const resultMsgEl = document.getElementById('result-message');
const finalAreaEl = document.getElementById('final-area');
const logContainerEl = document.getElementById('log-container');

// ---------- PLAY A ROUND ----------
function play(playerChoice) {
    // Robot picks randomly 0-2
    const compChoice = Math.floor(Math.random() * 3);
    currentRound++;

    let message = '';
    let outcome = ''; // 'win', 'lose', or 'draw'

    if (playerChoice === compChoice) {
        message = 'Equal!';
        outcome = 'draw';
    } else if (playerChoice === 0) {          // Paper
        if (compChoice === 1) {               // Scissors beats Paper
            message = 'Sorry! You lost!';
            outcome = 'lose';
            compWin++;
        } else {                              // Paper beats Rock
            message = 'You won!';
            outcome = 'win';
            youWin++;
        }
    } else if (playerChoice === 1) {          // Scissors
        if (compChoice === 0) {               // Scissors beats Paper
            message = 'You won!';
            outcome = 'win';
            youWin++;
        } else {                              // Rock beats Scissors
            message = 'Sorry! You lost!';
            outcome = 'lose';
            compWin++;
        }
    } else if (playerChoice === 2) {          // Rock
        if (compChoice === 0) {               // Paper beats Rock
            message = 'Sorry! You lost!';
            outcome = 'lose';
            compWin++;
        } else {                              // Rock beats Scissors
            message = 'You won!';
            outcome = 'win';
            youWin++;
        }
    }

    // Update UI
    youScoreEl.textContent = youWin;
    compScoreEl.textContent = compWin;

    resultPicksEl.textContent =
        `Yours: ${emojis[playerChoice]} ${hand[playerChoice]}  vs  Robot: ${emojis[compChoice]} ${hand[compChoice]}`;

    resultMsgEl.textContent = message;
    resultMsgEl.className = 'result-message ' + outcome;

    // Log
    addLog(
        `Round ${currentRound}: You chose ${hand[playerChoice]}, Robot chose ${hand[compChoice]} — ${message}`
    );

    // Check if game is over
    if (currentRound >= totalRounds) {
        endGame();
    } else {
        roundInfoEl.textContent = `Round ${currentRound + 1} of ${totalRounds}`;
    }
}

// ---------- END GAME ----------
function endGame() {
    // Disable buttons
    const buttons = choicesEl.querySelectorAll('.choice-btn');
    buttons.forEach(function (btn) {
        btn.disabled = true;
    });

    roundInfoEl.textContent = 'Game Over!';

    let finalText = '';
    let finalClass = '';

    if (youWin === compWin) {
        finalText = "It's a draw! 🤝";
        finalClass = 'draw';
    } else if (youWin > compWin) {
        finalText = `You won with ${youWin} points! 👏🎉`;
        finalClass = 'win';
    } else {
        finalText = `You lost! Robot beat you with ${compWin} points! 😢`;
        finalClass = 'lose';
    }

    finalAreaEl.innerHTML =
        `<div class="final-result ${finalClass}">${finalText}</div>
         <button class="play-again-btn" onclick="resetGame()">🔄 Play Again</button>`;
}

// ---------- RESET ----------
function resetGame() {
    currentRound = 0;
    youWin = 0;
    compWin = 0;

    youScoreEl.textContent = '0';
    compScoreEl.textContent = '0';
    roundInfoEl.textContent = 'Round 1 of ' + totalRounds;
    resultPicksEl.textContent = '';
    resultMsgEl.textContent = 'Pick a hand to start!';
    resultMsgEl.className = 'result-message';
    finalAreaEl.innerHTML = '';
    logContainerEl.innerHTML = '';
    logContainerEl.style.display = 'none';

    // Re-enable buttons
    const buttons = choicesEl.querySelectorAll('.choice-btn');
    buttons.forEach(function (btn) {
        btn.disabled = false;
    });
}

// ---------- LOG HELPER ----------
function addLog(text) {
    logContainerEl.style.display = 'block';
    const p = document.createElement('p');
    p.textContent = text;
    logContainerEl.prepend(p); // newest on top
}