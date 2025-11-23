function generateLyrics() {
    let outputDiv = document.getElementById('song-output');
    // Loop from 99 down to 1
    for (let i = 99; i >= 1; i--) {
        // Handle "1 bottle" (singular) vs "99 bottles" (plural)
        let word = "bottles";
        if (i === 1) {
            word = "bottle";
        }
        outputDiv.innerHTML += `<p>${i} ${word} of beer on the wall, ${i} ${word} of beer.<br>`;
        outputDiv.innerHTML += `Take one down and pass it around, `;
        let nextNum = i - 1;
        let nextWord = "bottles";
        
        if (nextNum === 1) {
            nextWord = "bottle";
        }
        
        if (nextNum === 0) {
            outputDiv.innerHTML += `no more bottles of beer on the wall.</p><hr>`;
        } else {
            outputDiv.innerHTML += `${nextNum} ${nextWord} of beer on the wall.</p><hr>`;
        }
    }

    // Final verse
    outputDiv.innerHTML += `<p>No more bottles of beer on the wall, no more bottles of beer.<br>
    Go to the store and buy some more, 99 bottles of beer on the wall.</p>`;
}
