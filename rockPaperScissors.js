// Get the elements
const rockButton = document.getElementById('rock');
const paperButton = document.getElementById('paper');
const scissorsButton = document.getElementById('scissors');
const resultMsg = document.getElementById('result-message');
const gameContainer = document.getElementById('game');
const gameOverContainer = document.getElementById('game-over');
const finalPicksMsg = document.getElementById('final-picks');
const choices = ['rock', 'paper', 'scissors'];
// 1, Initiate counter
let roundsPlayed = 0;
const maxRounds = 5;
let choicesArray = [];

// Add click listeners to each button
rockButton.addEventListener('click', () => playGame('rock'));
paperButton.addEventListener('click', () => playGame('paper'));
scissorsButton.addEventListener('click', () => playGame('scissors'));

function playGame(playerChoice) {
    // 2. Get computer's choice]
    const computerIndex = Math.floor(Math.random() * 3);
    const computerChoice = choices[computerIndex];

    // 3. Determine the winner
    let resultText = '';
    if (playerChoice === computerChoice) {
        resultText = `It's a draw! (Both chose ${playerChoice})`;
    }
	else if ((playerChoice === 'rock' && computerChoice === 'scissors') || (playerChoice === 'paper' && computerChoice === 'rock') || (playerChoice === 'scissors' && computerChoice === 'paper')) {
        resultText = `You Win! 🎉 (You chose ${playerChoice} and computer chose ${computerChoice})`;
    }
	else {
        resultText = `You Lose! 😢 (You chose ${playerChoice} and computer chose ${computerChoice})`;
    }

    // 4.Update counter and push choice into array
    roundsPlayed ++;
    choicesArray.push(playerChoice);

    // 5. Display the result
    resultMsg.textContent = `Round ${roundsPlayed}/${maxRounds}: ${resultText}`;

    // 6. Check if game is over
    if (roundsPlayed >= maxRounds) {
        gameContainer.classList.add('hidden');
        gameOverContainer.classList.remove('hidden');

        const emojiMap = {
            'rock': '🗿',
            'paper': '📄',
            'scissors': '✂️'
        };
        
        //7. Exchange element in array using map()
        const emojiArray = choicesArray.map(choice => emojiMap[choice]);

        // 7. Display the array using join method
        finalPicksMsg.textContent = `Your picks were: ${emojiArray.join(', ')}`;
    }
}