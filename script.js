// Get the elements
const rockButton = document.getElementById('rock');
const paperButton = document.getElementById('paper');
const scissorsButton = document.getElementById('scissors');
const resultMsg = document.getElementById('result-message');

const choices = ['rock', 'paper', 'scissors'];

// Add click listeners to each button
rockButton.addEventListener('click', () => playGame('rock'));
paperButton.addEventListener('click', () => playGame('paper'));
scissorsButton.addEventListener('click', () => playGame('scissors'));

function playGame(playerChoice) {
    // 1. Get computer's choice
    const computerIndex = Math.floor(Math.random() * 3);
    const computerChoice = choices[computerIndex];

    // 2. Determine the winner
    var resultText = '';
        if (playerChoice === computerChoice) {
            resultText = `It's a draw! (Both chose ${playerChoice})`;
        }
		else if ((playerChoice === 'rock' && computerChoice === 'scissors') || (playerChoice === 'paper' && computerChoice === 'rock') || (playerChoice === 'scissors' && computerChoice === 'paper')) {
            resultText = `You Win! 🎉 (You chose ${playerChoice} and computer chose ${computerChoice})`;
        }
		else {
            resultText = `You Lose! 😢 (You chose ${playerChoice} and computer chose ${computerChoice})`;
        }

    // 3. Display the result
    resultMsg.textContent = resultText;
}